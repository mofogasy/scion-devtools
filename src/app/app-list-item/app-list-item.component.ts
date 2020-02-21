import { Component, Input } from '@angular/core';
import { Application } from '@scion/microfrontend-platform';

@Component({
  selector: 'app-app-list-item',
  templateUrl: './app-list-item.component.html',
  styleUrls: ['./app-list-item.component.scss']
})
export class AppListItemComponent {

  @Input()
  public app: Application;

  public get intentCount(): number {
    return 1;
  }

  public get capabilityCount(): number {
    return 1;
  }

}
