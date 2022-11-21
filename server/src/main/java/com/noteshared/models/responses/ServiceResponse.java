package com.noteshared.models.responses;

import lombok.Getter;

@Getter
public class ServiceResponse
{

    public ServiceResponse()
    {
        success = true;
    }

    public ServiceResponse(String error)
    {
        this.error = error;
        success = false;
    }

    private boolean success;

    private String error;
}
