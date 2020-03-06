import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { Beans, CapabilityProvider, ManifestObjectFilter, ManifestService, Qualifier } from '@scion/microfrontend-platform';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { SciParamsEnterComponent } from '@scion/ɵtoolkit/widgets';

const APP = 'app';
const TYPE = 'type';
const QUALIFIER = 'qualifier';

@Component({
  selector: 'app-app-filter',
  templateUrl: './app-filter.component.html',
  styleUrls: ['./app-filter.component.scss']
})
export class AppFilterComponent implements OnDestroy {

  public APP = APP;
  public TYPE = TYPE;
  public QUALIFIER = QUALIFIER;
  public form: FormGroup;
  public capabilityLookupResult$: Observable<CapabilityProvider[]>;

  private _xxx = new Xxx();

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      [APP]: [''],
      [TYPE]: [''],
      [QUALIFIER]: fb.array([]),
    });

    this.capabilityLookupResult$ = this._xxx.results$();
  }

  public get apps(): string[] {
    return this._xxx.apps;
  }

  public get types(): string[] {
    return this._xxx.types;
  }

  public get qualifiers(): Qualifier[] {
    return this._xxx.qualifiers;
  }

  public hasFilter(): boolean {
    return this._xxx.hasFilter();
  }

  public hasSubscription(): boolean {
    return this._xxx.hasSubscription();
  }

  public getKeys(qualifier: Qualifier): string[] | undefined {
    const keys = Object.keys(qualifier);
    return keys.length ?  keys : undefined;
  }

  public onAddAppFilter(): void {
    const app = this.form.get(APP).value;
    this.form.get(APP).setValue('');
    this._xxx.addApp(app);
  }

  public onAddTypeFilter(): void {
    const type = this.form.get(TYPE).value;
    this.form.get(TYPE).setValue('');
    this._xxx.addType(type);
  }

  public onAddQualifierFilter(): void {
    const qualifier = SciParamsEnterComponent.toParamsDictionary(this.form.get(QUALIFIER) as FormArray, false);
    (this.form.get(QUALIFIER) as FormArray).clear();
    this._xxx.addQualifier(qualifier);
  }

  public onRemoveAppFilter(app: string): void {
    this._xxx.removeApp(app);
  }

  public onRemoveTypeFilter(type: string): void {
    this._xxx.removeType(type);
  }

  public onRemoveQualifierFilter(qualifier: Qualifier): void {
    this._xxx.removeQualifier(qualifier);
  }

  public ngOnDestroy(): void {
    this._xxx.destroy();
  }
}

class Xxx {
  private _destroy$ = new Subject<void>();
  private _update$ = new Subject<void>();
  private _map = new Map<ManifestObjectFilter, FilterValue>();
  private _apps = new Set<string>();
  private _types = new Set<string>();
  private _qualifiers = new Set<Qualifier>();

  public results$(): Observable<CapabilityProvider[]> {
    return this._update$.pipe(
      debounceTime(100),
      map(() => Array.from(this._map.values())
        .map(filter => filter.lastResult || [])
        .reduce((array, apps) => [...apps, ...array], [])
        .sort((p1, p2) => compare(p1, p2))
        // TODO: improve filtering
        .filter((provider, index, array) => {
          if (index < array.length - 1) {
            const other = array[index + 1];
            return !(provider.metadata.appSymbolicName === other.metadata.appSymbolicName
              && provider.type === other.type
              && isEqualQualifier(provider.qualifier, other.qualifier)
            );
          }
          return true;
        })
      )
    );
  }

  public get apps(): string[] {
    return Array.from(this._apps.values());
  }

  public get types(): string[] {
    return Array.from(this._types.values());
  }

  public get qualifiers(): Qualifier[] {
    return Array.from(this._qualifiers.values());
  }

  public hasFilter(): boolean {
    return !!this._apps.size || !!this._types.size || !!this._qualifiers.size;
  }

  public hasSubscription(): boolean {
    return !!this._map.size;
  }

  public addApp(app: string) {
    if (this._apps.has(app)) {
      return;
    }
    Array.from(this._map.keys()).forEach(filter => {
      if (filter.appSymbolicName === undefined) {
        this.removeFilter(filter);
      }
      this.addFilter({appSymbolicName: app, type: filter.type, qualifier: filter.qualifier});
    });

    if (!this._map.size) {
      this.addFilter({appSymbolicName: app});
    }
    this._apps.add(app);
  }

