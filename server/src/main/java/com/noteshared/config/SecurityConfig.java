package com.noteshared.config;

import com.noteshared.security.jwt.JwtConfigurer;
import com.noteshared.security.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final TokenProvider tokenProvider;
    private static final String SIGN_IN_ENDPOINT = "/api/auth/signin";
    private static final String SIGN_UP_ENDPOINT = "/api/auth/signup";
    private static final String CHECK_UNIQUE_USER_NAME_ENDPOINT = "/api/auth/check-unique-user-name";
    private static final String CHECK_UNIQUE_EMAIL_ENDPOINT = "/api/auth/check-unique-email";

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues());
        http
                .httpBasic().disable().csrf().disable().cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests().antMatchers(SIGN_IN_ENDPOINT).permitAll()
                .antMatchers(SIGN_UP_ENDPOINT).permitAll()
                .antMatchers(CHECK_UNIQUE_EMAIL_ENDPOINT).permitAll()
                .antMatchers(CHECK_UNIQUE_USER_NAME_ENDPOINT).permitAll()
                .anyRequest().authenticated()
                .and().exceptionHandling()
                .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                .and()
                .apply(new JwtConfigurer(tokenProvider));
    }
}
