import { Component } from '@angular/core';
import { Application, Beans, ManifestService } from '@scion/microfrontend-platform';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent {

  public applications$: Observable<Application[]>;
  public showDetail: boolean;
  private _appFilter$ = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.applications$ = combineLatest([this._appFilter$, Beans.get(ManifestService).lookupApplications$()])
      .pipe(
        map(([appFilter, apps]) => apps
          .filter(app => app.name.toLowerCase().includes(appFilter))
          .sort((app1, app2) => app1.name.localeCompare(app2.name))
        ));

    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.showDetail = event.url.includes('app-detail'));
  }

  public trackByFn(app: Application): string {
    return app.symbolicName;
  }

  public onAppFilter(appFilter: string): void {
    this._appFilter$.next(appFilter.toLowerCase());
  }
}
