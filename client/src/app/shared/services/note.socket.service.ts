import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { hubMethodSubscription, socketPrefix } from '../constants/url.constants';
import { Injectable, OnDestroy } from '@angular/core';
import { NoteText } from '../models/note-text.model';
import { NoteDataService } from './note.data.service';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NoteSocketService implements OnDestroy {
  private socket: WebSocket;
  private stompClient: Stomp.Client;
  private observableUpdateNoteText: BehaviorSubject<NoteText | null>;
  private observableDeleteNoteFromOwner: BehaviorSubject<number | null>;
  private header: {
    /* eslint-disable */
    Authorization: string;
  };

  public constructor(
    private readonly noteDataService: NoteDataService,
    private readonly authService: AuthService) {
    this.observableUpdateNoteText = new BehaviorSubject<NoteText | null>(null);
    this.observableDeleteNoteFromOwner = new BehaviorSubject<number | null>(null);
  }

  public startConnection(): void {
    this.header = {
      /* eslint-disable */
      Authorization: `Bearer ${this.authService.getAccessToken()}`
      /* eslint-enable */
    };
    this.socket = new WebSocket(environment.serverUrlUs + socketPrefix + '?token=' + this.authService.getAccessToken());
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(hubMethodSubscription.noteTextUpdate,
        (data: any) => { this.observableUpdateNoteText.next(JSON.parse(data.body)); });
      this.stompClient.subscribe(hubMethodSubscription.deleteNoteFromOwner,
        (data: any) => { this.observableDeleteNoteFromOwner.next(JSON.parse(data.body)); });
    });
  }

  public updateNoteText(noteText: NoteText): Observable<NoteText> {
    return this.noteDataService.updateNoteText(noteText);
  }

  public shareNoteWithUser(email: string, noteTextID: number): Observable<any> {
    return this.noteDataService.shareNoteWithUser(email, noteTextID);
  }

  public connectToDeleteNoteFromOwner(): BehaviorSubject<number | null> {
    return this.observableDeleteNoteFromOwner;
  }


  public connectToUpdateNotes(): BehaviorSubject<NoteText | null> {
    return this.observableUpdateNoteText;
  }

  public deleteSharedUser(email: string, noteTextID: number): Observable<any> {
    return this.noteDataService.deleteSharedUser(email, noteTextID);
  }

  public declineSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    return this.noteDataService.declineSharedNote(noteTextID, notificationID);
  }

  public acceptSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    return this.noteDataService.acceptSharedNote(noteTextID, notificationID);
  }

  public ngOnDestroy(): void {
    this.stompClient.unsubscribe(hubMethodSubscription.noteTextUpdate);
    this.stompClient.unsubscribe(hubMethodSubscription.deleteNoteFromOwner);
    this.socket.close();
  }
}
