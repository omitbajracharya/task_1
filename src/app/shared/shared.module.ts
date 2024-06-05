import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionLayoutComponent } from '../layout-section/layout-section.component';

@NgModule({
  declarations: [
    SectionLayoutComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SectionLayoutComponent]
})
export class SharedModule { }
