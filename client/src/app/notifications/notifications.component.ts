import { Component } from '@angular/core';

@Component({
  selector: 'notifications-home',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  public countNotifications = 0;

  public setCountNotification(event: number): void {
    this.countNotifications = event;
  }
}
