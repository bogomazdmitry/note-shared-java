package com.noteshared.security;

import com.noteshared.domain.entities.users.User;
import com.noteshared.domain.entities.users.UserRepository;
import com.noteshared.security.jwt.JwtUserFactory;
import com.noteshared.services.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).get();
        return JwtUserFactory.create(user);
    }
}
