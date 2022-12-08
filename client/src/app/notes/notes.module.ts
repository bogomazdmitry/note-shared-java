import { NotificationsModule } from './../notifications/notifications.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NoteComponent } from './note/note.component';
import { NotesComponent } from './notes.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { NotesSheetComponent } from './notes-sheet/notes-sheet.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NoteComponent,
    NotesComponent,
    NoteDialogComponent,
    NotesSheetComponent,
  ],
  imports: [CommonModule, SharedModule, NotificationsModule, RouterModule],
  entryComponents: [NoteDialogComponent],
})
export class NotesModule {}
