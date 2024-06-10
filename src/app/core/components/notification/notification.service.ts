import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from './notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    notification$ = new Subject<Notification>();
}
