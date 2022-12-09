import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationsModule } from './../notifications/notifications.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NoteComponent } from './note/note.component';
import { NotesComponent } from './notes.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { NotesSheetComponent } from './notes-sheet/notes-sheet.component';
import { RouterModule } from '@angular/router';
import { NoteViewComponent } from './note-view/note-view.component';
import { ShareNoteComponent } from './share-note/share-note.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
  declarations: [
    NoteComponent,
    NotesComponent,
    NoteDialogComponent,
    NotesSheetComponent,
    NoteViewComponent,
    ShareNoteComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, NgxMatFileInputModule,
    CommonModule, SharedModule, NotificationsModule, RouterModule, BrowserModule],
  entryComponents: [NoteDialogComponent],
})
export class NotesModule { }
