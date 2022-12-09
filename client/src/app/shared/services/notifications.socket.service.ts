import { AuthService } from 'src/app/shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { hubMethodSubscription, socketPrefix } from '../constants/url.constants';
import { Injectable, OnDestroy } from '@angular/core';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationsSocketService implements OnDestroy {
  private socket: WebSocket;
  private stompClient: Stomp.Client;
  private header: {
    /* eslint-disable */
    Authorization: string;
  };
  private notificationBehaviorSubject: BehaviorSubject<any>;

  public constructor(private readonly authService: AuthService) {
    this.notificationBehaviorSubject = new BehaviorSubject<any>(null);
  }

  public startConnection(): void {
    this.header = {
      /* eslint-disable */
      Authorization: `Bearer ${this.authService.getAccessToken()}`
      /* eslint-enable */
    };
    this.socket = new WebSocket(environment.serverUrlUs + socketPrefix + '?token=' + this.authService.getAccessToken());
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({},() =>
    {
      this.stompClient.subscribe(hubMethodSubscription.sendNewNotification,
        (data: any)=>{console.error (data); this.notificationBehaviorSubject.next(JSON.parse(data.body));});
      });
  }

  public connectToNewNotifications(): BehaviorSubject<any> {
    return this.notificationBehaviorSubject;
  }

  public ngOnDestroy(): void {
    this.stompClient.unsubscribe(hubMethodSubscription.deleteNoteFromOwner);
    this.stompClient.disconnect(()=>{});
  }
}
