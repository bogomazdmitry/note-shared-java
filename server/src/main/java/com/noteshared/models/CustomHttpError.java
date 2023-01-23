package com.noteshared.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CustomHttpError extends ResponseStatusException {
    private String errorMessage;

    public CustomHttpError(HttpStatus status, String errorMessage) {
        super(status);
        this.errorMessage = errorMessage;
    }


    public String getErrorMessage() {
        return errorMessage;
    }
}
