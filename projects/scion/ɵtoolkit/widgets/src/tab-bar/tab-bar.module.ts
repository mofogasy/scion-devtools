import { NgModule } from '@angular/core';
import { TabBarComponent } from './tab-bar.component';
import { TabDirective } from './tab.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TabBarComponent,
    TabDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TabBarComponent,
    TabDirective
  ]
})
export class TabBarModule {}
