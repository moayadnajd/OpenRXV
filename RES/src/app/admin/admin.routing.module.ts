import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RootComponent } from './root/root.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './admin.guard';
import { UsersComponent } from './components/users/users.component';
import { MappingMetadataComponent } from './components/mapping-metadata/mapping-metadata.component';
import { MappingValuesComponent } from './components/mapping-values/mapping-values.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'admin', component: RootComponent, children: [
      { path: '', component: DashboardComponent , canActivate: [AdminGuard]},
      { path: 'dashboard', component: DashboardComponent  , canActivate: [AdminGuard]},
      { path: 'users', component: UsersComponent  , canActivate: [AdminGuard]},
      { path: 'mapping-meta-data', component: MappingMetadataComponent  , canActivate: [AdminGuard]},
      { path: 'mapping-values', component: MappingValuesComponent  , canActivate: [AdminGuard]}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }