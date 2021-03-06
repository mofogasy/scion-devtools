import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, NgZone } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Beans, MessageClient, MicrofrontendPlatform, PlatformState, PlatformStates } from '@scion/microfrontend-platform';
import { AngularZoneMessageClientDecorator } from './angular-zone-message-client.decorator';
import { AppDependenciesComponent } from './app-dependencies/app-dependencies.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AppListComponent } from './app-list/app-list.component';
import { SciViewportModule } from '@scion/toolkit/viewport';
import {
  SciAccordionModule, SciFilterFieldModule, SciFormFieldModule, SciListModule, SciParamsEnterModule, SciPropertyModule, SciTabBarModule
} from '@scion/ɵtoolkit/widgets';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CapabilityAccordionPanelComponent } from './capability-accordion-panel/capability-accordion-panel.component';
import { CapabilityAccordionItemComponent } from './capability-accordion-item/capability-accordion-item.component';
import { IntentAccordionPanelComponent } from './intent-accordion-panel/intent-accordion-panel.component';
import { IntentAccordionItemComponent } from './intent-accordion-item/intent-accordion-item.component';
import { QualifierChipListComponent } from './qualifier-chip-list/qualifier-chip-list.component';
import { SciDimensionModule } from '@scion/toolkit/dimension';
import { FindCapabilitiesComponent } from './find-capabilities/find-capabilities.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SciSashboxModule } from '@scion/toolkit/sashbox';
import { FilterFieldComponent } from './find-capabilities/filter-field/filter-field.component';
import { AppListItemComponent } from './app-list-item/app-list-item.component';
import { FilterResultsComponent } from './filter-results/filter-results.component';

@NgModule({
  declarations: [
    AppComponent,
    AppDependenciesComponent,
    AppDetailsComponent,
    FindCapabilitiesComponent,
    AppListComponent,
    AppListItemComponent,
    CapabilityAccordionPanelComponent,
    CapabilityAccordionItemComponent,
    IntentAccordionPanelComponent,
    IntentAccordionItemComponent,
    QualifierChipListComponent,
    FilterFieldComponent,
    FilterResultsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SciViewportModule,
    SciListModule,
    SciAccordionModule,
    SciFilterFieldModule,
    SciParamsEnterModule,
    SciPropertyModule,
    SciTabBarModule,
    SciDimensionModule,
    SciFormFieldModule,
    SciSashboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private _zone: NgZone, title: Title) {
    title.setTitle('SCION Microfrontend Platform - Devtools');

    // Make the platform to run with Angular
    Beans.get(PlatformState).whenState(PlatformStates.Starting).then(() => {
      Beans.register(NgZone, {useValue: this._zone});
      Beans.registerDecorator(MessageClient, {useClass: AngularZoneMessageClientDecorator});
    });

    // Run the microfrontend platform as client app
    MicrofrontendPlatform.forClient({symbolicName: 'devtools'});
  }
}
