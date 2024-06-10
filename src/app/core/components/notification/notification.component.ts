import { Component, OnInit, inject } from '@angular/core';
import { Notification } from './notification';
import {
  fadeAnimation,
  slideAnimation,
} from '../../../shared/animations/enterexit';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [fadeAnimation, slideAnimation],
})
export class NotificationComponent implements OnInit {
  notification!: Notification;
  notificationService = inject(NotificationService);
  showingNotification = false;

  ngOnInit(): void {
    console.log('notification component initialized');
    this.notificationService.notification$.subscribe({
      next: (notification: Notification) => {
        console.log('notification subscribed', notification);
        this.notification = notification;
        if (this.notification) this.showingNotification = true;
        setTimeout(() => {
          this.hideNotification();
        }, 3000);
      },
    });
  }
  hideNotification(): void {
    this.showingNotification = false;
  }
}
