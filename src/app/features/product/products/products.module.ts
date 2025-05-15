import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ProductsComponent } from './products/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule {}
