import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppDependenciesComponent } from './app-dependencies/app-dependencies.component';
import { AppListComponent } from './app-list/app-list.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AppFilterComponent } from './app-filter/app-filter.component';

const routes: Routes = [
  {path: 'app-dependencies', component: AppDependenciesComponent},
  {path: 'app-filter', component: AppFilterComponent},
  {path: 'app-list', component: AppListComponent},
  {path: 'app-details/:appSymbolicName', component: AppDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
