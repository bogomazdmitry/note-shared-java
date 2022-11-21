package com.noteshared.security.jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "jwt", ignoreUnknownFields = false)
public class JwtConfigurationProperties {
    private String keyword;
    private long expiration;
}
