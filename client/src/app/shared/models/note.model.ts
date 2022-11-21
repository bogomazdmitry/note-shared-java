import { UserRoleForNote } from './user-role-for-note.model';
import { NoteDesign } from './note-design.model';
import { NoteHistory } from './note-history.model';
import { NoteText } from './note-text.model';

export interface Note {
  id: number;
  order: number;
  noteDesign: NoteDesign | undefined;
  noteHistory: NoteHistory | undefined;
  noteText: NoteText;
  hexColor: string | undefined;
  userRole: UserRoleForNote;
}
