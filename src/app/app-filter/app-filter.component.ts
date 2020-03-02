import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Beans, CapabilityProvider, ManifestObjectFilter, ManifestService, Qualifier } from '@scion/microfrontend-platform';
import { flatMap, map, mergeAll, reduce, take } from 'rxjs/operators';

const APP = 'app';
const TYPE = 'type';
const QUALIFIER = 'qualifier';

@Component({
  selector: 'app-app-filter',
  templateUrl: './app-filter.component.html',
  styleUrls: ['./app-filter.component.scss']
})
export class AppFilterComponent implements OnInit {

  public APP = APP;
  public TYPE = TYPE;
  public QUALIFIER = QUALIFIER;
  public form: FormGroup;
  public capabilityLookupResult$: Observable<CapabilityProvider[]>;

  private _apps = new BehaviorSubject<string[]>(['app-1', 'app-2', 'devtools']);
  private _types = new BehaviorSubject<string[]>(['beer', 'person', 'country', 'devtools']);
  private _qualifiers = new BehaviorSubject<Qualifier[]>([{'*': '*'}]);

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      [APP]: [''],
      [TYPE]: [''],
      [QUALIFIER]: fb.array([]),
    });

    this.capabilityLookupResult$ = combineLatest([
      this._apps,
      this._types,
      this._qualifiers
    ]).pipe(
      map(([apps, types, qualifiers]) => this.combine(apps, types, qualifiers)),
      flatMap(filters => filters.map(filter => Beans.get(ManifestService).lookupCapabilityProviders$(filter))),
      mergeAll(),
      take(12),
      // reduce((acc, apps) => {
      //   apps.forEach(app => acc.add(app));
      //   return acc;
      // }, new Set<CapabilityProvider>()),
      reduce((array, apps) => [...apps, ...array], []),
      map(apps => Array.from(apps).sort((p1, p2) => this.compare(p1, p2)))
    );
  }

  ngOnInit(): void {
  }

  private combine(apps: string[], types: string[], qualifiers: Qualifier[]): ManifestObjectFilter[] {
    const filters: ManifestObjectFilter[] = [];
    apps.forEach(app => {
      types.forEach(type => {
        qualifiers.forEach(qualifier => {
          filters.push({appSymbolicName: app, type, qualifier});
        });
      });
    });
    return filters;
  }

  private compare(p1: CapabilityProvider, p2: CapabilityProvider) {
    return p1.metadata.appSymbolicName.localeCompare(p2.metadata.appSymbolicName) ||
      p1.type.localeCompare(p2.type);
  }
}
