import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, OperatorFunction, Subject } from 'rxjs';
import { Application, Beans, CapabilityProvider, Intention, ManifestService } from '@scion/microfrontend-platform';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { SciTabBarComponent, toFilterRegExp } from '@scion/ɵtoolkit/widgets';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input()
  public app: Application;

  public providers$: Observable<CapabilityProvider[]>;
  public intentions$: Observable<Intention[]>;

  @ViewChild(SciTabBarComponent)
  private _tabBar: SciTabBarComponent;
  private _app$ = new Subject<Application>();
  private _providerFilter$ = new BehaviorSubject<string>(null);
  private _intentionFilter$ = new BehaviorSubject<string>(null);
  private _destroy$ = new Subject<void>();
  private _unsubscribe$ = new Subject<void>();
  private _selectTab$ = new BehaviorSubject<number>(0);
  // public platformFlagsForm: FormGroup;

  constructor(fb: FormBuilder) {
    // this.platformFlagsForm = fb.group({
    //   scopeCheckDisabled: [{value: '', disabled: true}],
    //   intentionRegisterApiDisabled: [{value: '', disabled: true}],
    //   intentionCheckDisabled: [{value: '', disabled: true}]
    // });

    this.installApplicationChangedListener();
  }

  private installApplicationChangedListener(): void {
    this._app$
      .pipe(
        distinctUntilChanged(),
        filter(Boolean),
        takeUntil(this._destroy$),
      )
      .subscribe((app: Application) => {
        this._unsubscribe$.next();

        const providers$: Observable<CapabilityProvider[]> = Beans.get(ManifestService).lookupCapabilityProviders$({appSymbolicName: app.symbolicName})
          .pipe(
            map(providers => providers.sort((c1, c2) => c1.type.localeCompare(c2.type))),
            takeUntil(this._unsubscribe$)
          );

        const intentions$: Observable<Intention[]> = Beans.get(ManifestService).lookupIntentions$({appSymbolicName: app.symbolicName})
          .pipe(
            map(intentions => intentions.sort((i1, it2) => i1.type.localeCompare(it2.type))),
            takeUntil(this._unsubscribe$)
          );

        this._selectTab$.next(0);
        // this.platformFlagsForm.patchValue(app);
        this.providers$ = combineLatest([this._providerFilter$, providers$])
          .pipe(
            filterCapabilities(),
            takeUntil(this._unsubscribe$)
          );
        this.intentions$ = combineLatest([this._intentionFilter$, intentions$])
          .pipe(
            filterIntents(),
            takeUntil(this._unsubscribe$)
          );
      });
  }

  public onCapabilityFilter(filterText: string): void {
    this._providerFilter$.next(filterText);
  }

  public onIntentFilter(filterText: string): void {
    this._intentionFilter$.next(filterText);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.app) {
      this._app$.next(changes.app.currentValue);
    }
  }

  public ngAfterViewInit(): void {
    this._selectTab$.pipe(takeUntil(this._destroy$)).subscribe(tab => this._tabBar.selectTab(tab));
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
