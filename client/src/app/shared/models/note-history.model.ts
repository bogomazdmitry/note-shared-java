import { Note } from './note.model';

export interface NoteHistory {
  id: number;
  createdDateTime: Date;
  lastChangedDateTime: Date;
  noteID: number;
  note: Note | undefined;
}
