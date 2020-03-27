import { ChangeDetectionStrategy, Component, ContentChild, HostBinding } from '@angular/core';
import { SciMasterPanelDirective } from './master-panel.directive';
import { SciDetailPanelDirective } from './detail-panel.directive';

@Component({
  selector: 'sci-master-detail-panel',
  templateUrl: './master-detail-panel.component.html',
  styleUrls: ['./master-detail-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SciMasterDetailPanelComponent {

  @ContentChild(SciMasterPanelDirective)
  public masterTemplate: SciMasterPanelDirective;

  @ContentChild(SciDetailPanelDirective)
  public detailTemplate: SciDetailPanelDirective;

  private _showMaster = true;

  @HostBinding('class.show-master')
  public get showMaster(): boolean {
    return this._showMaster;
  }

  @HostBinding('class.show-detail')
  public get showDetail(): boolean {
    return !!this.detailTemplate;
  }

  public onShowMasterClicked(): void {
    this._showMaster = true;
  }

  public onHideMasterClicked(): void {
    this._showMaster = false;
  }
}
