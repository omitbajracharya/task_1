import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { A404PageComponent } from './core/components/a404-page/a404-page.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/services/auth.guard';
import { RoleGuard } from './core/services/role.guard';
import { Role } from './shared/models/role.model';
import { AddUserComponent } from './features/user-list/add-user/add-user.component';
import { EditUserComponent } from './features/user-list/edit-user/edit-user.component';
import { UserListComponent } from './features/user-list/user-list.component';
import { AddRoleComponent } from './features/role-list/add-role/add-role.component';
import { EditRoleComponent } from './features/role-list/edit-role/edit-role.component';
import { RoleListComponent } from './features/role-list/role-list.component';
import { AddItemComponent } from './features/item-list/add-item/add-item.component';
import { EditItemComponent } from './features/item-list/edit-item/edit-item.component';
import { ItemListComponent } from './features/item-list/item-list.component';
import { SalesComponent } from './features/sales/sales.component';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent },
//   { path: 'product', component: ProductComponent },
//   { path: 'order', component: OrderComponent },
//   { path: '404', component: A404PageComponent },
//   {
//     path: '**',
//     redirectTo: '404',
//   },
// ];

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.Admin, Role.Supervisor] },
  },
  // Admin routes
  {
    path: 'users',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.Admin] },
    children: [
      { path: '', component: UserListComponent },
      { path: 'add', component: AddUserComponent },
      { path: 'edit/:id', component: EditUserComponent },
    ],
  },
  {
    path: 'roles',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.Admin] },
    children: [
      { path: '', component: RoleListComponent },
      { path: 'add', component: AddRoleComponent },
      { path: 'edit/:id', component: EditRoleComponent },
    ],
  },
  // Items routes (Admin & Supervisor)
  {
    path: 'items',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.Admin, Role.Supervisor] },
    children: [
      { path: '', component: ItemListComponent },
      { path: 'add', component: AddItemComponent },
      { path: 'edit/:id', component: EditItemComponent },
    ],
  },
  // Sales routes (Admin & SalesPerson)
  {
    path: 'sales',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.Admin, Role.SalesPerson] },
    component: SalesComponent,
  },
  // 404 page
  {
    path: '**',
    component: A404PageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
