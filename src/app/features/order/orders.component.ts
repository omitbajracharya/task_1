import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../shared/models/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  showForm: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  selectedOrder: Order | null = null;
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      id: [null],
      customerName: ['', Validators.required],
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const ordersData = localStorage.getItem('orders');
    this.orders = ordersData ? JSON.parse(ordersData).map((o: any) => new Order(
      o.id,
      o.customerName,
      o.itemName,
      o.quantity,
      o.price,
      o.total,
      o.date
    )) : [];
    this.filteredOrders = [...this.orders];
  }

  filterOrders(): void {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order => 
      order.customerName.toLowerCase().includes(term) ||
      order.itemName.toLowerCase().includes(term) ||
      order.id.toString().includes(term)
    );
  }

  // openAddModal(): void {
  //   this.isEditMode = false;
  //   this.orderForm.reset({
  //     quantity: 1,
  //     price: 0,
  //     date: new Date().toISOString()
  //   });
  //   this.showForm = true;
  // }

  // openEditModal(order: Order): void {
  //   this.isEditMode = true;
  //   this.selectedOrder = order;
  //   this.orderForm.patchValue({
  //     ...order,
  //     total: order.calculateTotal()
  //   });
  //   this.showForm = true;
  // }

  // closeForm(): void {
  //   this.showForm = false;
  //   this.orderForm.reset();
  // }

  onSubmit(): void {
    if (this.orderForm.invalid) return;

    const formValue = this.orderForm.value;
    const orderData = new Order(
      formValue.id,
      formValue.customerName,
      formValue.itemName,
      formValue.quantity,
      formValue.price,
      formValue.quantity * formValue.price, // Calculate total
      formValue.date || new Date().toISOString()
    );

    let updatedOrders: Order[];
    if (this.isEditMode && formValue.id) {
      updatedOrders = this.orders.map(o => 
        o.id === formValue.id ? orderData : o
      );
    } else {
      const newId = this.orders.length > 0 
        ? Math.max(...this.orders.map(o => o.id)) + 1 
        : 1;
      orderData.id = newId;
      updatedOrders = [...this.orders, orderData];
    }

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    this.loadOrders();
    this.closeForm();
  }

  // confirmDelete(order: Order): void {
  //   this.selectedOrder = order;
  //   this.showDeleteModal = true;
  // }

  // deleteOrder(): void {
  //   if (!this.selectedOrder) return;

  //   const updatedOrders = this.orders.filter(o => o.id !== this.selectedOrder!.id);
  //   localStorage.setItem('orders', JSON.stringify(updatedOrders));
  //   this.loadOrders();
  //   this.showDeleteModal = false;
  // }









  openAddModal(): void {
    this.isEditMode = false;
    this.orderForm.reset({
      quantity: 1,
      price: 0,
      date: new Date().toISOString()
    });
    this.showForm = true;
  }
  
  openEditModal(order: Order): void {
    this.isEditMode = true;
    this.selectedOrder = order;
    this.orderForm.patchValue(order);
    this.showForm = true;
  }
  
  closeForm(): void {
    this.showForm = false;
    this.orderForm.reset();
  }
  
  confirmDelete(order: Order): void {
    this.selectedOrder = order;
    this.showDeleteModal = true;
  }
  
  deleteOrder(): void {
    if (!this.selectedOrder) return;
    this.orders = this.orders.filter(o => o.id !== this.selectedOrder!.id);
    localStorage.setItem('orders', JSON.stringify(this.orders));
    this.loadOrders();
    this.showDeleteModal = false;
  }
  
  
}