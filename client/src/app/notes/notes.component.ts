import { MuuriService } from './../shared/services/muuri.service';
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { NoteService } from '../shared/services/note.service';
import { Note } from '../shared/models/note.model';

@Component({
  selector: 'notes-notes-grid',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gridElement', { read: ElementRef })
  public gridElement: ElementRef;

  public constructor(
    private readonly noteService: NoteService,
    private readonly muuriService: MuuriService
  ) {}

  public ngAfterViewInit(): void {
    this.muuriService.setGridElement(this.gridElement);
    if (this.gridElement.nativeElement.childElementCount > 0) {
      this.muuriService.initGrid();
    } else {
      this.muuriService.startInitMutation(
        this.muuriService.initGrid.bind(this.muuriService)
      );
    }
  }

  public createNote(): void {
    this.noteService.createNote();
  }

  public getNotes(): Note[] {
    return this.noteService.notes;
  }

  public ngOnDestroy(): void {
    this.muuriService.refreshNotesElementMutation?.disconnect();
    this.muuriService.addNotesElementMutation?.disconnect();
  }
}
