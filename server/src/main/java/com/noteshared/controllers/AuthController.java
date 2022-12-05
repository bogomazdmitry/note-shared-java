package com.noteshared.controllers;

import com.noteshared.models.requests.SignInUserRequest;
import com.noteshared.models.requests.SignUpUserRequest;
import com.noteshared.models.responses.SignInResponse;
import com.noteshared.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController extends BaseController {

    private final AuthService authService;

    @RequestMapping(method = RequestMethod.POST, value="signin")
    public SignInResponse signIn(@RequestBody SignInUserRequest signInUserRequest) {
        var result = authService.signIn(signInUserRequest);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value="signup")
    public SignUpUserRequest signUp(@RequestBody SignUpUserRequest signUpUserRequest) {
        var result = authService.signUp(signUpUserRequest);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.GET, value="check-unique-email")
    public String checkUniqueEmail(@RequestParam String email) {
        var result = authService.checkUniqueEmail(email);
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.GET, value="check-unique-user-name")
    public String checkUniqueUserName(@RequestParam String userName) {
        var result = authService.checkUniqueUserName(userName);
        return ResultOf(result);
    }
}