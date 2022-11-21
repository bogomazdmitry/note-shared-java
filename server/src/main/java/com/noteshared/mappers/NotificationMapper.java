package com.noteshared.mappers;

import com.noteshared.domain.entities.notifications.Notification;
import com.noteshared.models.DTO.NotificationDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationDto notificationToNotificationDto(Notification notification);
    Notification notificationDtoToNotification(NotificationDto notification);
}
