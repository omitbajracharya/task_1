import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ValidationMessageDirective } from './validations/validation-message.directive';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [
        ValidationMessageDirective,
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
    ],
})
export class SharedModule {
}
