import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NotificationInfo } from 'src/app/shared/models/notification-info.model';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { MenuNotificationDirective } from '../menu-notification.directive';

@Component({
  selector: 'notifications-dynamic-notifications',
  templateUrl: './dynamic-notifications.component.html',
  styleUrls: ['./dynamic-notifications.component.scss'],
})
export class DynamicNotificationsComponent implements OnInit {
  public notifications: NotificationInfo[];

  @ViewChild(MenuNotificationDirective, { static: true })
  public menuNotification!: MenuNotificationDirective;

  @Output()
  public changingCountNotificationsEvent = new EventEmitter<number>();

  public constructor(
    private readonly notificationsService: NotificationsService
  ) {
  }

  public ngOnInit(): void {
    this.notificationsService.setParameters(this.menuNotification, this.changingCountNotificationsEvent);
  }
}
