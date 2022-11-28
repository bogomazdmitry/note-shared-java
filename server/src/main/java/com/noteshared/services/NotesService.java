package com.noteshared.services;

import com.noteshared.domain.entities.notedesigns.NoteDesignRepository;
import com.noteshared.domain.entities.notes.Note;
import com.noteshared.domain.entities.notes.NoteRepository;
import com.noteshared.domain.entities.notes.UserRoleForNote;
import com.noteshared.domain.entities.users.UserRepository;
import com.noteshared.models.DTO.NoteDesignDto;
import com.noteshared.models.DTO.NoteDto;
import com.noteshared.mappers.NoteMapper;
import com.noteshared.models.DTO.NoteOrderDto;
import com.noteshared.models.DTO.NoteTextDto;
import com.noteshared.models.responses.ServiceResponse;
import com.noteshared.models.responses.ServiceResponseT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotesService {
    private final NoteRepository noteRepository;
    private final NoteDesignRepository noteDesignRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    // OK
    public ServiceResponseT<NoteDto> getNote(String currentUserName, int noteID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getId() == noteID).findFirst().get();
        var noteDto = noteMapper.noteToNoteDto(note);
        return new ServiceResponseT<>(noteDto);
    }

    // OK
    public ServiceResponseT<NoteDto> createNote(String currentUserName, NoteDto noteDto) {
        var user = userRepository.findByUserName(currentUserName).get();
        var note = noteMapper.noteDtoToNote(noteDto);
        note.setUser(user);
        noteRepository.save(note);
        var newNoteDto = noteMapper.noteToNoteDto(note);
        return new ServiceResponseT<>(newNoteDto);
    }

    public ServiceResponse deleteNote(String currentUserName, int noteID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes().stream().filter(n -> n.getId() == noteID);
        var note = noteList.findFirst().get();
        if(note == null) {
            return new ServiceResponse("Not allowed");
        }
        noteRepository.deleteById(note.getId());
        return new ServiceResponse();
    }

    public ServiceResponseT<NoteDto> updateNote(String currentUserName, NoteDto updateNoteDto) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();

        var note = (Note)noteList.stream().filter(n -> n.getId() == updateNoteDto.getId()).toArray()[0];
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        updateNoteDto.setUserRole(note.getUserRole());

        note = noteMapper.noteDtoToNote(updateNoteDto);
        var updatedNote = noteRepository.save(note);

        var updatedNoteDto = noteMapper.noteToNoteDto(updatedNote);
        return new ServiceResponseT<NoteDto>(updatedNoteDto);
    }

    // OK
    public ServiceResponseT<NoteDesignDto> updateNoteDesign(String currentUserName, NoteDesignDto updateNoteDesignDto) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getId() == updateNoteDesignDto.getNoteID()).findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var oldNoteDesign = note.getNoteDesign();
        var newNoteDesign = noteMapper.noteDesignDtoToNoteDesign(updateNoteDesignDto);
        if(oldNoteDesign != null) {
            newNoteDesign.setId(oldNoteDesign.getId());
        }

        note.setNoteDesign(newNoteDesign);
        noteRepository.save(note);

        var newNoteDesignDto = noteMapper.noteDesignToNoteDesignDto(newNoteDesign);
        return new ServiceResponseT<>(newNoteDesignDto);
    }

    // OK
    public ServiceResponseT<Collection<String>> getUserEmailListByNoteTextID(String currentUserName, int noteTextID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n ->n.getNoteText() != null &&  n.getNoteText().getId() == noteTextID)
                .findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var userEmails = note.getNoteText().getNotes().stream().map(n -> n.getUser().getEmail());
        return new ServiceResponseT<>(userEmails.collect(Collectors.toList()));
    }

    // OK
    public ServiceResponseT<List<NoteDto>> getAllNotes(String currentUserName) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        noteList.sort(Comparator.comparing(n1->n1.getOrder()));
        var noteDto = noteList.stream().map(n -> noteMapper.noteToNoteDto(n));
        return new ServiceResponseT<>(noteDto.collect(Collectors.toList()));
    }

    // OK
    public ServiceResponseT<List<NoteOrderDto>> updateOrderNotes(String currentUserName, List<NoteOrderDto> notesOrder) {
        var user = userRepository.findByUserName(currentUserName).get();

        user.getNotes().stream().forEach(n -> {
            n.setOrder(notesOrder.stream().filter(n1 -> n1.getId() == n.getId()).findFirst().get().getOrder());
        });
        userRepository.save(user);
        return new ServiceResponseT<>(notesOrder);
    }

    public ServiceResponseT<NoteTextDto> updateNoteText(String currentUserName, NoteTextDto updateNoteTextDto)
    {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getNoteText().getId() == updateNoteTextDto.getId()).findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var oldNoteText = note.getNoteText();
        var newNoteText = noteMapper.noteTextDtoToNoteText(updateNoteTextDto);
        newNoteText.setId(oldNoteText.getId());

        note.setNoteText(newNoteText);
        noteRepository.save(note);
        var newNoteTextDto = noteMapper.noteTextToNoteTextDto(newNoteText);
        return new ServiceResponseT<>(newNoteTextDto);
    }

    public ServiceResponseT<List<Integer>> GetUserIDListByNoteTextID(String currentUserName, int noteTextID)
    {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getNoteText().getId() == noteTextID).findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var userIdList = note.getNoteText().getNotes().stream().map(n -> n.getUser().getId());
        return new ServiceResponseT<>(userIdList.collect(Collectors.toList()));
    }


