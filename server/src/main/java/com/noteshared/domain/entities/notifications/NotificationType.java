package com.noteshared.domain.entities.notifications;

import com.fasterxml.jackson.annotation.JsonValue;

public enum NotificationType {
    RequestSharedNoteType,
    AcceptedRequestSharedNoteType,
    DeclinedRequestSharedNoteType;

    @JsonValue
    public int getCode() {
        return ordinal();
    }
}
