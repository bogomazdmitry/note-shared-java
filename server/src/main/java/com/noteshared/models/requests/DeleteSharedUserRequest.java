package com.noteshared.models.requests;

import lombok.Data;

@Data
public class DeleteSharedUserRequest
{
    private String email;

    private int noteTextID;
}
