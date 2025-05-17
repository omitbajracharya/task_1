import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../shared/models/order.model';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  order: Partial<Order> = {};
  isEdit = false;
  editId: number | null = null;

  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.router.url.includes('edit') && idParam) {
      this.editId = +idParam;
      const found = this.orders.find(o => o.id === this.editId);
      if (found) {
        this.order = { ...found };
        this.isEdit = true;
      }
    }
  }

  loadOrders(): void {
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
  }

  save(): void {
    if (!this.order.customerName || !this.order.itemName || !this.order.quantity || !this.order.price) return;
    const total = (this.order.quantity! * this.order.price!);
    const now = new Date().toISOString();
    const orders = [...this.orders];

    if (this.isEdit && this.editId !== null) {
      const idx = orders.findIndex(o => o.id === this.editId);
      if (idx !== -1) {
        orders[idx] = { ...this.order, id: this.editId, total, date: now } as Order;
      }
    } else {
      const id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
      orders.push({ ...this.order, id, total, date: now } as Order);
    }

    localStorage.setItem('orders', JSON.stringify(orders));
    this.router.navigate(['/orders']);
  }

  delete(id: number): void {
    if (confirm('Delete this order?')) {
      const updated = this.orders.filter(o => o.id !== id);
      localStorage.setItem('orders', JSON.stringify(updated));
      this.loadOrders();
    }
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}
