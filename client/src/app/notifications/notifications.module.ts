import { DynamicNotificationsComponent } from './dynamic-notifications/dynamic-notifications.component';
import { MenuNotificationDirective } from './menu-notification.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../shared/shared.module';
import { ClickStopPropagationDirective } from './click-stop-propagation.directive';
import { RequestSharedNoteComponent } from '@notification/request-shared-note';
import { AcceptedRequestSharedNoteComponent } from '@notification/accepted-request-shared-note';
import { DeclinedRequestSharedNoteComponent } from '@notification/declined-request-shared-note';

@NgModule({
  declarations: [
    NotificationsComponent,
    MenuNotificationDirective,
    ClickStopPropagationDirective,
    DeclinedRequestSharedNoteComponent,
    DynamicNotificationsComponent,
    RequestSharedNoteComponent,
    AcceptedRequestSharedNoteComponent,
  ],
  exports: [NotificationsComponent],
  entryComponents: [
    DeclinedRequestSharedNoteComponent,
    RequestSharedNoteComponent,
    AcceptedRequestSharedNoteComponent,
  ],
  imports: [CommonModule, SharedModule],
})
export class NotificationsModule {}
