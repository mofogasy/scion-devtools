import { NgModule } from '@angular/core';
import { SciTabBarComponent } from './tab-bar.component';
import { SciTabDirective } from './tab.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SciTabBarComponent,
    SciTabDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SciTabBarComponent,
    SciTabDirective
  ]
})
export class SciTabBarModule {
}
