package com.noteshared.controllers;

import com.noteshared.models.DTO.NoteDesignDto;
import com.noteshared.models.DTO.NoteDto;
import com.noteshared.models.DTO.NoteTextDto;
import com.noteshared.services.NotesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @RequestMapping(method = RequestMethod.GET)
    public NoteDto Get(int noteID)
    {
        var result = notesService.getNote(getCurrentUserName(), noteID);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST)
    public NoteDto Create(@RequestBody int noteOrder)
    {
        var note = new NoteDto();
        note.setOrder(noteOrder);
        note.setNoteText(new NoteTextDto());
        var result = notesService.createNote(getCurrentUserName(), note);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="delete-note")
    public void Delete(@RequestBody int noteID)
    {
        var result = notesService.deleteNote(getCurrentUserName(), noteID);
        ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-note")
    public NoteDto UpdateNote(@RequestBody NoteDto updateNoteDto)
    {
        var result = notesService.updateNote(getCurrentUserName(), updateNoteDto);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-note-design")
    public NoteDesignDto UpdateDesignNote(@RequestBody NoteDesignDto updateNoteDesignDto)
    {
        var result = notesService.updateNoteDesign(getCurrentUserName(), updateNoteDesignDto);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.GET, value="shared-users-emails")
    public Collection<String> GetSharedUserEmails(int noteTextID)
    {
        var result = notesService.getUserEmailListByNoteTextID(getCurrentUserName(), noteTextID);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-note-text")
    public NoteTextDto UpdateNoteText(@RequestBody NoteTextDto noteTextDto) {
        var resultUpdate = notesService.updateNoteText(getCurrentUserName(), noteTextDto);
        if(!resultUpdate.isSuccess()) {
            return ResultOf(resultUpdate);
        }
        var resultEmails = notesService.getUserEmailListByNoteTextID(getCurrentUserName(), noteTextDto.getId());
        if(resultEmails.isSuccess()) {
            for (var userEmail : resultEmails.getModelRequest()) {
                messagingTemplate.convertAndSendToUser(
                        userEmail, "/update-note-text",
                        resultUpdate.getModelRequest());
            }
        }
        return ResultOf(resultUpdate);
    }
}