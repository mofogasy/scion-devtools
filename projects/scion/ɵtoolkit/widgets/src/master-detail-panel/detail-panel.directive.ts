import { Directive, TemplateRef } from '@angular/core';

/**
 * TODO
 */
@Directive({selector: 'ng-template[sciDetailPanel]'})
export class SciDetailPanelDirective {

  constructor(public readonly templateRef: TemplateRef<void>) {
  }
}
