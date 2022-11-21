package com.noteshared.models.requests;

import lombok.Data;

@Data
public class AddSharedUserRequest
{
    private String email;

    private int noteTextID;
}
