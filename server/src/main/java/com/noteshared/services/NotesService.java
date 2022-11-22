package com.noteshared.services;

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
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotesService {
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    public ServiceResponseT<NoteDto> getNote(String currentUserName, int noteID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getId() == noteID).findFirst().get();
        var noteDto = noteMapper.noteToNoteDto(note);
        return new ServiceResponseT<>(noteDto);
    }

    public ServiceResponseT<NoteDto> createNote(String currentUserName, NoteDto noteDto) {
        var user = userRepository.findByUserName(currentUserName).get();
        var note = noteMapper.noteDtoToNote(noteDto);
        note.setUser(user);
        note.setNoteText(null);
        note.setUser(user);
        user.getNotes().add(note);
        noteRepository.save(note);
        var newNoteDto = noteMapper.noteToNoteDto(note);
        return new ServiceResponseT<>(newNoteDto);
    }

    public ServiceResponse deleteNote(String currentUserName, int noteID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getId() == noteID).findFirst().get();
        if(note == null) {
            return new ServiceResponse("Not allowed");
        }
        noteRepository.delete(note);
        return new ServiceResponse();
    }

    public ServiceResponseT<NoteDto> updateNote(String currentUserName, NoteDto updateNoteDto) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getId() == updateNoteDto.getId()).findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        updateNoteDto.setUserRole(note.getUserRole());

        note = noteMapper.noteDtoToNote(updateNoteDto);
        var updatedNote = noteRepository.save(note);

        var updatedNoteDto = noteMapper.noteToNoteDto(updatedNote);
        return new ServiceResponseT<NoteDto>(updatedNoteDto);
    }

    public ServiceResponseT<NoteDesignDto> updateNoteDesign(String currentUserName, NoteDesignDto updateNoteDesignDto) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getId() == updateNoteDesignDto.getNoteID()).findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var oldNoteDesign = note.getNoteDesign();
        var newNoteDesign = noteMapper.noteDesignDtoToNoteDesign(updateNoteDesignDto);
        newNoteDesign.setId(oldNoteDesign.getId());

        note.setNoteDesign(newNoteDesign);
        noteRepository.save(note);
        var newNoteDesignDto = noteMapper.noteDesignToNoteDesignDto(newNoteDesign);
        return new ServiceResponseT<>(newNoteDesignDto);
    }

    public ServiceResponseT<Collection<String>> getUserEmailListByNoteTextID(String currentUserName, int noteTextID) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var note = noteList.stream().filter(n -> n.getNoteText().getId() == noteTextID).findFirst().get();
        if(note == null) {
            return new ServiceResponseT<>("Not allowed");
        }
        var userEmails = note.getNoteText().getNotes().stream().map(n -> n.getUser().getEmail());
        return new ServiceResponseT<>(userEmails.collect(Collectors.toList()));
    }

    public ServiceResponseT<List<NoteDto>> getAllNotes(String currentUserName) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        var noteDto = noteList.stream().map(n -> noteMapper.noteToNoteDto(n));
        return new ServiceResponseT<>(noteDto.collect(Collectors.toList()));
    }

    public ServiceResponseT<List<NoteOrderDto>> updateOrderNotes(String currentUserName, List<NoteOrderDto> notesOrder) {
        var user = userRepository.findByUserName(currentUserName).get();
        var noteList = user.getNotes();
        noteList.stream().parallel().forEach(n -> {
            n.setOrder(notesOrder.stream().filter(n1 -> n1.getId() == n.getId()).findFirst().get().getOrder());
        });
        noteRepository.saveAll(noteList);
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
}
