package com.noteshared.models.DTO;

import com.noteshared.domain.entities.notes.UserRoleForNote;
import com.noteshared.domain.entities.notetexts.NoteText;
import lombok.Data;

@Data
public class NoteDto {
    private Integer id;

    private Integer order;

    private Integer noteTextID;

    private NoteTextDto noteText;

    private Integer designID;

    private NoteDesignDto noteDesign;

    private Integer historyID;

    private NoteHistoryDto noteHistory;

    private String userID;

    private UserRoleForNote userRole;
}
