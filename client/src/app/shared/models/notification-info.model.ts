import { NotificationType } from './notification-type.model';

export interface RequestSharedNoteNotificationContent {
  fromUserEmail: string;
  noteTextID: number;
}

export interface AcceptedRequestSharedNoteNotificationContent {
  fromUserEmail: string;
  noteTextID: number;
}

export interface DeclinedRequestSharedNoteNotificationContent {
  fromUserEmail: string;
  noteTextID: number;
}

export interface NotificationInfo {
  id: number;
  content: string;
  type: NotificationType;
  createDateTime: Date;
}

