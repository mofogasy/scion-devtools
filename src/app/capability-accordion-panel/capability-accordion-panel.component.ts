import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Application, CapabilityProvider } from '@scion/microfrontend-platform';

@Component({
  selector: 'app-provider-accordion-panel',
  templateUrl: './capability-accordion-panel.component.html',
  styleUrls: ['./capability-accordion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapabilityAccordionPanelComponent implements OnChanges {

  public consumers$: Observable<Application[]>;

  @Input()
  public provider: CapabilityProvider;

  @HostBinding('class.has-properties')
  public hasProperties: boolean;

  constructor() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.hasProperties = Object.keys(this.provider.properties || {}).length > 0;
    // this.consumers$ = this._manifestRegistryService.capabilityConsumers$(this.provider.metadata.id)
    //   .pipe(map(consumers => [...consumers].sort((c1, c2) => c1.name.localeCompare(c2.name))));
  }
}
