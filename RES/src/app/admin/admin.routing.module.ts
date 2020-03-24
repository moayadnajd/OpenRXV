import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RootComponent } from './root/root.component';

const routes: Routes = [
  {
    path: 'admin', component: RootComponent, children: [
      { path: '', component: DashboardComponent }
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }