import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteViewComponent } from './notes/note-view/note-view.component';
import { NotesSheetComponent } from './notes/notes-sheet/notes-sheet.component';
import { NotesComponent } from './notes/notes.component';
import { ShareNoteComponent } from './notes/share-note/share-note.component';
import { AuthGuard } from './shared/access/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: NotesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'note-sheet',
    component: NotesSheetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view',
    component: NoteViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shared',
    component: ShareNoteComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
