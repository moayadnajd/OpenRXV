import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorerModule } from './explorer/explorer.module';
import { AdminModule } from './admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { RootComponent } from './root/root.component';
import { JwtModule,JwtHelperService } from '@auth0/angular-jwt';
import { NotfoundComponent } from './components/notfound/notfound.component';
export function tokenGetter() {
  return localStorage.getItem("access_token");
}
@NgModule({
  declarations: [RootComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    ExplorerModule,
    AdminModule,
    CommonModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:3000"],
        blacklistedRoutes: ["example.com/examplebadroute/"]
      }
    })
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
