import { Component } from '@angular/core';
import { faChevronLeft, faChevronRight, faAngleDown, faAngleUp, faCaretRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faCaretRight = faCaretRight;
  faSignOutAlt = faSignOutAlt;

  userRole = 'admin';
  isSidebarCollapsed = false;
  expandedMenus: { [key: number]: boolean } = {};

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'house',
      route: '/dashboard',
      roles: ['admin', 'user']
    },
    {
      label: 'User',
      icon: 'users-gear',
      roles: ['admin'],
      children: [
        { label: 'Add User', route: '/users/add', icon: 'user-plus', roles: ['admin'] },
        { label: 'View Users', route: '/users', icon: 'address-book', roles: ['admin'] }
      ]
    },
    {
      label: 'Product',
      icon: 'users-gear',
      roles: ['admin'],
      children: [
        { label: 'View Products', route: '/products', icon: 'address-book', roles: ['admin'] },
        { label: 'Add Product', route: '/products/add', icon: 'user-plus', roles: ['admin'] },
        { label: 'Edit Product', route: '/products/edit', icon: 'address-book', roles: ['admin'] }
      ]
    },
    {
      label: 'Order',
      icon: 'users-gear',
      roles: ['admin'],
      children: [
        { label: 'View Orders', route: '/orders', icon: 'address-book', roles: ['admin'] },
        { label: 'Add Order', route: '/orders/add', icon: 'user-plus', roles: ['admin'] },
        { label: 'Edit Order', route: '/orders/edit', icon: 'address-book', roles: ['admin'] }
      ]
    },
    {
      label: 'Sales',
      icon: 'cart-shopping',
      roles: ['admin', 'sales'],
      children: [
        { label: 'Add Sale', route: '/sales/add', icon: 'cart-plus', roles: ['admin', 'sales'] },
        { label: 'View Sales', route: '/sales', icon: 'file-invoice-dollar', roles: ['admin', 'sales'] }
      ]
    }
  ];
  
  

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (this.isSidebarCollapsed) {
      this.expandedMenus = {}; // Reset submenu states
    }
  }
  
  

  toggleMenu(index: number): void {
    // First, collapse all other menus
    Object.keys(this.expandedMenus).forEach(key => {
      if (Number(key) !== index) {
        this.expandedMenus[Number(key)] = false;
      }
    });
    
    // Then toggle the current menu
    this.expandedMenus[index] = !this.expandedMenus[index];
  }

  isVisible(item: MenuItem): boolean {
    return item.roles.includes(this.userRole);
  }

  trackByFn(index: number, item: MenuItem): string {
    return item.label;
  }

  logout() {
    console.log('Logout');
  }
}

