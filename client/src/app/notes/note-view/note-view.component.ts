import { environment } from 'src/environments/environment';
import { NoteService } from 'src/app/shared/services/note.service';
import { Component, Input, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/models/note.model';
import { ActivatedRoute } from '@angular/router';
import * as saveAs from 'file-saver';

@Component({
  selector: 'note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss'],
})
export class NoteViewComponent implements OnInit {
  @Input()
  public noteID: number;

  public note: Note;

  public hightTextArea: string;

  public sharedLink = environment.clientUrl + '/shared?id=';

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly noteService: NoteService
  ) {
  }

  public ngOnInit(): void {
    this.hightTextArea = window.innerHeight - 250 + 'px';
    window.onresize = ()=>{
      this.hightTextArea = window.innerHeight - 250 + 'px';
    };
    this.route.queryParams
      .subscribe(params => {
        this.noteID = params.id;
        this.noteService.getNote(this.noteID).subscribe((note) => {
          this.note = note;
          this.sharedLink += note.id;
        });
      }
    );
  }

  public saveNote(): void {
    this.noteService.updateNote(this.note);
  }

  public shareNote(): void {
    this.note.shared = true;
    this.noteService.updateNote(this.note);
  }

  public unShareNote(): void {
    this.note.shared = false;
    this.noteService.updateNote(this.note);
  }

  public saveToFile(): void {
    const blob = new Blob([JSON.stringify(this.note)], { type: 'text/plain' });
    saveAs(blob, 'note.json');
  }
}
