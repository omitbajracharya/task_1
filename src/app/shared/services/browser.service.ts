import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  public isBrowser(): boolean {
      return isPlatformBrowser(this.platformId);
    }
}
