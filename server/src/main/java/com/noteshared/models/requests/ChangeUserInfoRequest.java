package com.noteshared.models.requests;

import lombok.Data;

@Data
public class ChangeUserInfoRequest
{
    private String email;

    private String userName;

    private String oldPassword;

    private String newPassword;

    private String confirmNewPassword;
}

