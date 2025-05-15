import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { LoginComponent } from './features/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'products', 
    loadChildren: () => import('./features/product/products/products.module').then(m => m.ProductsModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders', 
    loadChildren: () => import('./features/order/orders/orders.module').then(m => m.OrdersModule), 
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
