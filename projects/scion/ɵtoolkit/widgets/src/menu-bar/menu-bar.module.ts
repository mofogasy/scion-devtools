import { NgModule } from '@angular/core';
import { SciMenuBarComponent } from './menu-bar.component';
import { CommonModule } from '@angular/common';
import { SciMenuItemDirective } from './menu-item.directive';

@NgModule({
  declarations: [
    SciMenuBarComponent,
    SciMenuItemDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SciMenuBarComponent,
    SciMenuItemDirective
  ]
})
export class SciMenuBarModule {
}
