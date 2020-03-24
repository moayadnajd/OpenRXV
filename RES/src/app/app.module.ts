import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorerModule } from './explorer/explorer.module';
import { AdminModule } from './admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { RootComponent } from './root/root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    BrowserModule,
    ExplorerModule,
    AdminModule,
    CommonModule,
    AppRoutingModule
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
