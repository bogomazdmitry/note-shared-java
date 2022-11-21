package com.noteshared.models.requests;

import lombok.Data;

@Data
public class SignInUserRequest
{
    private String email;

    private String password;
}
