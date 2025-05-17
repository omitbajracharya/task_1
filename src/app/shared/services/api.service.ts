import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, delay, throwError, map } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Item } from '../models/item.model';
import { Sale } from '../models/sale.model';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product.model';

interface RoleData {
  id: Role;
  name: string;
  permissions: string[];
}

interface DashboardStats {
  totalSales: number;
  todaySales: number;
  popularItem: (Item & { salesCount: number }) | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly PRODUCT_STORAGE_KEY = 'products';
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (this.isBrowser()) {
      this.initializeData();
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Simulate network delay
  private getRandomDelay(): number {
    return Math.floor(Math.random() * 2000) + 500; // 500-2500ms delay
  }

  // Initialize sample data if not exists
  private initializeData(): void {
    if (this.isBrowser()) {
      if (!localStorage.getItem('users')) {
        const users: User[] = [
          new User(1, 'admin', 'admin123', Role.Admin),
          new User(2, 'supervisor', 'super123', Role.Supervisor),
          new User(3, 'sales', 'sales123', Role.SalesPerson),
        ];
        localStorage.setItem('users', JSON.stringify(users));
      }

      if (!localStorage.getItem('roles')) {
        const roles: RoleData[] = [
          { id: Role.Admin, name: 'Admin', permissions: ['all'] },
          {
            id: Role.Supervisor,
            name: 'Supervisor',
            permissions: ['dashboard', 'items'],
          },
          {
            id: Role.SalesPerson,
            name: 'Sales Person',
            permissions: ['sales'],
          },
        ];
        localStorage.setItem('roles', JSON.stringify(roles));
      }

      if (!localStorage.getItem('items')) {
        const items: Item[] = [
          new Item(1, 'Laptop', 'High performance laptop', 999.99, 50),
          new Item(2, 'Phone', 'Smartphone', 699.99, 100),
          new Item(3, 'Tablet', 'Portable tablet', 399.99, 75),
        ];
        localStorage.setItem('items', JSON.stringify(items));
      }

      if (!localStorage.getItem('sales')) {
        localStorage.setItem('sales', JSON.stringify([] as Sale[]));
      }
    }
  }

  // User CRUD
  getUsers(): Observable<User[]> {
    if (this.isBrowser()) {
      debugger;
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      return of(users).pipe(delay(this.getRandomDelay()));
    }
    return of([]);
  }

  createUser(user: Omit<User, 'id'>): Observable<User | []> {
    if (this.isBrowser()) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser: User = {
        ...user,
        id: this.generateId(users),
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return of(newUser).pipe(delay(this.getRandomDelay()));
    }
    return of([]);
  }

  updateUser(updatedUser: User): Observable<User | []> {
    if (this.isBrowser()) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex((u: User) => u.id === updatedUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      return of(updatedUser).pipe(delay(this.getRandomDelay()));
    }
    return of([]);
  }

  deleteUser(id: number): Observable<boolean> {
    if (this.isBrowser()) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const filtered = users.filter((u: User) => u.id !== id);
      localStorage.setItem('users', JSON.stringify(filtered));
      return of(true).pipe(delay(this.getRandomDelay()));
    }
    return of(false).pipe(delay(this.getRandomDelay()));
  }

  // Role CRUD
  getRoles(): Observable<RoleData[]> {
    if (this.isBrowser()) {
      const roles: RoleData[] = JSON.parse(localStorage.getItem('roles') || '[]');
      return of(roles).pipe(delay(this.getRandomDelay()));
    }
    return of([]);
  }

  // Item CRUD
  getItems(): Observable<Item[]> {
    if (this.isBrowser()) {
      const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
      return of(items).pipe(delay(this.getRandomDelay()));
    }
    return of([]);
  }

  createItem(item: Omit<Item, 'id'>): Observable<Item | {}> {
    if (this.isBrowser()) {
      const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
      const newItem: Item = {
        ...item,
        id: this.generateId(items),
      };
      items.push(newItem);
      localStorage.setItem('items', JSON.stringify(items));
      return of(newItem).pipe(delay(this.getRandomDelay()));
    }
    return of({});
  }

  updateItem(updatedItem: Item): Observable<Item | {}> {
    if (this.isBrowser()) {
      const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
      const index = items.findIndex((i: Item) => i.id === updatedItem.id);
      if (index !== -1) {
        items[index] = updatedItem;
        localStorage.setItem('items', JSON.stringify(items));
      }
      return of(updatedItem).pipe(delay(this.getRandomDelay()));
    }
    return of({});
  }

