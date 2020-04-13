import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RootComponent } from './root/root.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './admin.guard';
import { UsersComponent } from './components/users/users.component';
import { MappingValuesComponent } from './components/mapping-values/mapping-values.component';
import { SetupComponent } from './components/setup/setup.component';
import { SharedComponent } from './components/shared/shared.component';
import { DesignComponent } from './design/design.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: RootComponent, children: [
      { path: '', component: UsersComponent, canActivate: [AdminGuard] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
      { path: 'shared', component: SharedComponent, canActivate: [AdminGuard] },
      { path: 'mapping-values', component: MappingValuesComponent, canActivate: [AdminGuard] },
      { path: 'setup', component: SetupComponent, canActivate: [AdminGuard] },
      { path: 'desgin', component: DesignComponent, canActivate: [AdminGuard] }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }