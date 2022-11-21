package com.noteshared.mappers;

import com.noteshared.domain.entities.users.User;
import com.noteshared.models.requests.SignUpUserRequest;
import com.noteshared.models.responses.UserInfoResponse;
import com.noteshared.models.responses.UserInfoTokenResponse;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User signUpDtoToUser(SignUpUserRequest signUpDto);

    UserInfoResponse userToUserInfoResponse(User user);

    UserInfoTokenResponse userToUserInfoTokenResponse(User user);
}
