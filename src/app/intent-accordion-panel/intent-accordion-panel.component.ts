import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Application, Intention } from '@scion/microfrontend-platform';

@Component({
  selector: 'app-intent-accordion-panel',
  templateUrl: './intent-accordion-panel.component.html',
  styleUrls: ['./intent-accordion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntentAccordionPanelComponent implements OnChanges {

  public providers$: Observable<Application[]>;

  @Input()
  public intent: Intention;

  constructor() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // this.providers$ = this._manifestRegistryService.capabilityProviders$(this.intent.metadata.id)
    //   .pipe(map(providers => [...providers].sort((p1, p2) => p1.name.localeCompare(p2.name))));
  }
}
