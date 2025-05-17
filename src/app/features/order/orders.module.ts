import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OrdersComponent } from './orders/orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OrdersModule {}
