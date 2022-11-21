package com.noteshared.services;

import com.noteshared.domain.entities.users.User;
import com.noteshared.domain.entities.users.UserRepository;
import com.noteshared.mappers.UserMapper;
import com.noteshared.models.requests.ChangeUserInfoRequest;
import com.noteshared.models.responses.ServiceResponseT;
import com.noteshared.models.responses.UserInfoResponse;
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

    @Transactional
    public User addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            User registeredUser = userRepository.save(user);
            return registeredUser;
        } catch (Exception exc) {
            throw exc;
        }
    }

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
        UserInfoResponse userInfo = userMapper.userToUserInfo(user.get());
        return new ServiceResponseT<UserInfoResponse>(userInfo);
    }

    public ServiceResponseT<UserInfoResponse> setUserInfo(ChangeUserInfoRequest userInfo, String userName) {
        return null;
    }
}
