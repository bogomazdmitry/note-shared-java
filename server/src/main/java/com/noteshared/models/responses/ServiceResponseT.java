package com.noteshared.models.responses;

import lombok.Getter;

@Getter
public class ServiceResponseT<TModel>
{
    public ServiceResponseT() { }

    public ServiceResponseT(String error)
    {
        this.error = error;
        success = false;
    }

    public ServiceResponseT(TModel modelRequest)
    {
        this.modelRequest = modelRequest;
        success = true;
    }

    public ServiceResponseT(TModel modelRequest, boolean isString)
    {
        this.modelRequest = modelRequest;
        success = true;
    }

    public ServiceResponseT(ServiceResponse answerRequest)
    {
        error = answerRequest.getError();
        success = answerRequest.isSuccess();
    }

    public <U> ServiceResponseT(ServiceResponseT<U> answerRequest)
    {
        error = answerRequest.getError();
        success = answerRequest.isSuccess();
    }

    public ServiceResponse ConvertToServiceResponse()
    {
        ServiceResponse serviceResponse;
        if (success)
        {
            serviceResponse = new ServiceResponse();
        }
        else
        {
            serviceResponse = new ServiceResponse(error);
        }
        return serviceResponse;
    }

    private boolean success;

    private String error;

    private TModel modelRequest;
}
