import { Component, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { Application, Beans, CapabilityProvider, Intention, ManifestService } from '@scion/microfrontend-platform';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, first, flatMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { toFilterRegExp } from '@scion/ɵtoolkit/widgets';
import { SciTabBarComponent } from '@scion/ɵtoolkit/widgets';

@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnDestroy {
  private _destroy$ = new Subject<void>();

  public app: Application;
  public providers$: Observable<CapabilityProvider[]>;
  public intentions$: Observable<Intention[]>;

  @ViewChild(SciTabBarComponent)
  private _tabBar: SciTabBarComponent;
  private _providerFilter$ = new BehaviorSubject<string>(null);
  private _intentionFilter$ = new BehaviorSubject<string>(null);

  constructor(route: ActivatedRoute) {
    route.params
      .pipe(
        map(params => params.appSymbolicName),
        distinctUntilChanged(),
        switchMap(symbolicName => Beans.get(ManifestService).lookupApplications$()
          .pipe(
            flatMap(apps => of(...apps)),
            filter(app => app.symbolicName === symbolicName),
            first()
          )
        ),
        filter(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe((app: Application) => {
        const providers$: Observable<CapabilityProvider[]> = Beans.get(ManifestService).lookupCapabilityProviders$({appSymbolicName: app.symbolicName})
          .pipe(
            map(providers => providers.sort((c1, c2) => c1.type.localeCompare(c2.type)))
          );

        const intentions$: Observable<Intention[]> = Beans.get(ManifestService).lookupIntentions$({appSymbolicName: app.symbolicName})
          .pipe(
            map(intentions => intentions.sort((i1, it2) => i1.type.localeCompare(it2.type)))
          );

        this.app = app;
        this._tabBar.selectTab(0);
        this.providers$ = combineLatest([this._providerFilter$, providers$]).pipe(filterCapabilities());
        this.intentions$ = combineLatest([this._intentionFilter$, intentions$]).pipe(filterIntents());
      });
  }

  public onCapabilityFilter(filterText: string): void {
    this._providerFilter$.next(filterText);
  }

  public onIntentFilter(filterText: string): void {
    this._intentionFilter$.next(filterText);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
  }
}

function filterCapabilities(): OperatorFunction<[string, CapabilityProvider[]], CapabilityProvider[]> {
  return map(([filterText, capabilities]: [string, CapabilityProvider[]]): CapabilityProvider[] => {
    if (!filterText) {
      return capabilities;
    }

    const filterRegExp = toFilterRegExp(filterText);
    return capabilities.filter(capability => (
      filterRegExp.test(capability.type) ||
      filterRegExp.test(capability.private ? 'private' : 'public') ||
      Object.keys(capability.qualifier || {}).some(key => filterRegExp.test(key)) ||
      Object.values(capability.qualifier || {}).some(value => filterRegExp.test(`${value}`))),
    );
  });
}

function filterIntents(): OperatorFunction<[string, Intention[]], Intention[]> {
  return map(([filterText, intents]: [string, Intention[]]): Intention[] => {
    if (!filterText) {
      return intents;
    }

    const filterRegExp = toFilterRegExp(filterText);
    return intents.filter(intent => (
      filterRegExp.test(intent.type) ||
      Object.keys(intent.qualifier || {}).some(key => filterRegExp.test(key)) ||
      Object.values(intent.qualifier || {}).some(value => filterRegExp.test(`${value}`))),
    );
  });
}
