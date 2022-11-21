import { GlobalErrorService } from './../../services/global-error.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'shared-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
})
export class GlobalErrorComponent implements OnInit, OnDestroy {
  public visible: boolean;
  public error: string;
  private subscription: Subscription;

  constructor(private readonly globalErrorService: GlobalErrorService) {
    this.visible = false;
    this.error = '';
  }

  public ngOnInit(): void {
    this.subscription = this.globalErrorService.subscribe((error: string) => {
      this.error = error;
      if (this.error) {
        this.visible = true;
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public close(): void {
    this.visible = false;
  }
}
