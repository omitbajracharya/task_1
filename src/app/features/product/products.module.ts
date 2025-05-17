import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ProductsComponent } from './products/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ProductsModule {}
