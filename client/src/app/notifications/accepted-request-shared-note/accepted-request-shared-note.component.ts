import { Component, OnInit } from '@angular/core';
import { AcceptedRequestSharedNoteNotificationContent, NotificationInfo } from 'src/app/shared/models/notification-info.model';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { BaseNotification } from '@notification/base-notification';

@Component({
  selector: 'app-accepted-request-shared-note',
  templateUrl: './accepted-request-shared-note.component.html',
  styleUrls: ['./accepted-request-shared-note.component.scss']
})
export class AcceptedRequestSharedNoteComponent implements OnInit, BaseNotification {

  public notification: NotificationInfo;
  public content: AcceptedRequestSharedNoteNotificationContent;

  public constructor(private readonly notificationsService: NotificationsService) { }

  public ngOnInit(): void {
    this.content = JSON.parse(this.notification.content);
  }

  public deleteNotification(): void {
    this.notificationsService.deleteNotification(this.notification.id);
  }
}
