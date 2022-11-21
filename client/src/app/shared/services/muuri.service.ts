import { ElementRef, Injectable } from '@angular/core';
import Grid, * as Muuri from 'muuri';
import { NoteService } from './note.service';

@Injectable({ providedIn: 'root' })
export class MuuriService {
  private muuriIdToDatabaseId = new Map<number, number>();

  public refreshNotesElementMutation: MutationObserver;
  public addNotesElementMutation: MutationObserver;
  public initGridElementMutation: MutationObserver;

  public grid: Grid;
  public gridElement: ElementRef;

  public constructor(protected readonly noteService: NoteService) {}

  public setGridElement(gridElement: ElementRef): void {
    this.gridElement = gridElement;
  }

  public initGrid(): void {
    this.grid = new Muuri.default('.grid', {
      dragEnabled: true,
      layoutOnInit: true,
    });
    let onceUpdate = true;
    this.grid.on('layoutEnd', () => {
      if (onceUpdate) {
        onceUpdate = false;
        this.generateMuuriIdToDatabaseId();
        this.grid.refreshItems().layout();
        this.initGridElementMutation.disconnect();
        this.gridElement.nativeElement.classList.remove('hide');
        this.startRefreshMutation(this.refreshGrid.bind(this));
        this.startAddMutation(this.addElementToGrid.bind(this));
      }
    });
  }

  public startRefreshMutation(
    mutationFunction: (mutation: MutationRecord) => void
  ): void {
    const gridNativeElement = this.gridElement.nativeElement;

    this.refreshNotesElementMutation = new MutationObserver(
      (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
          mutationFunction(mutation);
        });
      }
    );

    this.refreshNotesElementMutation.observe(gridNativeElement, {
      attributeFilter: ['value', 'list'],
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  public startAddMutation(
    mutationFunction: (nodeList: NodeList) => void
  ): void {
    const gridNativeElement = this.gridElement.nativeElement;

    this.addNotesElementMutation = new MutationObserver(
      (mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            mutationFunction(mutation.addedNodes);
          }
        });
      }
    );

    this.addNotesElementMutation.observe(gridNativeElement, {
      attributeFilter: ['list'],
      childList: true,
      characterData: false,
      subtree: false,
    });
  }

  public startInitMutation(mutationFunction: () => void): void {
    const gridNativeElement = this.gridElement.nativeElement;

    this.initGridElementMutation = new MutationObserver(
      (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
          mutationFunction();
          return;
        }
      }
    );

    this.initGridElementMutation.observe(gridNativeElement, {
      attributeFilter: ['list'],
      childList: true,
      characterData: false,
      subtree: false,
    });
  }

  public refreshGrid(): void {
    this.grid.refreshItems().layout();
  }

  public addElementToGrid(addedNodes: NodeList): void {
    this.grid.add(addedNodes, { index: 0 });
    const muuriElements: any = this.grid.getItems();
    for (let i = 0; i < addedNodes.length; ++i) {
      this.muuriIdToDatabaseId.set(
        muuriElements[i]._id,
        this.noteService.notes[this.noteService.notes.length - 1 - i].id
      );
    }
    this.updateOrder();
  }

  public updateOrder(): void {
    const muuriElements: any = this.grid.getItems();
    for (let i = 0; i < muuriElements.length; ++i) {
      if (muuriElements[i]) {
        const databaseId = this.muuriIdToDatabaseId.get(muuriElements[i]._id);
        const noteIndex = this.noteService.notes.findIndex(
          (e) => e.id === databaseId
        );
        if (noteIndex >= 0) {
          this.noteService.notes[noteIndex].order = i;
        }
      }
    }
    this.noteService.updateOrder(this.noteService.notes).subscribe();
  }

  public generateMuuriIdToDatabaseId(): void {
    const muuriElements: any = this.grid.getItems();
    for (let i = 0; i < this.noteService.notes.length; ++i) {
      this.muuriIdToDatabaseId.set(
        muuriElements[i]._id,
        this.noteService.notes[i].id
      );
    }
  }
}
