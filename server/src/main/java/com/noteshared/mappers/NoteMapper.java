package com.noteshared.mappers;

import com.noteshared.domain.entities.notedesigns.NoteDesign;
import com.noteshared.domain.entities.notehistories.NoteHistory;
import com.noteshared.domain.entities.notes.Note;
import com.noteshared.domain.entities.notetexts.NoteText;
import com.noteshared.models.DTO.NoteDesignDto;
import com.noteshared.models.DTO.NoteDto;
import com.noteshared.models.DTO.NoteHistoryDto;
import com.noteshared.models.DTO.NoteTextDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    NoteDto noteToNoteDto(Note note);
    Note noteDtoToNote(NoteDto note);

    NoteTextDto noteTextToNoteTextDto(NoteText noteText);
    NoteText noteTextDtoToNoteText(NoteTextDto noteText);

    NoteDesignDto noteDesignToNoteDesignDto(NoteDesign noteDesign);
    NoteDesign noteDesignDtoToNoteDesign(NoteDesignDto noteDesign);

    NoteHistoryDto noteHistoryToNoteHistoryDto(NoteHistory noteHistory);
    NoteHistory noteHistoryDtoToNoteHistory(NoteHistoryDto noteHistory);
}
