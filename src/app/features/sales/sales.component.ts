import { Component, OnInit } from '@angular/core';
import { SalesService } from './sales.service';
import { Item } from '../../shared/models/item.model';
import { Sale } from '../../shared/models/sale.model';
// import { Item } from './item.model';
// import { Sale } from './sale.model';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})

export class SalesComponent implements OnInit {
  items: Item[] = [];
  salesHistory: Sale[] = [];
  searchTerm = '';
  loading = false;

  // For inputs: track sell/restock quantities
  sellQuantities: { [itemId: number]: number } = {};
  restockQuantities: { [itemId: number]: number } = {};

  constructor(private salesService: SalesService) {}

  ngOnInit() {
    this.salesService.seedData();
    this.loadItems();
    this.loadSalesHistory();
  }

  loadItems() {
    this.loading = true;
    this.salesService.getItemsObservable().subscribe((data) => {
      this.items = data;
      this.loading = false;
    });
  }

  loadSalesHistory() {
    this.salesService.getSalesHistory().subscribe((data) => {
      this.salesHistory = data;
    });
  }

  sellItem(itemId: number) {
    const qty = this.sellQuantities[itemId] || 1;
    if (qty <= 0) return alert('Quantity must be positive');

    this.loading = true;
    try {
      this.salesService.sellItem(itemId, qty).subscribe((data) => {
        this.items = data;
        this.loadSalesHistory();
        this.sellQuantities[itemId] = 0;
        this.loading = false;
      });
    } catch (error: any) {
      alert(error.message);
      this.loading = false;
    }
  }

  restockItem(itemId: number) {
    const qty = this.restockQuantities[itemId] || 1;
    if (qty <= 0) return alert('Quantity must be positive');

    this.loading = true;
    this.salesService.restockItem(itemId, qty).subscribe((data) => {
      this.items = data;
      this.restockQuantities[itemId] = 0;
      this.loading = false;
    });
  }

  searchItems() {
    if (!this.searchTerm) {
      this.loadItems();
      return;
    }
    this.loading = true;
    this.salesService.searchItems(this.searchTerm).subscribe((data) => {
      this.items = data;
      this.loading = false;
    });
  }
}
