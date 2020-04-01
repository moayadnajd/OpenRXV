import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin.routing.module';
import { RootComponent } from './root/root.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard, MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UsersComponent } from './components/users/users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DemoMaterialModule } from 'src/app/material/material.module';
import { FormComponent } from './components/users/form/form.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { MappingMetadataComponent } from './components/mapping-metadata/mapping-metadata.component';
import { MetadataForm } from './components/mapping-metadata/form/metadata-form.component';
import { MappingValuesComponent } from './components/mapping-values/mapping-values.component';
import { ValuesForm } from './components/mapping-values/form/values-form.component';
import { SetupComponent } from './components/setup/setup.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
@NgModule({
  declarations: [
    DashboardComponent,
    RootComponent,
    LoginComponent,
    UsersComponent,
    FormComponent,
    ConfirmationComponent,
    MappingMetadataComponent,
    MetadataForm,
    MappingValuesComponent,
    ValuesForm,
    SetupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    CommonModule,
    DemoMaterialModule,
    AdminRoutingModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  entryComponents: [FormComponent, ConfirmationComponent,MetadataForm,ValuesForm]
})
export class AdminModule { }
