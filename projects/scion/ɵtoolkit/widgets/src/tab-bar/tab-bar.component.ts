import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'sci-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabBarComponent implements AfterContentInit {
  public tabTitles: string[];
  public selectedTemplate: TemplateRef<void>;
  public selectedIndex: number;

  @ContentChildren(TabDirective)
  private _tabBarItems: QueryList<TabDirective>;
  private _tabContent: TemplateRef<void>[];

  public ngAfterContentInit(): void {
    if (this._tabBarItems.length === 0) {
      throw new Error('[TabBarComponent]: at least one ng-template with sciTab directive has to be provided.');
    }

    this._tabContent = this._tabBarItems.map(item => item.templateRef);
    this.tabTitles = this._tabBarItems.map(item => item.title);
    this.onTabClick(0);
  }

  public onTabClick(tabIndex: number) {
    this.selectedIndex = tabIndex;
    this.selectedTemplate = this._tabContent[tabIndex];
  }
}
