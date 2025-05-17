import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './features/home/home.component'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './core/services/http-interceptor.service';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { LoginComponent } from './features/login/login.component';
import { UserListComponent } from './features/user-list/user-list.component';
import { AddUserComponent } from './features/user-list/add-user/add-user.component';
import { EditUserComponent } from './features/user-list/edit-user/edit-user.component';
import { RoleListComponent } from './features/role-list/role-list.component';
import { AddRoleComponent } from './features/role-list/add-role/add-role.component';
import { EditRoleComponent } from './features/role-list/edit-role/edit-role.component';
import { ItemListComponent } from './features/item-list/item-list.component';
import { AddItemComponent } from './features/item-list/add-item/add-item.component';
import { EditItemComponent } from './features/item-list/edit-item/edit-item.component';
import { SalesComponent } from './features/sales/sales.component';
import { TooltipDirective } from './shared/directives/tooltip.directive';
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RegisterUserComponent } from './features/register-user/register-user.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AddSaleComponent } from './features/sales/add-sale/add-sale.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    UserListComponent,
    AddUserComponent,
    EditUserComponent,
    RoleListComponent,
    AddRoleComponent,
    EditRoleComponent,
    ItemListComponent,
    AddItemComponent,
    EditItemComponent,
    SalesComponent,
    TooltipDirective,
    BreadcrumbComponent,
    FooterComponent,
    RegisterUserComponent,
    AddSaleComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    FormsModule,   
    CoreModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const admin = {
      id:1,
      username: 'omit.com.np',
      password:'Admin@123',
      role:'Admin'
    }
    if(this.isBrowser()) {
      const loginCredential = [];
      loginCredential.push(admin);
      localStorage.setItem('users',JSON.stringify(loginCredential));
    }
  }
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
