package com.noteshared.api.controllers;

import com.noteshared.models.DTO.NoteDto;
import com.noteshared.services.NotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/note")
public class NoteController extends BaseController{
    private final NotesService _notesService;

    @RequestMapping(method = RequestMethod.GET, value ="/")
    public NoteDto Get() {
        var result = _notesService.GetNote();
        return ResultOf(result);
    }
}