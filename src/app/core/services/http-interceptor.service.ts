// http-interceptor.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!navigator.onLine) {
      // Store request locally for later processing
      // Example: localStorage.setItem('offline-request', JSON.stringify(request));
      // You can use IndexedDB or any other suitable storage mechanism
      // Inform the user that the request will be sent when online
      console.log('You are currently offline. Request will be sent when online.');
    }
    // Determine which API key to use based on your application logic
    let apiKey = '';
    // Example: Use apiKey1 for certain requests and apiKey2 for others
    if (req.url.includes('nasa')) {
      apiKey = environment.nasaKey;
    } else if (req.url.includes('azure')) {
      apiKey = environment.azureKey;
    } else {
      console.log('interceptor magic');
    }

    // Clone the request and add the appropriate API key to the headers
    const modifiedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return next.handle(modifiedReq);
  }
}
