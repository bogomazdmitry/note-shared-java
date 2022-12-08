import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesSheetComponent } from './notes/notes-sheet/notes-sheet.component';
import { NotesComponent } from './notes/notes.component';
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
