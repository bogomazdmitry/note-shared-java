package com.noteshared.models.requests;

import lombok.Data;

@Data
public class SignUpUserRequest
{
    private String email;

    private String userName;

    private String password;

    private String confirmPassword;
}
