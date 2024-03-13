import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from './notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  notification$ = new Subject<Notification>();
 
}