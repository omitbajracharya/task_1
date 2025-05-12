import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> =
    this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    // Initialize with user from localStorage if available

    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<User | null>(
        storedUser ? JSON.parse(storedUser) : null,
      );
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable((observer) => {
      this.api.getUsers().subscribe((users) => {
        const user = users.find(
          (u) =>
            u.username === username && u.password === password && u.isActive,
        );

        if (user) {
          // Store user details in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      });
    });
  }

  logout(): void {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: Role): boolean {
    const user = this.currentUserValue;
    return user?.roleId === role;
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  // Helper methods for specific roles
  isAdmin(): boolean {
    return this.hasRole(Role.Admin);
  }

  isSupervisor(): boolean {
    return this.hasRole(Role.Supervisor);
  }

  isSalesPerson(): boolean {
    return this.hasRole(Role.SalesPerson);
  }
}
