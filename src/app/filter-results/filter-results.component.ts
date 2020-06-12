import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CapabilityProvider } from '@scion/microfrontend-platform';
import { ManifestFilterStore } from '../find-capabilities/manifest-filter-store.service';

@Component({
  selector: 'app-filter-results',
  templateUrl: './filter-results.component.html',
  styleUrls: ['./filter-results.component.scss']
})
export class FilterResultsComponent {

  public title = 'Filter Results';
  public capabilityLookupResult$: Observable<CapabilityProvider[]>;

  constructor(private _manifestFilterStore: ManifestFilterStore) {
    this.capabilityLookupResult$ = this._manifestFilterStore.results$();
  }
}
