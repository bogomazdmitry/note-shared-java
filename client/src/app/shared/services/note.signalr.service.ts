import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { actionRoutes, hubMethodSubscription, hubsRoutes, socketPrefix } from './../constants/url.constants';
import { Injectable } from '@angular/core';
import { NoteText } from '../models/note-text.model';
import { NoteDataService } from './note.data.service';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NoteSignalRService {
  private socket: WebSocket;
  private stompClient: Stomp.Client;
  private observableUpdateNoteText: BehaviorSubject<NoteText | null>;
  private observableShareNoteWithUser: BehaviorSubject<number | null>;
  private header: {
    /* eslint-disable */
    Authorization: string;
  };

  public constructor(
    private readonly noteDataService: NoteDataService,
    private readonly authService: AuthService) {
      this.observableUpdateNoteText = new BehaviorSubject<NoteText | null>(null);
      this.observableShareNoteWithUser = new BehaviorSubject<number | null>(null);
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
      this.stompClient.subscribe(hubMethodSubscription.noteTextUpdate,
        (data: any)=>{console.error (data); this.observableUpdateNoteText.next(JSON.parse(data.body));});
      this.stompClient.subscribe(hubMethodSubscription.deleteNoteFromOwner,
        (data: any)=>{console.error (data); this.observableUpdateNoteText.next(JSON.parse(data.body));});
    });
  }

  public updateNoteText(noteText: NoteText): Observable<NoteText> {
    this.noteDataService.updateNoteText(noteText).subscribe();
    return of(noteText);
  }

  public shareNoteWithUser(email: string, noteTextID: number): Observable<any> {
    // this.stompClient.send(socketActionUrl.deleteNoteFromOwner, this.header, JSON.stringify({email, noteTextID}));
    return new Observable<any>();
  }

  public connectToDeleteNoteFromOwner(): BehaviorSubject<number | null> {
    return this.observableShareNoteWithUser;
  }


  public connectToUpdateNotes(): BehaviorSubject<NoteText | null> {
   return this.observableUpdateNoteText;
  }

  public disconnect(): void {
    console.log('disconnected');
    this.stompClient.unsubscribe(hubMethodSubscription.noteTextUpdate);
    this.stompClient.unsubscribe(hubMethodSubscription.deleteNoteFromOwner);
    this.stompClient.disconnect(()=>{});
  }

  public deleteSharedUser(email: string, noteTextID: number): Observable<any> {
    // this.stompClient.send(socketActionUrl.notesDeleteSharedUser, this.header, JSON.stringify({email, noteTextID}));
    return new Observable<any>();
  }

  public declineSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    // this.stompClient.send(socketActionUrl.declineSharedNote, this.header, JSON.stringify({noteTextID, notificationID}));
    return new Observable<any>();
  }

  public acceptSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    // this.stompClient.send(socketActionUrl.acceptSharedNote, this.header, JSON.stringify({noteTextID, notificationID}));
    return new Observable<any>();
  }
}
