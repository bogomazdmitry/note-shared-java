import { element } from 'protractor';
import { MuuriService } from './../shared/services/muuri.service';
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NoteService } from '../shared/services/note.service';
import { Note } from '../shared/models/note.model';
import { AcceptValidator, MaxSizeValidator } from '@angular-material-components/file-input';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'notes-notes-grid',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('gridElement', { read: ElementRef })
  public gridElement: ElementRef;

  public file: File;

  public searchItem: string;

  public fileControl: FormControl;

  public constructor(
    private readonly noteService: NoteService,
    private readonly muuriService: MuuriService
  ) {
    this.fileControl = new FormControl(this.file);
  }

  public ngAfterViewInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      const list = document.getElementsByClassName('ng-star-inserted');
      Array.prototype.forEach.call(list, (el) => {
        if (el.textContent === 'Choose a file') {
          el.textContent = 'Выберите файл';
        }
      });
    });
    this.muuriService.setGridElement(this.gridElement);
    if (this.gridElement.nativeElement.childElementCount > 0) {
      this.muuriService.initGrid();
    } else {
      this.muuriService.startInitMutation(
        this.muuriService.initGrid.bind(this.muuriService)
      );
    }
  }

  public ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: any) => {
      this.file = files;
      files.text().then((text: any) => {
        const newNote: Note = JSON.parse(text);
        this.noteService.createNoteFromTemplate(newNote);
        console.log('1');
        this.fileControl.reset();
        console.log('2');
      });
    });
  }

  public createNote(): void {
    this.noteService.createNote();
  }

  public getNotes(): Note[] {
    return this.noteService.notes;
  }


  public clickSearch() {
    this.noteService.searchNotes(this.searchItem);
  }

  public ngOnDestroy(): void {
    this.muuriService.refreshNotesElementMutation?.disconnect();
    this.muuriService.addNotesElementMutation?.disconnect();
  }
}
