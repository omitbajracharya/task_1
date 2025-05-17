import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Sale } from '../../shared/models/sale.model';
import { Item } from '../../shared/models/item.model';
// import { Item } from './item.model';
// import { Sale } from './sale.model';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private itemKey = 'sales_items';
  private saleKey = 'sales_history';

  private simulateDelay<T>(data: T): Observable<T> {
    const delayMs = Math.floor(Math.random() * 2000) + 500;
    return of(data).pipe(delay(delayMs));
  }

  private getItems(): Item[] {
    return JSON.parse(localStorage.getItem(this.itemKey) || '[]');
  }

  private setItems(items: Item[]) {
    localStorage.setItem(this.itemKey, JSON.stringify(items));
  }

  private getSales(): Sale[] {
    return JSON.parse(localStorage.getItem(this.saleKey) || '[]');
  }

  private setSales(sales: Sale[]) {
    localStorage.setItem(this.saleKey, JSON.stringify(sales));
  }

  getItemsObservable(): Observable<Item[]> {
    return this.simulateDelay(this.getItems());
  }

  getSalesHistory(): Observable<Sale[]> {
    return this.simulateDelay(this.getSales());
  }

  sellItem(itemId: number, quantity: number): Observable<Item[]> {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    const sales = this.getSales();

    if (!item) {
      throw new Error('Item not found');
    }

    if (item.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    item.stock -= quantity;
    item.sold += quantity;

    const total = quantity * 100; // Assume unit price = 100 (can be dynamic)
    const sale = new Sale(
      sales.length + 1,
      itemId,
      quantity,
      total,
      new Date().toISOString()
    );

    sales.push(sale);

    this.setSales(sales);
    this.setItems(items);

    return this.simulateDelay(items);
  }

  restockItem(itemId: number, quantity: number): Observable<Item[]> {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    item.stock += quantity;

    this.setItems(items);
    return this.simulateDelay(items);
  }

  searchItems(term: string): Observable<Item[]> {
    const items = this.getItems();
    const filtered = items.filter(i =>
      i.name.toLowerCase().includes(term.toLowerCase())
    );
    return this.simulateDelay(filtered);
  }

  seedData() {
    const items: Item[] = [
      new Item(1, 'Mouse','High performance laptop', 10, 0),
      new Item(2, 'Keyboard','Good', 5, 0),
      new Item(3, 'Monitor','Better', 2, 0),
    ];
    this.setItems(items);
    this.setSales([]);
  }
}
