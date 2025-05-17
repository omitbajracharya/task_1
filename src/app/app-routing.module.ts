import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { RegisterUserComponent } from './features/register-user/register-user.component';
import { AlreadyLoginGuard } from './core/services/already-login.guard';
import { SalesComponent } from './features/sales/sales.component';
import { AddSaleComponent } from './features/sales/add-sale/add-sale.component';
import { AddUserComponent } from './features/user-list/add-user/add-user.component';
import { UserListComponent } from './features/user-list/user-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login',pathMatch: 'full' },
  { path: 'login', component: LoginComponent,canActivate: [AlreadyLoginGuard]},
  { path: 'register', component: RegisterUserComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/add', component: AddUserComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'sales/add', component: AddSaleComponent },
  { 
    path: 'products', 
    loadChildren: () => import('./features/product/products.module').then(m => m.ProductsModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders', 
    loadChildren: () => import('./features/order/orders.module').then(m => m.OrdersModule), 
    canActivate: [AuthGuard] 
  },

  // Default route - Redirect to login if the user is not authenticated
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Wildcard route for a 404 page (page not found)
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
