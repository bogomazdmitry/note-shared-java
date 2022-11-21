package com.noteshared.models.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AcceptedRequestSharedNoteNotificationContent
{
    @JsonProperty("fromUserEmail")
    private String FromUserEmail;

    @JsonProperty("noteTextID")
    public int NoteTextID;
}
