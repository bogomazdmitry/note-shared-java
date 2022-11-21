package com.noteshared.services;

import com.noteshared.domain.entities.notes.NoteRepository;
import com.noteshared.models.DTO.NoteDto;
import com.noteshared.mappers.NoteMapper;
import com.noteshared.models.responses.ServiceResponseT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotesService {
    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;

    public ServiceResponseT<NoteDto> GetNote() {
        var note = noteRepository.getById(1);
        var noteDto = noteMapper.noteToNoteDto(note);
        return new ServiceResponseT<>(noteDto);
    }
}
