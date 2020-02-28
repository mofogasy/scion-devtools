import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Application, Beans, CapabilityProvider, ManifestService } from '@scion/microfrontend-platform';

@Component({
  selector: 'app-provider-accordion-panel',
  templateUrl: './capability-accordion-panel.component.html',
  styleUrls: ['./capability-accordion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapabilityAccordionPanelComponent implements OnChanges {

  public consumers$: Observable<Application[]>;
  private _applications$: Observable<{ [symbolicName: string]: Application }>;

  @Input()
  public provider: CapabilityProvider;

  @HostBinding('class.has-properties')
  public hasProperties: boolean;

  constructor() {
    this._applications$ = Beans.get(ManifestService).lookupApplications$()
      .pipe(map(applications => applications.reduce((appMap, app) => ({[app.symbolicName]: app, ...appMap}), {})));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.hasProperties = Object.keys(this.provider.properties || {}).length > 0;
    this.consumers$ = combineLatest([
      Beans.get(ManifestService).lookupIntentions$({type: this.provider.type, qualifier: this.provider.qualifier}),
      this._applications$]
    ).pipe(
      map(([providers, appMap]) => providers.map(provider => appMap[provider.metadata.appSymbolicName])),
      map(apps => [...apps].sort((p1, p2) => p1.symbolicName.localeCompare(p2.symbolicName)))
    );
  }
}
