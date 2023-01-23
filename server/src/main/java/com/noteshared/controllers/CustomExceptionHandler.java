package com.noteshared.controllers;

import com.noteshared.models.CustomHttpError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(CustomHttpError.class)
    public ResponseEntity<String> handleResponseStatusException(CustomHttpError ex) {
        return ResponseEntity.status(ex.getStatus()).body(ex.getErrorMessage());
    }
}
