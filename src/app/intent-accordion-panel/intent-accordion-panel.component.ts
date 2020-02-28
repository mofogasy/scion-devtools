import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Application, Beans, Intention, ManifestService } from '@scion/microfrontend-platform';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-intent-accordion-panel',
  templateUrl: './intent-accordion-panel.component.html',
  styleUrls: ['./intent-accordion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntentAccordionPanelComponent implements OnChanges {

  public providers$: Observable<Application[]>;
  private _applications$: Observable<{ [symbolicName: string]: Application }>;

  @Input()
  public intent: Intention;

  constructor() {
    this._applications$ = Beans.get(ManifestService).lookupApplications$()
      .pipe(map(applications => applications.reduce((appMap, app) => ({[app.symbolicName]: app, ...appMap}), {})));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.providers$ = combineLatest([
      Beans.get(ManifestService).lookupCapabilityProviders$({type: this.intent.type, qualifier: this.intent.qualifier}),
      this._applications$]
    ).pipe(
      map(([providers, appMap]) => providers.map(provider => appMap[provider.metadata.appSymbolicName])),
      map(apps => [...apps].sort((p1, p2) => p1.symbolicName.localeCompare(p2.symbolicName)))
    );
  }
}
