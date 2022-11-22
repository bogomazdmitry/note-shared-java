package com.noteshared.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.noteshared.domain.entities.notifications.Notification;
import com.noteshared.domain.entities.notifications.NotificationRepository;
import com.noteshared.domain.entities.notifications.NotificationType;
import com.noteshared.domain.entities.users.UserRepository;
import com.noteshared.mappers.NotificationMapper;
import com.noteshared.models.DTO.AcceptedRequestSharedNoteNotificationContent;
import com.noteshared.models.DTO.DeclinedRequestSharedNoteNotificationContent;
import com.noteshared.models.DTO.NotificationDto;
import com.noteshared.models.DTO.RequestSharedNoteNotificationContent;
import com.noteshared.models.responses.ServiceResponse;
import com.noteshared.models.responses.ServiceResponseT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationsService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepositoty;
    private final NotificationMapper notificationMapper;

    public ServiceResponseT<List<NotificationDto>> getNotifications(String currentUserName) {
        var user = userRepository.findByUserName(currentUserName).get();

        var notificationDtoList = user.getNotifications()
                .stream()
                .map(n -> notificationMapper.notificationToNotificationDto(n))
                .collect(Collectors.toList());
        return new ServiceResponseT<>(notificationDtoList);
    }

    public ServiceResponse deleteNotification(String currentUserName, int notificationID) {
        var user = userRepository.findByUserName(currentUserName).get();

        var notification = user.getNotifications().stream().filter(n -> n.getId() == notificationID).findFirst().get();
        if(notification == null) {
            return new ServiceResponse("Not allowed");
        }
        notificationRepositoty.delete(notification);
        return new ServiceResponse();
    }


    public ServiceResponseT<NotificationDto> SendRequestSharedNotification(String currentUserName, String sharedUserEmail, int noteTextID) throws JsonProcessingException {
        var sharedUser = userRepository.findByEmail(sharedUserEmail).get();
        var currentUser = userRepository.findByUserName(currentUserName).get();

        var notificationContent = new RequestSharedNoteNotificationContent();
        notificationContent.setNoteTextID(noteTextID);
        notificationContent.setFromUserEmail(currentUser.getEmail());

        var notification = new Notification();
        notification.setUser(sharedUser);
        var objectMapper = new ObjectMapper();
        notification.setContent(objectMapper.writeValueAsString(notificationContent));;
        notification.setType(NotificationType.RequestSharedNoteType);
        notification.setCreateDateTime(new Date(System.currentTimeMillis()));

        notification = notificationRepositoty.save(notification);

        var notificationDto = notificationMapper.notificationToNotificationDto(notification);
        return new ServiceResponseT<NotificationDto>(notificationDto);
    }

    public ServiceResponseT<NotificationDto> SendAcceptRequestSharedNotification(String currentUserName, String ownerUserName, int noteTextID) throws JsonProcessingException {
        var ownerUser = userRepository.findByUserName(ownerUserName).get();
        var currentUser = userRepository.findByUserName(currentUserName).get();

        var notificationContent = new AcceptedRequestSharedNoteNotificationContent();
        notificationContent.setNoteTextID(noteTextID);
        notificationContent.setFromUserEmail(currentUser.getEmail());

        var notification = new Notification();
        notification.setUser(ownerUser);
        var objectMapper = new ObjectMapper();
        notification.setContent(objectMapper.writeValueAsString(notificationContent));;
        notification.setType(NotificationType.AcceptedRequestSharedNoteType);
        notification.setCreateDateTime(new Date(System.currentTimeMillis()));

        notification = notificationRepositoty.save(notification);

        var notificationDto = notificationMapper.notificationToNotificationDto(notification);
        return new ServiceResponseT<NotificationDto>(notificationDto);
    }

    public ServiceResponseT<NotificationDto> SendDeclineRequestSharedNotification(String currentUserName, String ownerUserName, int noteTextID) throws JsonProcessingException {
        var ownerUser = userRepository.findByUserName(ownerUserName).get();
        var currentUser = userRepository.findByUserName(currentUserName).get();

        var notificationContent = new DeclinedRequestSharedNoteNotificationContent();
        notificationContent.setNoteTextID(noteTextID);
        notificationContent.setFromUserEmail(currentUser.getEmail());

        var notification = new Notification();
        notification.setUser(ownerUser);
        var objectMapper = new ObjectMapper();
        notification.setContent(objectMapper.writeValueAsString(notificationContent));;
        notification.setType(NotificationType.DeclinedRequestSharedNoteType);
        notification.setCreateDateTime(new Date(System.currentTimeMillis()));

        notification = notificationRepositoty.save(notification);

        var notificationDto = notificationMapper.notificationToNotificationDto(notification);
        return new ServiceResponseT<NotificationDto>(notificationDto);
    }
}

