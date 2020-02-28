import { Component, HostBinding } from '@angular/core';
import { Dimension } from '@scion/toolkit/observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isMenuBarLeft = true;

  @HostBinding('class.top')
  public get top(): boolean {
    return !this.isMenuBarLeft;
  }

  @HostBinding('class.left')
  public get left(): boolean {
    return this.isMenuBarLeft;
  }

  public onDimensionChange(dimension: Dimension) {
    this.isMenuBarLeft = dimension.clientHeight < dimension.clientWidth;
  }
}
