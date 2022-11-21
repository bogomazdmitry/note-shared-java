import { NotificationsModule } from './../notifications/notifications.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NoteComponent } from './note/note.component';
import { NotesComponent } from './notes.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';

@NgModule({
  declarations: [
    NoteComponent,
    NotesComponent,
    NoteDialogComponent,
  ],
  imports: [CommonModule, SharedModule, NotificationsModule],
  entryComponents: [NoteDialogComponent],
})
export class NotesModule {}
