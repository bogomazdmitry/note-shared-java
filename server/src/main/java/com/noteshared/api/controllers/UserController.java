package com.noteshared.api.controllers;

import com.noteshared.models.requests.ChangeUserInfoRequest;
import com.noteshared.models.responses.UserInfoResponse;
import com.noteshared.models.responses.UserInfoTokenResponse;
import com.noteshared.services.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/")
public class UserController extends BaseController {
    private final UsersService usersService;

    @RequestMapping(method = RequestMethod.GET)
    public UserInfoResponse Get()
    {
        var result = usersService.getUserInfo(getCurrentUserName());
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST)
    public UserInfoTokenResponse Post(@RequestBody ChangeUserInfoRequest userInfo)
    {
        var result = usersService.setUserInfo(userInfo, getCurrentUserName());
        return ResultOf(result);
    }

}
