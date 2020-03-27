import { Directive, TemplateRef } from '@angular/core';

/**
 * TODO
 */
@Directive({selector: 'ng-template[sciMasterPanel]'})
export class SciMasterPanelDirective {

  constructor(public readonly templateRef: TemplateRef<void>) {
  }
}
