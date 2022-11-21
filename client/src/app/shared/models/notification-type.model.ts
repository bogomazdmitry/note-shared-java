import { Type } from '@angular/core';
import { RequestSharedNoteComponent } from '@notification/request-shared-note';
import { AcceptedRequestSharedNoteComponent } from '@notification/accepted-request-shared-note';
import { DeclinedRequestSharedNoteComponent } from '@notification/declined-request-shared-note';
import { BaseNotification } from '@notification/base-notification';

export enum NotificationType {
  requestSharedNoteType = 0,
  acceptedRequestSharedNoteType = 1,
  declinedRequestSharedNoteType = 2,
}

export const converter = new Map<NotificationType, Type<BaseNotification>>([
  [NotificationType.requestSharedNoteType, RequestSharedNoteComponent],
  [NotificationType.acceptedRequestSharedNoteType, AcceptedRequestSharedNoteComponent],
  [NotificationType.declinedRequestSharedNoteType, DeclinedRequestSharedNoteComponent],
]);
