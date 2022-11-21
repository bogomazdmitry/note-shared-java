package com.noteshared.models.DTO;

import lombok.Data;

import java.sql.Date;

@Data
public class NoteHistoryDto {
    private Integer id;

    private Date createdDateTime;

    private Date lastChangesDateTime;

    private Integer noteID;
}
