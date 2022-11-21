import { BaseDataService } from './base.data.service';
import { Injectable } from '@angular/core';
import { actionRoutes, controllerRoutes } from '../constants/url.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationInfo } from '../models/notification-info.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsDataService extends BaseDataService {
  public constructor(protected readonly httpClient: HttpClient) {
    super(httpClient, controllerRoutes.notifications);
  }

  public getNotifications(): Observable<NotificationInfo[]> {
    return this.sendGetRequest({}, actionRoutes.notificationsGet);
  }

  public deleteNotification(notificationID: number) {
    return this.sendDeleteRequest({notificationID}, actionRoutes.notificationDelete);
  }
}
