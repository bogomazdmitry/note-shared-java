package com.noteshared.controllers;

import com.noteshared.models.CustomHttpError;
import com.noteshared.models.responses.ServiceResponse;
import com.noteshared.models.responses.ServiceResponseT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@Slf4j
public class BaseController {
    protected String getCurrentUserName() {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        var result = principal.getName();
        log.info(result);
        return result;
    }

    protected <TModel> ResponseEntity<TModel> ResultOf(ServiceResponseT<TModel> answer) {
        if (answer.isSuccess())
        {
            return new ResponseEntity<>(answer.getModelRequest(), HttpStatus.OK);
        }
        throw new CustomHttpError(HttpStatus.BAD_REQUEST, answer.getError());
    }

    protected ResponseEntity<String> ResultOf(ServiceResponse answer) {
        if (!answer.isSuccess())
        {
            throw new CustomHttpError(HttpStatus.BAD_REQUEST, answer.getError());
        }
        return new ResponseEntity<>("{}", HttpStatus.OK);
    }
}
