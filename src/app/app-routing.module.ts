import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppDependenciesComponent } from './app-dependencies/app-dependencies.component';
import { AppListComponent } from './app-list/app-list.component';
import { AppFilterComponent } from './app-filter/app-filter.component';
import { AppDetailsComponent } from './app-details/app-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'app-list', pathMatch: 'full'},
  {path: 'app-dependencies', component: AppDependenciesComponent},
  {path: 'app-filter', component: AppFilterComponent},
  {
    path: 'app-list',
    component: AppListComponent,
    children: [
      {path: 'app-detail/:appSymbolicName', component: AppDetailsComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
