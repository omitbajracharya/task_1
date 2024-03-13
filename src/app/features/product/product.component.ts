import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nonZero } from '../../shared/validations/custom.validator';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, nonZero]],
      description: ['']
    });
  }

  onSubmit(ev: SubmitEvent): void {
    ev.preventDefault();
    if (this.productForm.valid) {
      // Process form submission here, e.g., send data to server
      console.log('Form submitted successfully!', this.productForm.value);
    } else {
      // Handle invalid form submission, if needed
      console.error('Form submission failed. Please check the form for errors.');
    }
  }
}
