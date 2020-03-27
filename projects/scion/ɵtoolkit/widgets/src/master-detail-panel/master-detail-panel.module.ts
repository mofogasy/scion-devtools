import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SciMasterDetailPanelComponent } from './master-detail-panel.component';
import { SciViewportModule } from '@scion/toolkit/viewport';
import { SciMasterPanelDirective } from './master-panel.directive';
import { SciDetailPanelDirective } from './detail-panel.directive';

@NgModule({
  declarations: [
    SciMasterDetailPanelComponent,
    SciMasterPanelDirective,
    SciDetailPanelDirective
  ],
  imports: [
    CommonModule,
    SciViewportModule
  ],
  exports: [
    SciMasterDetailPanelComponent,
    SciMasterPanelDirective,
    SciDetailPanelDirective
  ]
})
export class SciMasterDetailPanelModule {

}
