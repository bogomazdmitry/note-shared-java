import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actionRoutes, controllerRoutes } from '../constants/url.constants';
import { Note } from '../models/note.model';
import { NoteOrder } from '../models/notes-order.model';
import { BaseDataService } from './base.data.service';

@Injectable({ providedIn: 'root' })
export class NotesDataService extends BaseDataService {
  public constructor(protected readonly httpClient: HttpClient) {
    super(httpClient, controllerRoutes.notes);
  }

  public getNotes(): Observable<Note[]> {
    return this.sendGetRequest('', actionRoutes.notesGet);
  }

  public updateOrder(notesOrder: NoteOrder[]): Observable<NoteOrder[]> {
    return this.sendPostRequest(
      JSON.stringify(notesOrder),
      actionRoutes.notesUpdateOrder
    );
  }
}
