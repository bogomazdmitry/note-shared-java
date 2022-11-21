package com.noteshared.security.jwt;

import com.noteshared.domain.entities.users.User;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public final class JwtUserFactory {

    public JwtUser create(User user) {
        return new JwtUser(user.getEmail(),
                user.getPassword());
    }

    private List<GrantedAuthority> mapToGrantedAuthority(List<String> userRoles) {
        return userRoles.stream().
                map(SimpleGrantedAuthority::new).
                collect(Collectors.toList());
    }
}
