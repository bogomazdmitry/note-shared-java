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
  public notesSearch: Note[] | null;
  public searchingMode = false;

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

  public ngOnDestroy(): void { }

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
    if (!this.searchingMode) {
      const order = -1;
      const observable = this.noteDataService.createNote(order);
      observable.subscribe((newNote) => {
        if (!this.notes) {
          this.notes = [];
        }
        this.notes.push(newNote);
      });
    }
    return new Observable<Note>();
  }

  public createNoteFromTemplate(newNoteTemplate: Note): void {
    console.log('3');
    if (!this.searchingMode) {
      const order = -1;
      const observable = this.noteDataService.createNote(order);
      observable.subscribe((newNote) => {
        if (newNoteTemplate.noteDesign) {
          newNote.noteDesign = { color: newNoteTemplate.noteDesign.color };
        }
        console.log('4');
        if (newNoteTemplate.noteText) {
          newNote.noteText.text = newNoteTemplate.noteText.text;
          newNote.noteText.title = newNoteTemplate.noteText.title;
        };
        console.log('5');
        console.log(newNoteTemplate);
        this.updateNoteText(newNote.noteText).subscribe();
        if(newNote.noteDesign) {
          this.updateNoteDesign(newNote.noteDesign, newNote.id).subscribe();
        }
        if (!this.notes) {
          this.notes = [];
        }
        newNote.hexColor = this.colorPaletteService.getColorHexFromPalletByColorTitle(
          newNote.noteDesign?.color
        );
        this.notes.push(newNote);
      });
    }
  }


  public getNote(noteID: number): Observable<Note> {
    return this.noteDataService.getNote(noteID);
  }

  public getNotes(): Observable<Note[]> {
    return this.notesDataService.getNotes();
  }

  public updateOrder(notesOrder: NoteOrder[]): Observable<NoteOrder[]> {
    if (!this.searchingMode) {
      console.log('to database');
      return this.notesDataService.updateOrder(notesOrder);
    }
    return new Observable<NoteOrder[]>();
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

  public searchNotes(searchItem: string) {
    if (!searchItem) {
      if (this.notesSearch) {
        this.notes = this.notesSearch.sort((a, b) => -a.order + b.order);
        this.notesSearch = null;
        this.searchingMode = false;
      }
    }
    else {
      this.searchingMode = true;
      if (!this.notesSearch || this.notesSearch.length < this.notes.length) {
        this.notesSearch = this.notes;
      }
      this.notes = this.notesSearch.filter((n) => n.noteText.text && n.noteText.text.includes(searchItem)
        || n.noteText.title && n.noteText.title.includes(searchItem));
    }
  }
}
