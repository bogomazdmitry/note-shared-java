import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
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
export class NotesSheetComponent implements OnInit {

  public notes: Note[];
  public displayedColumns: string[] = ['title', 'text', 'color', 'controls'];
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
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'text': return item.noteText?.text;
          case 'title': return item.noteText?.title;
          case 'color': return item.noteDesign?.color ?? '';
          default: return item.order;
        }
      };
      this.dataSource.filterPredicate = (n, filterValue) => {
        filterValue = filterValue.trim().toLowerCase();
        return !!n.noteText.text && n.noteText.text.toLowerCase().includes(filterValue)
          || !!n.noteText.title && n.noteText.title.toLowerCase().includes(filterValue)
          || !!n.noteDesign?.color && n.noteDesign?.color.toLowerCase().includes(filterValue);
      };
    });
  }

  public announceSortChange(sortState: Sort) {
    console.error('call announceSortChange');
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Отсортировано по ${sortState.direction}`);
    } else {
      this.liveAnnouncer.announce('Не отвортировано');
    }
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }
}
