package com.noteshared.controllers;

import com.noteshared.models.DTO.NotificationDto;
import com.noteshared.services.NotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
public class NotificationController extends BaseController {
    private final NotificationsService notificationsService;

    @RequestMapping(method = RequestMethod.GET)
    public List<NotificationDto> Get()
    {
        var result = notificationsService.getNotifications(getCurrentUserName());
        return ResultOf(result);
    }

    @RequestMapping(method = RequestMethod.POST, value = "delete-notification")
    public void DeleteNotification(@RequestBody int notificationID)
    {
        var result = notificationsService.deleteNotification(getCurrentUserName(), notificationID);
        ResultOf(result);
    }
}
