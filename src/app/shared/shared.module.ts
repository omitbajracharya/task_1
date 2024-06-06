import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ValidationMessageDirective } from './validations/validation-message.directive';
import { SectionLayoutComponent } from '../layout-section/layout-section.component';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [
        ValidationMessageDirective,
        SectionLayoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ValidationMessageDirective,
        SectionLayoutComponent
    ],
})

