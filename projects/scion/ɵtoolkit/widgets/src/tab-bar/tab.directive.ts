import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * Use this directive to model a tab item for {SciTabBarComponent}.
 * The host element of this modelling directive must be a <ng-template>.
 *
 * ---
 * Example usage:
 *
 * <sci-tab-bar>
 *   <ng-template sciTab="contact.name" *ngFor="let contact of contacts$ | async">
 *     <app-contact-list-item [contact]="contact"></app-contact-list-item>
 *   </ng-template>
 * </sci-tab-bar>
 */
@Directive({selector: 'ng-template[sciTab]'})
export class TabDirective {

  constructor(public readonly templateRef: TemplateRef<void>) {
  }

  /**
   * Represents the title displayed in the tab.
   */
  @Input('sciTab')
  public title: string;
}
