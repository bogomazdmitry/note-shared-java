package com.noteshared.models.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RequestSharedNoteNotificationContent
{
    private String fromUserEmail;

    public int noteTextID;
}
