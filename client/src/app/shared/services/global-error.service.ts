import { BehaviorSubject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalErrorService {
  private errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
  }

  public addError(error: string): void {
    this.errorSubject.next(this.errorSubject.value + ' ' + error);
  }

  public setError(error: string): void {
    this.errorSubject.next(error);
  }

  public subscribe(
    next?: (value: string) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.errorSubject.subscribe(next, error, complete);
  }
}
