import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Sale {
  id: number;
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
}

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent implements OnInit {
  saleForm!: FormGroup;
  customers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Acme Corp' }
  ];
  
  products = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
    { id: 3, name: 'Product C', price: 150 }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.setupFormListeners();
  }

  initForm() {
    this.saleForm = this.fb.group({
      customer: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [0, [Validators.required, Validators.min(0)]]
    });
  }

  setupFormListeners() {
    this.saleForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
    
    this.saleForm.get('price')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  onProductSelect(event: any) {
    const productId = event.target.value;
    const selectedProduct = this.products.find(p => p.id == productId);
    
    if (selectedProduct) {
      this.saleForm.patchValue({
        price: selectedProduct.price
      });
    }
  }

  calculateTotal() {
    const quantity = this.saleForm.get('quantity')?.value || 0;
    const price = this.saleForm.get('price')?.value || 0;
    const total = quantity * price;
    
    this.saleForm.patchValue({
      total: total
    }, { emitEvent: false });
  }

  onSubmit() {
    if (this.saleForm.valid) {
      const formValue = this.saleForm.value;
      const customer = this.customers.find(c => c.id == formValue.customer);
      const product = this.products.find(p => p.id == formValue.product);

      const saleData: Sale = {
        id: Date.now(), // Unique ID
        customerId: formValue.customer,
        customerName: customer?.name || 'Unknown',
        productId: formValue.product,
        productName: product?.name || 'Unknown',
        quantity: formValue.quantity,
        price: formValue.price,
        total: formValue.total,
        date: new Date().toISOString()
      };

      this.saveSale(saleData);
      this.resetForm();
    }
  }

  saveSale(sale: Sale) {
    // Get existing sales
    const sales = this.getSales();
    
    // Add new sale
    sales.push(sale);
    
    // Save to localStorage
    localStorage.setItem('sales', JSON.stringify(sales));
    
    // Show success message
    alert(`Sale recorded successfully!\nTotal: Rs. ${sale.total}`);
  }

  getSales(): Sale[] {
    const salesData = localStorage.getItem('sales');
    return salesData ? JSON.parse(salesData) : [];
  }

  resetForm() {
    this.saleForm.reset({
      quantity: 1,
      price: 0,
      total: 0
    });
  }
}