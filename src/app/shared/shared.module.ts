import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ValidationMessageDirective } from './validations/validation-message.directive';
import { SectionLayoutComponent } from '../layout-section/layout-section.component';
import { CommonModule } from '@angular/common';
import { TableDynamicComponent } from './components/table-dynamic/table-dynamic.component';
import { PrimengModule } from './primeng/primeng.module';
import { TableGenericComponent } from '../layout/table-generic/table-generic.component';
import { TruncatePipe } from './pipes/truncate.pipe';
@NgModule({
  declarations: [
    ValidationMessageDirective,
    SectionLayoutComponent,
    TableDynamicComponent,
    TableGenericComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PrimengModule,
  ],
  exports: [
    CommonModule,
    TableGenericComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TruncatePipe,
    ValidationMessageDirective,
    SectionLayoutComponent,
    TableDynamicComponent,
    PrimengModule,
  ],
})
export class SharedModule {}
