import { Component } from '@angular/core';
import { Application, Beans, ManifestService, PlatformState, PlatformStates } from '@scion/microfrontend-platform';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent {
  public applications$: Observable<Application[]>;

  constructor() {
    Beans.get(PlatformState).whenState(PlatformStates.Started).then(() => {
      this.applications$ = Beans.get(ManifestService).lookupApplications$();
    });
  }

  public trackByFn(app: Application): string {
    return app.symbolicName;
  }
}
