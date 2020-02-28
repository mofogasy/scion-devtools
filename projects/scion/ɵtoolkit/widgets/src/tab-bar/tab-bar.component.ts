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
  public tabTitles: string[];
  public selectedTemplate: TemplateRef<void>;
  public selectedIndex: number;

  @ContentChildren(SciTabDirective)
  private _tabBarItems: QueryList<SciTabDirective>;
  private _tabContent: TemplateRef<void>[];

  constructor(private _cdRef: ChangeDetectorRef) {
  }

  public ngAfterContentInit(): void {
    if (this._tabBarItems.length === 0) {
      throw new Error('[SciTabBarComponent]: at least one ng-template with sciTab directive has to be provided.');
    }
    this._tabContent = this._tabBarItems.map(item => item.templateRef);
    this.tabTitles = this._tabBarItems.map(item => item.title);
  }

  public selectTab(tabIndex: number) {
    this.selectedIndex = tabIndex;
    this.selectedTemplate = this._tabContent[tabIndex];
    this._cdRef.markForCheck();
  }
}
