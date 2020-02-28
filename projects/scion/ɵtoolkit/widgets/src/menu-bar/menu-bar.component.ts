import { ChangeDetectionStrategy, Component, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { SciMenuItemDirective } from './menu-item.directive';

@Component({
  selector: 'sci-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SciMenuBarComponent {

  @ContentChildren(SciMenuItemDirective, {read: TemplateRef})
  public links: QueryList<TemplateRef<SciMenuItemDirective>>;
}
