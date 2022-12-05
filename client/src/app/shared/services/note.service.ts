import { ThemeService } from './theme.service';
import { NoteSocketService } from 'src/app/shared/services/note.socket.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { NoteOrder } from '../models/notes-order.model';
import { NoteDataService } from './note.data.service';
import { NotesDataService } from './notes.data.service';
import { NoteDesign } from '../models/note-design.model';
import { NoteText } from '../models/note-text.model';
import { ColorPaletteService } from './color-palette.service';

@Injectable({ providedIn: 'root' })
export class NoteService implements OnDestroy {
  public notes: Note[];

  public constructor(
    private readonly noteDataService: NoteDataService,
    private readonly notesDataService: NotesDataService,
    private readonly noteSignalR: NoteSocketService,
    private readonly themeService: ThemeService,
    private readonly colorPaletteService: ColorPaletteService
  ) {
    this.getNotes().subscribe((notes) => {
      this.notes = notes;

      this.themeService.getChangingThemeSubject().subscribe((isDarkTheme) => {
        this.notes.forEach((note) => {
          note.hexColor =
            this.colorPaletteService.getColorHexFromPalletByColorTitle(
              note.noteDesign?.color
            );
        });
      });
    });

    this.noteSignalR.startConnection();
    this.noteSignalR
      .connectToUpdateNotes()
      .subscribe((updatedNoteText: NoteText | null) => {
        if (updatedNoteText) {
          const indexNote = this.notes.findIndex((note) => note.noteText.id === updatedNoteText.id);
          this.notes[indexNote].noteText = updatedNoteText;
        }
      });

    this.noteSignalR
      .connectToDeleteNoteFromOwner()
      .subscribe((idDeleteNote) => {
        if (idDeleteNote) {
          this.notes = this.notes.filter((note) => note.id !== idDeleteNote);
        }
      });
  }

  public ngOnDestroy(): void {
    this.noteSignalR.disconnect();
  }

  public updateNote(note: Note): Observable<Note> {
    const subscription = this.noteDataService.updateNote(note);
    subscription.subscribe();
    return subscription;
  }

  public updateNoteText(noteText: NoteText): Observable<NoteText> {
    return this.noteSignalR.updateNoteText(noteText);
  }

  public deleteNote(id: number): Observable<any> {
    const subscription = this.noteDataService.deleteNote(id);
    subscription.subscribe((deleteNote) => {
      this.notes = this.notes.filter((note) => note.id !== id);
    });
    return subscription;
  }

  public createNote(): Observable<Note> {
    const order = -1;
    const observable = this.noteDataService.createNote(order);
    observable.subscribe((newNote) => {
      if (!this.notes) {
        this.notes = [];
      }
      this.notes.push(newNote);
    });
    return observable;
  }

  public getNotes(): Observable<Note[]> {
    return this.notesDataService.getNotes();
  }

  public updateOrder(notesOrder: NoteOrder[]): Observable<NoteOrder[]> {
    return this.notesDataService.updateOrder(notesOrder);
  }

  public updateNoteDesign(
    noteDesign: NoteDesign,
    noteID: number
  ): Observable<NoteDesign> {
    return this.noteDataService.updateNoteDesign(noteDesign, noteID);
  }

  public getSharedUsersEmails(noteTextID: number): Observable<string[]> {
    return this.noteDataService.getSharedUsersEmails(noteTextID);
  }

  public shareNoteWithUser(email: string, noteTextID: number): Observable<any> {
    return this.noteSignalR.shareNoteWithUser(email, noteTextID);
  }

  public deleteSharedUser(email: string, noteTextID: number): Observable<any> {
    return this.noteSignalR.deleteSharedUser(email, noteTextID);
  }

  public acceptSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    return this.noteSignalR.acceptSharedNote(noteTextID, notificationID);
  }

  public declineSharedNote(noteTextID: number, notificationID: number): Observable<any> {
    return this.noteSignalR.declineSharedNote(noteTextID, notificationID);
  }

  public addNote(note: Note): void {
    this.notes.unshift(note);
  }
}