//    public async Task<ServiceResponse> CanAddSharedUser(string currentUserID, string sharedUserEmail, int noteTextID)
//    {
//        if (!_repositoryNoteTexts.HasAccessForUser(noteTextID, currentUserID))
//        {
//            return new ServiceResponse("Not allowed");
//        }
//        var note = await _repositoryNotes.GetByAsync(note => note.UserID == currentUserID && note.NoteTextID == noteTextID);
//
//        if (note.UserRole != UserRoleForNote.Owner)
//        {
//            return new ServiceResponse("Don't has access");
//        }
//
//        var sharedUser = await _repositoryUsers.GetByAsync(el => el.Email == sharedUserEmail);
//        if (sharedUser == null)
//        {
//            return new ServiceResponse("User is not found");
//        }
//
//        var noteText = await _repositoryNoteTexts.GetByAsync(el => el.ID == noteTextID, el => el.Notes);
//        var douplicateUserAccess = noteText.Notes.Any(note => note.UserID == sharedUser.Id);
//        if (douplicateUserAccess)
//        {
//            return new ServiceResponse("Shared user also has access");
//        }
//
//        return new ServiceResponse();
//    }
//
//    public ServiceResponse DeleteSharedUser(String currentUserName, String sharedUserEmail, int noteTextID)
//    {
//        if (!_repositoryNoteTexts.HasAccessForUser(noteTextID, currentUserID))
//        {
//            return new ServiceResponse("Not allowed");
//        }
//
//        var note = await _repositoryNotes.GetByAsync(note => note.UserID == currentUserID && note.NoteTextID == noteTextID);
//        if (note.UserRole != UserRoleForNote.Owner)
//        {
//            return new ServiceResponse("Don't has access");
//        }
//
//        var sharedUser = await _repositoryUsers.GetByAsync(user => user.Email == sharedUserEmail);
//        if (sharedUser == null)
//        {
//            return new ServiceResponse();
//        }
//
//        var deleteNote = await _repositoryNotes.GetByAsync(note => note.NoteTextID == noteTextID && note.UserID == sharedUser.Id);
//        await _repositoryNotes.RemoveAsync(deleteNote);
//
//        return new ServiceResponse();
//    }
//
//    public async Task<ServiceResponse<NoteDto>> AcceptSharedNote(string userID, int noteTextID, int notificationID)
//    {
//        int order = 0;
//        if (_repositoryNotes.HasNote(userID))
//        {
//            order = _repositoryNotes.GetMinimalNoteOrder(userID) - 1;
//        }
//
//        var newNote = new Note { Order = order, UserID = userID, NoteTextID = noteTextID, UserRole = UserRoleForNote.Editor };
//        await _repositoryNotes.CreateAsync(newNote);
//        newNote = await _repositoryNotes.GetByAsync(el => el.ID == newNote.ID, el => el.NoteText);
//
//        NoteDto newNoteDto = _mapper.Map<NoteDto>(newNote);
//
//        await _notificationsService.DeleteNotification(userID, notificationID);
//
//        return new ServiceResponse<NoteDto>(newNoteDto);
//    }
//
//    public async Task<ServiceResponse> DeclineSharedNote(string userID, int noteTextID, int notificationID)
//    {
//        var result = await _notificationsService.DeleteNotification(userID, notificationID);
//        return result;
//    }
//
//    public async Task<ServiceResponse<string>> GetOwnerID(string userID, int noteTextID)
//    {
//        var resultNoteID = await GetNoteID(userID, noteTextID);
//        if (!resultNoteID.Success)
//        {
//            return new ServiceResponse<string>(error: resultNoteID.Error);
//        }
//        if (!(await _repositoryNotes.HasAccessForUser(resultNoteID.ModelRequest, userID)))
//        {
//            return new ServiceResponse<string>(error: "Not allowed");
//        }
//        var note = await _repositoryNotes.GetByAsync(note => note.NoteTextID == noteTextID && note.UserRole == UserRoleForNote.Owner);
//        if (note == null)
//        {
//            return new ServiceResponse<string>(error: "Note is not found");
//        }
//        return new ServiceResponse<string>(modelRequest: note.UserID);
//    }
//
//    public async Task<ServiceResponse<int>> GetNoteID(string userID, int noteTextID)
//    {
//        var note = await _repositoryNotes.GetByAsync(note => note.NoteTextID == noteTextID && note.UserID == userID);
//        if (note == null)
//        {
//            return new ServiceResponse<int>("Note is not found");
//        }
//        return new ServiceResponse<int>(note.ID);
//    }
}
