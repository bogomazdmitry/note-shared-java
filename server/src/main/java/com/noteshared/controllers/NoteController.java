package com.noteshared.controllers;

import com.noteshared.domain.entities.notes.UserRoleForNote;
import com.noteshared.domain.entities.users.UserRepository;
import com.noteshared.models.DTO.NoteDesignDto;
import com.noteshared.models.DTO.NoteDto;
import com.noteshared.models.DTO.NoteTextDto;
import com.noteshared.models.requests.AcceptOrDeclineSharedNote;
import com.noteshared.models.requests.AddSharedUserRequest;
import com.noteshared.models.requests.DeleteSharedUserRequest;
import com.noteshared.models.responses.ServiceResponseT;
import com.noteshared.services.NotesService;
import com.noteshared.services.NotificationsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/note")
@Slf4j
public class NoteController extends BaseController{
    private final NotesService notesService;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationsService notificationsService;
    private final UserRepository userRepository;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<NoteDto> Get(int noteID)
    {
        var result = notesService.getNote(getCurrentUserName(), noteID);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<NoteDto> Create(@RequestBody int noteOrder)
    {
        var note = new NoteDto();
        note.setOrder(noteOrder);
        note.setNoteText(new NoteTextDto());
        note.setUserRole(UserRoleForNote.Owner);
        var result = notesService.createNote(getCurrentUserName(), note);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="delete-note")
    public ResponseEntity<String> Delete(@RequestBody int noteID)
    {
        var result = notesService.deleteNote(getCurrentUserName(), noteID);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-note")
    public ResponseEntity<NoteDto> UpdateNote(@RequestBody NoteDto updateNoteDto)
    {
        var result = notesService.updateNote(getCurrentUserName(), updateNoteDto);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-note-design")
    public ResponseEntity<NoteDesignDto> UpdateDesignNote(@RequestBody NoteDesignDto updateNoteDesignDto)
    {
        var result = notesService.updateNoteDesign(getCurrentUserName(), updateNoteDesignDto);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.GET, value="shared-users-emails")
    public ResponseEntity<Collection<String>> GetSharedUserEmails(int noteTextID)
    {
        var result = notesService.getUserEmailListByNoteTextID(getCurrentUserName(), noteTextID);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-note-text")
    public ResponseEntity<NoteTextDto> UpdateNoteText(@RequestBody NoteTextDto noteTextDto) {
        var resultUpdate = notesService.updateNoteText(getCurrentUserName(), noteTextDto);
        if(!resultUpdate.isSuccess()) {
            return ResultOf(resultUpdate);
        }
        var resultUserNames = notesService.getUserNamesListByNoteTextID(getCurrentUserName(), noteTextDto.getId());
        if(resultUserNames.isSuccess()) {
            for (var userName : resultUserNames.getModelRequest()) {
                messagingTemplate.convertAndSendToUser(
                        userName, "/update-note-text",
                        resultUpdate.getModelRequest());
            }
        }
        return ResultOf(resultUpdate);
    }

    @RequestMapping(method = RequestMethod.POST, value="share-note-with-user")
    public void ShareNoteWithUser(@RequestBody AddSharedUserRequest request)
    {
        var result = notesService.CanAddSharedUser(getCurrentUserName(), request.getEmail(), request.getNoteTextID());
        if (!result.isSuccess())
        {
            ResultOf(result);
        }

        try {
            var resultNotificationDto = notificationsService.SendRequestSharedNotification(getCurrentUserName(), request.getEmail(), request.getNoteTextID());
            if (!resultNotificationDto.isSuccess())
            {
                resultNotificationDto.ConvertToServiceResponse();
                return;
            }
            var sharedUser = userRepository.findByEmail(request.getEmail()).get();

            messagingTemplate.convertAndSendToUser(
                    getCurrentUserName(), "/send-new-notification",
                    resultNotificationDto.getModelRequest());
        }
        catch (Exception ex) {}
    }

    @RequestMapping(method = RequestMethod.POST, value="accept-shared-note")
    public ResponseEntity<NoteDto> AcceptSharedNote(@RequestBody AcceptOrDeclineSharedNote request)
    {
        var result = notesService.AcceptSharedNote(getCurrentUserName(), request.getNoteTextID(), request.getNotificationID());
        var ownerNoteUserNameResult = notesService.GetOwnerUserName(getCurrentUserName(), request.getNoteTextID());

        if (!ownerNoteUserNameResult.isSuccess())
        {
            return ResultOf(new ServiceResponseT<>(ownerNoteUserNameResult.getError()));
        }

        var ownerNoteUserName = ownerNoteUserNameResult.getModelRequest();
        try {
            var resultNotificationDto = notificationsService.SendAcceptRequestSharedNotification(getCurrentUserName(), ownerNoteUserName, request.getNoteTextID());


            messagingTemplate.convertAndSendToUser(
                    ownerNoteUserName, "/send-new-notification",
                    resultNotificationDto.getModelRequest());
        } catch(Exception ex){}

        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="decline-shared-note")
    public void DeclineSharedNote(@RequestBody AcceptOrDeclineSharedNote request)
    {
        var result = notesService.DeclineSharedNote(getCurrentUserName(), request.getNoteTextID(), request.getNotificationID());
        var ownerNoteIDResult = notesService.GetOwnerUserName(getCurrentUserName(), request.getNoteTextID());

        if (!ownerNoteIDResult.isSuccess())
        {
            return;
        }

        var ownerNoteID = ownerNoteIDResult.getModelRequest();

        try {
            var resultNotificationDto = notificationsService.SendDeclineRequestSharedNotification(getCurrentUserName(), ownerNoteID, request.getNoteTextID());

            messagingTemplate.convertAndSendToUser(
                    ownerNoteID, "/send-new-notification",
                    resultNotificationDto.getModelRequest());
        }catch (Exception ex){}
    }


    @RequestMapping(method = RequestMethod.POST, value="delete-shared-user")
    public void DeleteSharedUser(@RequestBody DeleteSharedUserRequest deleteSharedUserRequest)
    {
        var sharedUser = userRepository.findByEmail(deleteSharedUserRequest.getEmail()).get();
        if (sharedUser != null)
        {
            var noteID = notesService.GetNoteID(sharedUser.getUserName(), deleteSharedUserRequest.getNoteTextID());
            messagingTemplate.convertAndSendToUser(
                    sharedUser.getUserName(), "/delete-note-from-owner",
                    noteID.getModelRequest());
        }
        var result = notesService.DeleteSharedUser(getCurrentUserName(), deleteSharedUserRequest.getEmail(), deleteSharedUserRequest.getNoteTextID());
        ResultOf(result);
    }
}