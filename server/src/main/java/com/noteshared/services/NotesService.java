package com.noteshared.services;

import com.noteshared.domain.entities.notedesigns.NoteDesignRepository;
import com.noteshared.domain.entities.notes.Note;
import com.noteshared.domain.entities.notes.NoteRepository;
import com.noteshared.domain.entities.notes.UserRoleForNote;
import com.noteshared.domain.entities.notetexts.NoteTextRepository;
import com.noteshared.domain.entities.users.User;
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
import org.springframework.transaction.annotation.Transactional;

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
    private final NoteTextRepository noteTextRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;
    private final NotificationsService notificationsService;

    // OK
    public ServiceResponseT<NoteDto> getNote(String currentUserName, int noteID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var count = noteList.stream().filter(n -> n.getId() == noteID).findFirst().stream().count();

        var note = noteRepository.findById(noteID).get();
        var noteDto = noteMapper.noteToNoteDto(note);
        if(note.isShared() || count != 0) {
            return new ServiceResponseT<>(noteDto);
        }
        else {
            return new ServiceResponseT<>("Not allowed");
        }
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

    @Transactional
    public ServiceResponse deleteNote(String currentUserName, int noteID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes().stream().filter(n -> n.getId() == noteID);
        var note = noteList.findFirst().get();
        if(note == null) {
            return new ServiceResponse("Not allowed");
        }
        noteRepository.delete(note);
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
        var noteText = noteTextRepository.findById(note.getNoteText().getId()).get();
        var userEmails = noteRepository.findAllByNoteText(noteText).get().stream().map(n -> n.getUser().getEmail());
        return new ServiceResponseT<>(userEmails.collect(Collectors.toList()));
    }

    // OK
    public ServiceResponseT<Collection<String>> getUserNamesListByNoteTextID(String currentUserName, int noteTextID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n ->n.getNoteText() != null &&  n.getNoteText().getId() == noteTextID)
                .findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var noteText = noteTextRepository.findById(note.getNoteText().getId()).get();
        var userNames = noteRepository.findAllByNoteText(noteText).get().stream().map(n -> n.getUser().getUserName());
        return new ServiceResponseT<>(userNames.collect(Collectors.toList()));
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

    public ServiceResponse CanAddSharedUser(String currentUserName, String sharedUserEmail, int noteTextID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteText = noteTextRepository.findById(noteTextID).get();
        var note = noteRepository.findAllByNoteTextAndAndUser(noteText, user).get().stream().findFirst().get();
        if (note != null && note.getUserRole() != UserRoleForNote.Owner)
        {
            return new ServiceResponse("Don't has access");
        }
        var sharedUser = userRepository.findByEmail(sharedUserEmail);
        if (sharedUser.isEmpty())
        {
            return new ServiceResponse("User is not found");
        }
        var dnote = noteText.getNotes()
                .stream().filter(n -> n.getUser().getEmail() == sharedUserEmail)
                .findAny();
        if (!dnote.isEmpty())
        {
            return new ServiceResponse("Shared user also has access");
        }
        return new ServiceResponse();
    }

    public ServiceResponse DeleteSharedUser(String currentUserName, String sharedUserEmail, int noteTextID)
    {
        var note = userRepository.findByUserName(currentUserName).get()
            .getNotes().stream()
            .filter(n -> n.getNoteText().getId() == noteTextID)
            .findFirst().get();
        if (note.getUserRole() != UserRoleForNote.Owner)
        {
            return new ServiceResponse("Don't has access");
        }

        var sharedUser = userRepository.findByEmail(sharedUserEmail).get();
        if (sharedUser == null)
        {
            return new ServiceResponse();
        }

        var deleteNote = sharedUser.getNotes().stream().filter(not -> not.getNoteText().getId() == noteTextID).findFirst().get();
        noteRepository.delete(deleteNote);

        return new ServiceResponse();
    }

    public ServiceResponseT<NoteDto> AcceptSharedNote(String userName, int noteTextID, int notificationID)
    {
        int order = -100;
        var user = userRepository.findByUserName(userName).get();

        var newNote = new Note();
        newNote.setOrder(order); newNote.setUser(user); newNote.setNoteText(noteTextRepository.getById(noteTextID)); newNote.setUserRole(UserRoleForNote.Editor);
        noteRepository.save(newNote);

        notificationsService.deleteNotification(userName, notificationID);

        return new ServiceResponseT<>(noteMapper.noteToNoteDto(newNote));
    }

    public ServiceResponse DeclineSharedNote(String userName, int noteTextID, int notificationID)
    {
        var result = notificationsService.deleteNotification(userName, notificationID);
        return result;
    }

    public ServiceResponseT<String> GetOwnerUserName(String userName, int noteTextID)
    {
        var note = userRepository.findByUserName(userName).get()
                .getNotes().stream()
                .filter(n -> n.getNoteText().getId() == noteTextID)
                .findFirst().get();
        var noteText = noteTextRepository.findById(note.getNoteText().getId()).get();
        var resultNoteID = GetNoteID(userName, noteTextID);
        if (!resultNoteID.isSuccess())
        {
            return new ServiceResponseT<>(resultNoteID);
        }
        note = noteRepository.findAllByNoteTextAndAndUserRole(noteText, UserRoleForNote.Owner).get().stream().findFirst().get();
        if (note == null)
        {
            return new ServiceResponseT<>("Note is not found", true);
        }
        return new ServiceResponseT<>(note.getUser().getUserName(), true);
    }

    public ServiceResponseT<Integer> GetNoteID(String userName, int noteTextID)
    {
        var note = userRepository.findByUserName(userName).get()
            .getNotes().stream()
            .filter(n -> n.getNoteText().getId() == noteTextID)
            .findFirst().get();
        if (note == null)
        {
            return new ServiceResponseT<>("Note is not found");
        }
        return new ServiceResponseT<>(note.getId());
    }
}
