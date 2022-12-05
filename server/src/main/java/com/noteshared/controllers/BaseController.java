package com.noteshared.controllers;

import com.noteshared.models.responses.ServiceResponse;
import com.noteshared.models.responses.ServiceResponseT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    protected <TModel> TModel ResultOf(ServiceResponseT<TModel> answer) {
        if (answer.isSuccess())
        {
            return answer.getModelRequest();
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, answer.getError());
    }

    protected String ResultOf(ServiceResponse answer) {
        if (!answer.isSuccess())
        {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, answer.getError());
        }
        return "OK";
    }
}
