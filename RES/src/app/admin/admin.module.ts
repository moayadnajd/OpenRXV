import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing.module';
import { RootComponent } from './root/root.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [DashboardComponent, RootComponent],
  imports: [
    BrowserModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    CommonModule,
    AdminRoutingModule
  ],
  bootstrap:[RootComponent]
})
export class AdminModule { }
