package com.noteshared.api.controllers;

import com.noteshared.models.DTO.NoteDto;
import com.noteshared.models.DTO.NoteOrderDto;
import com.noteshared.services.NotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/notes")
public class NotesController extends BaseController{
    private final NotesService notesService;

    @RequestMapping(method = RequestMethod.GET)
    public List<NoteDto> Get()
    {
        var result = notesService.getAllNotes(getCurrentUserName());
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="update-order")
    public List<NoteOrderDto> UpdateOrder(@RequestBody List<NoteOrderDto> notesOrder)
    {
        var result = notesService.updateOrderNotes(getCurrentUserName(), notesOrder);
        return ResultOf(result);
    }
}
