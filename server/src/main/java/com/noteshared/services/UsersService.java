package com.noteshared.services;

import com.noteshared.domain.entities.users.User;
import com.noteshared.domain.entities.users.UserRepository;
import com.noteshared.mappers.UserMapper;
import com.noteshared.models.requests.ChangeUserInfoRequest;
import com.noteshared.models.responses.ServiceResponseT;
import com.noteshared.models.responses.UserInfoResponse;
import com.noteshared.models.responses.UserInfoTokenResponse;
import com.noteshared.security.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UsersService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    @Transactional
    public User findUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadCredentialsException(HttpStatus.BAD_REQUEST +
                    String.format(" email cannot be null or empty"));
        }
        User result;
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            result = optionalUser.get();
        } else {
            throw new BadCredentialsException(HttpStatus.BAD_REQUEST +
                    String.format(" User with email %s do not exist", email));
        }
        return result;
    }

    public ServiceResponseT<UserInfoResponse> getUserInfo(String userName)
    {
        var user = userRepository.findByUserName(userName);
        if (user == null)
        {
            return new ServiceResponseT<UserInfoResponse>("user notFound");
        }
        UserInfoResponse userInfo = userMapper.userToUserInfoResponse(user.get());
        return new ServiceResponseT<UserInfoResponse>(userInfo);
    }

    public ServiceResponseT<UserInfoTokenResponse> setUserInfo(ChangeUserInfoRequest userInfo, String userName) {
        var userOptional = userRepository.findByUserName(userName);
        if (userOptional == null)
        {
            return new ServiceResponseT<>("user notFound");
        }
        if (userInfo.getNewPassword() != null &&
                userInfo.getConfirmNewPassword() != null &&
                !userInfo.getNewPassword().equals(userInfo.getConfirmNewPassword())
        ){
            return new ServiceResponseT<>("newPassword mustMatch");
        }
        if(userInfo.getUserName() == null) {
            return new ServiceResponseT<>("userName empty");
        }
        if(userInfo.getEmail() == null) {
            return new ServiceResponseT<>("email empty");
        }
        var user = userOptional.get();
        if(passwordEncoder.encode(userInfo.getOldPassword()).equals(user.getPassword())) {
            return new ServiceResponseT<>("oldPassword mustMatch");
        }
        user.setUserName(userInfo.getUserName());
        if(userInfo.getNewPassword() != null) {
            user.setPassword(passwordEncoder.encode(userInfo.getNewPassword()));
        }
        user.setEmail(userInfo.getEmail());
        userRepository.save(user);
        String token = tokenProvider.createToken(user.getUserName());
        var resultUserInfoToken = userMapper.userToUserInfoTokenResponse(user);
        resultUserInfoToken.setToken(token);
        return new ServiceResponseT<>(resultUserInfoToken);
    }
}
