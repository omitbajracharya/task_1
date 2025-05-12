import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/product/product.component';
import { OrderComponent } from './features/order/order.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    OrderComponent,
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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
export class AppModule {}
