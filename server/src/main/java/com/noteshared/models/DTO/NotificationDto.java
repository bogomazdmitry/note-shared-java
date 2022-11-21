package com.noteshared.models.DTO;

import com.noteshared.domain.entities.notifications.NotificationType;
import lombok.Data;

import java.sql.Date;

@Data
public class NotificationDto {
    private int id;

    private String content;

    private NotificationType type;

    private String userID;

    private Date createDateTime;
}
