import { ComponentFactoryResolver, ComponentRef, EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseNotification } from 'src/app/notifications/base-notification/base-notification';
import { MenuNotificationDirective } from 'src/app/notifications/menu-notification.directive';
import { NotificationInfo } from '../models/notification-info.model';
import { converter } from '../models/notification-type.model';
import { NotificationsSocketService } from './notifications.socket.service';
import { NotificationsDataService } from './notifications.data.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService implements OnDestroy {
  private notifications: NotificationInfo[];

  private notificationComponentRefs: ComponentRef<BaseNotification>[] = [];

  private menuNotification: MenuNotificationDirective;
  private changingCountNotificationsEvent: EventEmitter<number>;

  public constructor(
    private readonly notificationsDataService: NotificationsDataService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly notificationSignalR: NotificationsSocketService,
  ) {
    this.notificationsDataService.getNotifications().subscribe(
      (notifications: NotificationInfo[]) => {
        this.notifications = notifications;
        this.loadNotifications();
      }
    );
    this.notificationSignalR.startConnection();
    this.notificationSignalR.connectToNewNotifications().subscribe((newNotification) => {
      if (newNotification) {
        this.addNewNotification(newNotification);
      }
    });
  }

  public ngOnDestroy(): void {}


  public deleteNotificationFromUI(id: number): Observable<any> | void {
    const notificationComponentRef = this.notificationComponentRefs.filter(
      notification => notification.instance.notification.id === id
    )[0];
    if (notificationComponentRef) {
      const notificationID = notificationComponentRef.instance.notification.id;
      notificationComponentRef.destroy();
      this.notificationComponentRefs = this.notificationComponentRefs.filter(
        notification => notification.instance.notification.id !== id
      );
      this.changingCountNotificationsEvent.emit(this.notificationComponentRefs.length);
    }
  }

  public deleteNotification(id: number): Observable<any> | void {
    const notificationComponentRef = this.notificationComponentRefs.filter(
      notification => notification.instance.notification.id === id
    )[0];
    if (notificationComponentRef) {
      const notificationID = notificationComponentRef.instance.notification.id;
      this.notificationsDataService.deleteNotification(notificationID).subscribe(() => {
        notificationComponentRef.destroy();
        this.notificationComponentRefs = this.notificationComponentRefs.filter(
          notification => notification.instance.notification.id !== id
        );
        this.changingCountNotificationsEvent.emit(this.notificationComponentRefs.length);
      });
    }
  }

  public loadNotifications(): void {
    if (this.menuNotification) {
      const viewContainerRef = this.menuNotification.viewContainerRef;
      this.notificationComponentRefs = [];
      viewContainerRef.clear();
      if (this.notifications) {
        this.notifications.forEach((adItem) => {
          const type = converter.get(adItem.type);
          if (type) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(type);
            const componentRef =
            viewContainerRef.createComponent<BaseNotification>(
                componentFactory
                );
                this.notificationComponentRefs.push(componentRef);
                componentRef.instance.notification = adItem;
              }
            });
          }
      this.changingCountNotificationsEvent.emit(this.notificationComponentRefs.length);
    }
  }

  public addNewNotification(notification: NotificationInfo): void {
    const viewContainerRef = this.menuNotification.viewContainerRef;
    const type = converter.get(notification.type);
    if (type) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(type);
      const componentRef =
        viewContainerRef.createComponent<BaseNotification>(
          componentFactory, 0
        );
      this.notificationComponentRefs.unshift(componentRef);
      componentRef.instance.notification = notification;
      this.changingCountNotificationsEvent.emit(this.notificationComponentRefs.length);
    }
  }

  public setParameters(menuNotification: MenuNotificationDirective, changingCountNotificationsEvent: EventEmitter<number>): void {
    this.menuNotification = menuNotification;
    this.changingCountNotificationsEvent = changingCountNotificationsEvent;
    this.loadNotifications();
  }
}
