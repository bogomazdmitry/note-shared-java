import {
  Component,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { NoteService } from '../../shared/services/note.service';
import { Note } from '../../shared/models/note.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';


@Component({
  selector: 'notes-sheet',
  templateUrl: './notes-sheet.component.html',
  styleUrls: ['./notes-sheet.component.scss'],
})
export class NotesSheetComponent implements OnInit, OnChanges {

  public notes: Note[];
  public displayedColumns: string[] = ['text', 'title', 'color', 'controls'];
  public dataSource: MatTableDataSource<Note>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly liveAnnouncer: LiveAnnouncer,
    private readonly noteService: NoteService
  ) { }

  public ngOnInit(): void {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;
      this.dataSource = new MatTableDataSource(this.notes);
      this.dataSource.sort = this.sort;
    });
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.notes = changes.notes.currentValue;
    this.dataSource = new MatTableDataSource(this.notes);
    this.dataSource.sort = this.sort;
  }

  public getNotes(): Note[] {
    return this.noteService.notes;
  }
}
