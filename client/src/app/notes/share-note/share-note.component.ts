import { NoteService } from 'src/app/shared/services/note.service';
import { Component, Input, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/models/note.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'share-note',
  templateUrl: './share-note.component.html',
  styleUrls: ['./share-note.component.scss'],
})
export class ShareNoteComponent implements OnInit {
  @Input()
  public noteID: number;

  public note: Note;

  public hightTextArea: string;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly noteService: NoteService
  ) {
  }

  public ngOnInit(): void {
    this.hightTextArea = window.innerHeight - 250 + 'px';
    window.onresize = () =>{
      this.hightTextArea = window.innerHeight - 250 + 'px';
    };
    this.route.queryParams
      .subscribe(params => {
        this.noteID = params.id;
        this.noteService.getNote(this.noteID).subscribe((note) => {
          this.note = note;
        });
      }
    );
  }

  public saveNote(): void {
    this.noteService.updateNoteText(this.note.noteText).subscribe();
  }
}
