import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';

export const rutasHias: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes,
    // canActivate: [ AuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(rutasHias)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
