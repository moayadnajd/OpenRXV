import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing.module';
import { RootComponent } from './root/root.component';

@NgModule({
  declarations: [DashboardComponent, RootComponent],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  bootstrap:[DashboardComponent],
  exports:[AdminRoutingModule]
})
export class AdminModule { }
