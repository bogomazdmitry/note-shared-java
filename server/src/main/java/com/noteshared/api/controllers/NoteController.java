package com.noteshared.api.controllers;

import com.noteshared.models.DTO.NoteDesignDto;
import com.noteshared.models.DTO.NoteDto;
import com.noteshared.models.DTO.NoteTextDto;
import com.noteshared.services.NotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/note")
public class NoteController extends BaseController{
    private final NotesService notesService;

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

    @RequestMapping(method = RequestMethod.DELETE)
    public void Delete(int noteID)
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
}