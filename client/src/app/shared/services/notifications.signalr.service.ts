import { AuthService } from 'src/app/shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { hubMethodSubscription, hubsRoutes } from '../constants/url.constants';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { NotificationInfo } from '../models/notification-info.model';

@Injectable({ providedIn: 'root' })
export class NotificationsSignalRService {
  private hubConnection: signalR.HubConnection;

  public constructor(private readonly authService: AuthService) {}

  public startConnection(): void {
    const options: signalR.IHttpConnectionOptions = {
      accessTokenFactory: () => this.authService.getAccessToken() ?? '',
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.serverUrl + hubsRoutes.notifications, options)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to notification hub'))
      .catch((error) => console.log('No connection to hub ' + error));
  }

  public connectToNewNotifications(): BehaviorSubject<NotificationInfo | null> {
    const notificationBehaviorSubject = new BehaviorSubject<NotificationInfo | null>(null);
    this.hubConnection.on(hubMethodSubscription.sendNewNotification, (data) => {
      notificationBehaviorSubject.next(data);
    });
    return notificationBehaviorSubject;
  }

  public disconnectToUpdateNote(): void {
    this.hubConnection.off(hubMethodSubscription.sendNewNotification);
  }
}
