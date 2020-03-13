import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, QueryList, TemplateRef
} from '@angular/core';
import { SciTabDirective } from './tab.directive';

@Component({
  selector: 'sci-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SciTabBarComponent implements AfterContentInit {

  @ContentChildren(SciTabDirective)
  public tabBarItems: QueryList<SciTabDirective>;
  public selectedIndex = 0;

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  public ngAfterContentInit(): void {
    if (this.tabBarItems.length === 0) {
      throw new Error('[SciTabBarComponent]: at least one ng-template with sciTab directive has to be provided.');
    }
  }

  public selectTab(tabIndex: number) {
    this.selectedIndex = tabIndex;
    this._cdRef.markForCheck();
  }

  public getTempalte(index: number): TemplateRef<void> {
    return this.tabBarItems.toArray()[index].templateRef;
  }
}
