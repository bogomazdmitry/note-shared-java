import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[menuNotificationHost]',
})
export class MenuNotificationDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
