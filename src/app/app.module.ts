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
import { SciListModule } from '@scion/ɵtoolkit/widgets';

@NgModule({
  declarations: [
    AppComponent,
    AppDependenciesComponent,
    AppDetailsComponent,
    AppListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SciViewportModule,
    SciListModule
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
