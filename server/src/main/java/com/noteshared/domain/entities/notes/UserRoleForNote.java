package com.noteshared.domain.entities.notes;

import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRoleForNote {
    Editor, Owner;

    @JsonValue
    public int getCode() {
        return ordinal();
    }
}
