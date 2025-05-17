// app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  isSidebarCollapsed = false;
  constructor(private router: Router) {}
  @ViewChild('sidebar') sidebarComponent?: SidebarComponent;
  
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll
      });
  }

  toggleSidebarIfVisible(): void {
    if (!this.hideSidebar() && this.sidebarComponent) {
      // this.sidebarComponent.toggleCollapse();
    }
  }

  hideBreadcrumb(): boolean {
    const hiddenRoutes = ['/login', '/register', '/forgot-password','/home'];
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