  private addFilter(filter: ManifestObjectFilter): void {
    this._map.set(filter, {
      subscription: Beans.get(ManifestService).lookupCapabilityProviders$(filter)
        .pipe(takeUntil(this._destroy$))
        .subscribe(result => {
          this._map.get(filter).lastResult = result;
          this._update$.next();
        })
    });
  }

  private removeFilter(filter: ManifestObjectFilter): void {
    const filterValue: FilterValue = this._map.get(filter);
    if (filterValue) {
      filterValue.subscription.unsubscribe();
      this._map.delete(filter);
      this._update$.next();
      return;
    }
    throw new Error(`[AppFilterComponent]: no filter found for removing. Filter: ${filter}`);
  }

  public addType(type: string): void {
    if (this._types.has(type)) {
      return;
    }
    Array.from(this._map.keys()).forEach(filter => {
      if (filter.type === undefined) {
        this.removeFilter(filter);
      }
      this.addFilter({appSymbolicName: filter.appSymbolicName, type, qualifier: filter.qualifier});
    });
    if (!this._map.size) {

      this.addFilter({type});
    }
    this._types.add(type);
  }

  public addQualifier(qualifier: Qualifier): void {
    if (Array.from(this._qualifiers.values()).find(candidate => isEqualQualifier(candidate, qualifier))) {
      return;
    }
    Array.from(this._map.keys()).forEach(filter => {
      if (filter.qualifier === undefined) {
        this.removeFilter(filter);
      }
      this.addFilter({appSymbolicName: filter.appSymbolicName, type: filter.type, qualifier});
    });
    if (!this._map.size) {

      this.addFilter({qualifier});
    }
    this._qualifiers.add(qualifier);
  }

  public removeApp(app: string) {
    this._apps.delete(app);
    Array.from(this._map.keys()).forEach(filter => {
      if (filter.appSymbolicName === app) {
        this.removeFilter(filter);
      }
      if (this._apps.size === 0 && (this._types.size || this._qualifiers.size)) {
        this.addFilter({type: filter.type, qualifier: filter.qualifier});
      }
    });
  }

  public removeType(type: string) {
    this._types.delete(type);
    Array.from(this._map.keys()).forEach(filter => {
      if (filter.type === type) {
        this.removeFilter(filter);
      }
      if (this._types.size === 0 && (this._apps.size || this._qualifiers.size)) {
        this.addFilter({appSymbolicName: filter.appSymbolicName, qualifier: filter.qualifier});
      }
    });
  }

  public removeQualifier(qualifier: Qualifier) {
    this._qualifiers.delete(qualifier);
    Array.from(this._map.keys()).forEach(filter => {
      if (isEqualQualifier(filter.qualifier, qualifier)) {
        this.removeFilter(filter);
      }
      if (this._qualifiers.size === 0 && (this._types.size || this._apps.size)) {
        this.addFilter({appSymbolicName: filter.appSymbolicName, type: filter.type});
      }
    });
  }

  public destroy() {
    this._destroy$.next();
  }
}

interface FilterValue {
  subscription: Subscription;
  lastResult?: CapabilityProvider[];
}

function compare(p1: CapabilityProvider, p2: CapabilityProvider) {
  return p1.metadata.appSymbolicName.localeCompare(p2.metadata.appSymbolicName) || p1.type.localeCompare(p2.type);
}

// TODO: export from microfrontend-platform or put into utils
export function isEqualQualifier(qualifier1: Qualifier, qualifier2: Qualifier): boolean {
  qualifier1 = qualifier1 || {};
  qualifier2 = qualifier2 || {};

  // Test if qualifier2 has all required entries
  if (!Object.keys(qualifier1).every(key => qualifier2.hasOwnProperty(key))) {
    return false;
  }

  // Test if qualifier2 has no additional entries
  if (!Object.keys(qualifier2).every(key => qualifier1.hasOwnProperty(key))) {
    return false;
  }

  // Test if values match
  return Object.keys(qualifier1).every(key => qualifier1[key] === qualifier2[key]);
}