  deleteItem(id: number): Observable<boolean> {
    if (this.isBrowser()) {
      const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
      const filtered = items.filter((i: Item) => i.id !== id);
      localStorage.setItem('items', JSON.stringify(filtered));
      return of(true).pipe(delay(this.getRandomDelay()));
    }
    return of(false);
  }

  // Sales Operations
  getSales(): Observable<Sale[]> {
    if (this.isBrowser()) {
      const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
      return of(sales).pipe(delay(this.getRandomDelay()));
    }
    return of([]);
  }

  createSale(sale: Omit<Sale, 'id'>): Observable<Sale | {}> {
    if (this.isBrowser()) {
      const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
      const newSale: Sale = {
        ...sale,
        id: this.generateId(sales),
        date: new Date().toISOString(),
      };
      sales.push(newSale);
      localStorage.setItem('sales', JSON.stringify(sales));

      // Update item stock
      const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');
      const item = items.find((i: Item) => i.id === sale.itemId);
      if (item) {
        item.stock -= sale.quantity;
        localStorage.setItem('items', JSON.stringify(items));
      }

      return of(newSale).pipe(delay(this.getRandomDelay()));
    }
    return of({});
  }

  // Dashboard Data
  getDashboardStats(): Observable<DashboardStats> {
    if (this.isBrowser()) {
      const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
      const items: Item[] = JSON.parse(localStorage.getItem('items') || '[]');

      const today = new Date().toISOString().split('T')[0];
      const todaySales = sales.filter(
        (s: Sale) => s.date.split('T')[0] === today,
      );

      const stats: DashboardStats = {
        totalSales: sales.reduce((sum: number, s: Sale) => sum + s.total, 0),
        todaySales: todaySales.reduce(
          (sum: number, s: Sale) => sum + s.total,
          0,
        ),
        popularItem: this.getMostPopularItem(items, sales),
      };

      return of(stats).pipe(delay(this.getRandomDelay()));
    }
    return of({
      totalSales: 1,
      todaySales: 1,
      popularItem: null,
    });
  }

  private getMostPopularItem(
    items: Item[],
    sales: Sale[],
  ): (Item & { salesCount: number }) | null {
    const itemSales = new Map<number, number>();
    sales.forEach((sale: Sale) => {
      itemSales.set(
        sale.itemId,
        (itemSales.get(sale.itemId) || 0) + sale.quantity,
      );
    });

    let popularItemId = -1;
    let maxSales = 0;

    itemSales.forEach((quantity: number, itemId: number) => {
      if (quantity > maxSales) {
        maxSales = quantity;
        popularItemId = itemId;
      }
    });

    const item = items.find((i: Item) => i.id === popularItemId);
    return item ? { ...item, salesCount: maxSales } : null;
  }

  private generateId(items: { id: number }[]): number {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    try {
      const productsJson = localStorage.getItem(this.PRODUCT_STORAGE_KEY);
      const products = productsJson ? JSON.parse(productsJson) : [];
      return of(products.map((p: any) => new Product(
        p.id,
        p.name,
        p.price,
        p.description,
        p.category,
        p.stock,
        p.imageUrl
      ))).pipe(delay(500)); // Simulate network delay
    } catch (error) {
      return throwError(() => new Error('Failed to load products'));
    }
  }

  // Get single product
  getProduct(id: number): Observable<Product> {
    return this.getProducts().pipe(
      map(products => {
        const product = products.find(p => p.id === id);
        if (!product) throw new Error('Product not found');
        return product;
      })
    );
  }
  // Create new product
  createProduct(product: Product): Observable<Product> {
    return this.getProducts().pipe(
      map(products => {
        // Generate new ID (max existing ID + 1)
        const newId = products.length > 0 
          ? Math.max(...products.map(p => p.id)) + 1 
          : 1;
        
        const newProduct = new Product(
          newId,
          product.name,
          product.price,
          product.description,
          product.category,
          product.stock,
          product.imageUrl
        );

        const updatedProducts = [...products, newProduct];
        localStorage.setItem(this.PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
        
        return newProduct;
      })
    );
  }

  // Update product
  updateProduct(product: Product): Observable<Product> {
    return this.getProducts().pipe(
      map(products => {
        const index = products.findIndex(p => p.id === product.id);
        if (index === -1) throw new Error('Product not found');

        const updatedProducts = [...products];
        updatedProducts[index] = product;
        localStorage.setItem(this.PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
        
        return product;
      })
    );
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.getProducts().pipe(
      map(products => {
        const updatedProducts = products.filter(p => p.id !== id);
        localStorage.setItem(this.PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
        return undefined;
      })
    );
  }
}
