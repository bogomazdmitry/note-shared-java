import { Note } from 'src/app/shared/models/note.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { actionRoutes, hubMethodSubscription, hubsRoutes, socketPrefix } from './../constants/url.constants';
import { Injectable } from '@angular/core';
import { NoteText } from '../models/note-text.model';
import { NoteDataService } from './note.data.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NoteSignalRService {
  private socket: WebSocket;
  private stompClient: any;
  private observableUpdateNoteText: BehaviorSubject<NoteText | null>;

  public constructor(
    private readonly noteDataService: NoteDataService,
    private readonly authService: AuthService) {}

  public startConnection(): void {
    // const options: signalR.IHttpConnectionOptions = {
    //   accessTokenFactory: () => this.authService.getAccessToken() ?? '',
    // };
    this.socket = new SockJS(environment.serverUrl + socketPrefix, null,
      {
          transports: ['xhr-streaming'],
          headers: {'Authorization': 'Bearer ' + this.authService.getAccessToken()}
      });
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({},() =>
    {
      console.log('in socket');
      this.stompClient.subscribe('/update-note-text',(data: any)=>{console.log(data);});
    });
    this.observableUpdateNoteText = new BehaviorSubject<NoteText | null>(null);

  }

  public updateNoteText(noteText: NoteText): Observable<NoteText> {
    return this.noteDataService.updateNoteText(noteText);
  }

  public shareNoteWithUser(email: string, noteTextID: number): Observable<any> {
    // return this.hubConnectionRequestSharedNote.sen(actionRoutes.requestSharedNote, { email, noteTextID }));
    return new Observable<NoteText>();
  }

  public connectToDeleteNoteFromOwner(): BehaviorSubject<number | null> {
    return new BehaviorSubject<number | null>(null);
  }


  public connectToUpdateNotes(): BehaviorSubject<NoteText | null> {
   return this.observableUpdateNoteText;
  }

  public disconnectToUpdateNote(): void {
    // this.hubConnectionUpdateNoteText.off(hubMethodSubscription.noteTextUpdate);
  }

  public disconnectToDeleteNoteFromOwner(): void {
    // this.hubConnectionUpdateNoteText.off(hubMethodSubscription.deleteNoteFromOwner);
  }

  public deleteSharedUser(email: string, noteTextID: number): Observable<any> {
    return new Observable<NoteText>();
    // return from(this.hubConnectionUpdateNoteText.invoke(actionRoutes.notesDeleteSharedUser, {email, noteTextID}));
  }

  public declineSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    return new Observable<NoteText>();
    // return from(this.hubConnectionUpdateNoteText.invoke(actionRoutes.declineSharedNote, noteTextID, notificationID));
  }

  public acceptSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    return new Observable<NoteText>();
    // return from(this.hubConnectionUpdateNoteText.invoke(actionRoutes.acceptSharedNote, noteTextID, notificationID));
  }
}
