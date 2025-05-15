// app.component.ts
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isSidebarCollapsed = false;
  constructor(private router: Router) {}
  @ViewChild('sidebar') sidebarComponent?: SidebarComponent;


  toggleSidebarIfVisible(): void {
    if (!this.hideSidebar() && this.sidebarComponent) {
      this.sidebarComponent.toggleCollapse();
    }
  }

  hideBreadcrumb(): boolean {
    const hiddenRoutes = ['/login', '/register', '/forgot-password'];
    return hiddenRoutes.includes(this.router.url);
  }

  hideHeader(): boolean {
    const hiddenRoutes = ['/login', '/register', '/forgot-password'];
    return hiddenRoutes.includes(this.router.url);
  }

  hideSidebar(): boolean {
    const hiddenRoutes = ['/login', '/register', '/forgot-password'];
    return hiddenRoutes.includes(this.router.url);
  }

  hideFooter(): boolean {
    const hiddenRoutes = ['/login', '/register', '/forgot-password'];
    return hiddenRoutes.includes(this.router.url);
  }
}
