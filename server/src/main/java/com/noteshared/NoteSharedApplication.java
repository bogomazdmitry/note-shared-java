package com.noteshared;

import com.noteshared.security.jwt.JwtConfigurationProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtConfigurationProperties.class})
public class NoteSharedApplication {

    public static void main(String[] args) {
        SpringApplication.run(NoteSharedApplication.class, args);
    }

}
