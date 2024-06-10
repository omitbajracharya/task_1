import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/components/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  notificationService = inject(NotificationService);
  private router = inject(Router);
  notify() {
    this.notificationService.notification$.next({
      title: 'Title',
      body: 'Lorem ipsum dolor sit amet, consectetur adip',
      color: 'danger',
    });
  }
  openProducts() {
    this.router.navigate(['/product']);
  }
  openOrders() {
    this.router.navigate(['/order']);
  }
}
