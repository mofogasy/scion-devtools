import { Injectable } from '@angular/core';
import { combineLatest, MonoTypeOperatorFunction, Observable, of, OperatorFunction, pipe } from 'rxjs';
import {
  Application, Beans, CapabilityProvider, Intent, Intention, ManifestObjectFilter, ManifestService
} from '@scion/microfrontend-platform';
import { map, switchMap } from 'rxjs/operators';
import { ManifestObject } from '@scion/microfrontend-platform/lib/host/manifest-registry/manifest-object-store';

@Injectable({
  providedIn: 'root'
})
export class DevToolsManifestService {

  public intentions$(filter: ManifestObjectFilter): Observable<Intention[]> {
    return Beans.get(ManifestService).lookupIntentions$(filter)
      .pipe(map(intentions => intentions.sort(byType)));
  }

  public capabilities$(filter: ManifestObjectFilter): Observable<CapabilityProvider[]> {
    return Beans.get(ManifestService).lookupCapabilityProviders$(filter)
      .pipe(map(providers => providers.sort(byType)));
  }

  public applicationsHandlingIntent$(intent: Intent): Observable<Application[]> {
    const capabilityFilter = {
      type: intent.type,
      qualifier: intent.qualifier
    };

    return combineLatest([
      Beans.get(ManifestService).lookupCapabilityProviders$(capabilityFilter).pipe(distinctAppSymbolicNames()),
      this.applicationsMap$()
    ]).pipe(applicationsBySymbolicName());
  }

  public applicationsUsingCapability$(capability: CapabilityProvider): Observable<Application[]> {
    const intentionFilter = {
      type: capability.type,
      qualifier: capability.qualifier
    };

    return combineLatest([
      Beans.get(ManifestService).lookupIntentions$(intentionFilter).pipe(distinctAppSymbolicNames()),
      this.applicationsMap$()
    ]).pipe(applicationsBySymbolicName());
  }

  public applicationsRequiredBy$(appSymbolicName: string): Observable<Application[]> {
    const mappingFunc = (intent) => this.applicationsHandlingIntent$(intent);
    return Beans.get(ManifestService).lookupIntentions$({appSymbolicName})
      .pipe(findDistinctApplications(appSymbolicName, mappingFunc));
  }

  public applicationsRequiring$(appSymbolicName: string): Observable<Application[]> {
    const mappingFunc = (capabilityProvider) => this.applicationsUsingCapability$(capabilityProvider);
    return Beans.get(ManifestService).lookupCapabilityProviders$({appSymbolicName})
      .pipe(findDistinctApplications(appSymbolicName, mappingFunc));
  }

  public applicationDependencyMap$(): Observable<Map<Application, Application[]>> {
    return Beans.get(ManifestService).lookupApplications$().pipe(
      switchMap(applications => combineLatest(
        applications.map(app => this.applicationsRequiredBy$(app.symbolicName)
          .pipe(map(apps => ({app, apps}))))
      )),
      map(arrayOfArrays => arrayOfArrays.reduce((appMap, dep) => appMap.set(dep.app, dep.apps), new Map<Application, Application[]>()))
    );
  }

  private applicationsMap$(): Observable<Map<string, Application>> {
    return Beans.get(ManifestService).lookupApplications$()
      .pipe(map(applications => applications.reduce((appMap, app) => appMap.set(app.symbolicName, app), new Map<string, Application>())));
  }
}

const bySymbolicName = (app1: Application, app2: Application): number => app1.symbolicName.localeCompare(app2.symbolicName);
const byType = (mo1: ManifestObject, mo2: ManifestObject): number => mo1.type.localeCompare(mo2.type);

function distinctAppSymbolicNames(): OperatorFunction<ManifestObject[], string[]> {
  return pipe(
    map(elements => elements.map(it => it.metadata.appSymbolicName)),
    map(elements => elements.reduce((elementSet, it) => elementSet.add(it), new Set<string>())),
    map(elementSet => Array.from(elementSet.values())),
  );
}

function applicationsBySymbolicName(): OperatorFunction<[string[], Map<string, Application>], Application[]> {
  return pipe(
    map(([appSymbolicNames, appMap]) => appSymbolicNames.map(appSymbolicName => appMap.get(appSymbolicName))),
    map(apps => Array.from(apps).sort(bySymbolicName)),
  );
}

function findDistinctApplications(appSymbolicName: string, mappingFunc: (it: ManifestObject) => Observable<Application[]>): OperatorFunction<ManifestObject[], Application[]> {
  return pipe(
    switchMap(elements => elements.length ? combineLatest(elements.map(element => mappingFunc(element)
      .pipe(map(apps => apps.filter(app => app.symbolicName !== appSymbolicName))))) : of([])
    ),
    map(arrayOfArrays => arrayOfArrays.reduce((resultingArray, array) => [...resultingArray, ...array], [])),
    distinctApplications(),
  );
}

function distinctApplications(): MonoTypeOperatorFunction<Application[]> {
  return pipe(
    map(applications => applications.reduce((appMap, app) => appMap.set(app.symbolicName, app), new Map<string, Application>())),
    map(appMap => Array.from(appMap.values()).sort(bySymbolicName))
  );
}


