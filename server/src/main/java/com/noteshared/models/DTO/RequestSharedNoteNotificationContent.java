package com.noteshared.models.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestSharedNoteNotificationContent
{
    @JsonProperty("fromUserEmail")
    private String FromUserEmail;

    @JsonProperty("noteTextID")
    public int NoteTextID;
}
