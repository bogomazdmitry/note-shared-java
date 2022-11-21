package com.noteshared.models.responses;

import lombok.Data;

@Data
public class SignInResponse {
    private String email;
    private String token;
}
