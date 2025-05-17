import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nonZero } from '../../shared/validations/custom.validator';
import { ApiService } from '../../shared/services/api.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  selectedProduct: Product | null = null;
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProducts();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: ['', [Validators.required, nonZero]],
      description: ['']
    });
  }

  loadProducts(): void {
    this.api.getProducts().subscribe({
      next: (products:any) => {
        this.products = products;
        this.filteredProducts = [...products];
      },
      error: (err:any) => {
        console.error('Error loading products', err);
      }
    });
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.id.toString().includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.productForm.patchValue(product);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.isEditMode) {
      this.api.updateProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err:any) => {
          console.error('Error updating product', err);
        }
      });
    } else {
      this.api.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating product', err);
        }
      });
    }
  }

  confirmDelete(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  deleteProduct(): void {
    if (!this.selectedProduct) return;

    this.api.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.loadProducts();
        this.showDeleteModal = false;
      },
      error: (err:any) => {
        console.error('Error deleting product', err);
      }
    });
  }
}