import { MuuriService } from './../../shared/services/muuri.service';
import { Overlay } from '@angular/cdk/overlay';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Note } from 'src/app/shared/models/note.model';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';

@Component({
  selector: 'notes-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnDestroy {
  @Input()
  public note: Note;

  private dialogIsOpened = false;

  private dialogRef: MatDialogRef<NoteDialogComponent, any>;

  private mousePosition = {
    x: 0,
    y: 0,
  };

  public constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    private readonly muuriService: MuuriService
  ) {
  }

  public ngOnDestroy(): void {
    if (this.dialogIsOpened) {
        this.dialogRef.close();
      }
  }

  public onMouseDown($event: MouseEvent): void {
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }

  public onMouseUp($event: MouseEvent): void {
    if (
      this.mousePosition.x !== $event.screenX &&
      this.mousePosition.y !== $event.screenY
    ) {
      this.muuriService.updateOrder();
    }
  }

  public openDialog($event: MouseEvent): void {
    if (
      !this.dialogIsOpened &&
      this.mousePosition.x === $event.screenX &&
      this.mousePosition.y === $event.screenY
    ) {
      this.dialogIsOpened = true;
      this.dialogRef = this.dialog.open(NoteDialogComponent, {
        data: this.note,
        disableClose: true,
        hasBackdrop: false,
        height: '500px',
        maxWidth: 'none',
        maxHeight: 'none',
        width: '780px',
        panelClass: 'note-dialog-container',
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
      this.dialogRef.afterClosed().subscribe((result) => {
        this.dialogIsOpened = false;
      });

    }
  }
}
