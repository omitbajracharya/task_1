import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private jwtHelper = new JwtHelperService();

  // BehaviorSubject to hold current user data
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  login(username: string, password: string): Observable<boolean> {
    return this.api.getUsers().pipe(
      map((users:any) => {
        const user = users.find((u:any) => 
          u.username === username && 
          u.password === password
        );
        
        if (user) {
          const mockToken = this.generateMockToken(user);
          localStorage.setItem(this.TOKEN_KEY, mockToken);
          this.currentUserSubject.next(user);  // Set the logged-in user
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);  // Clear the current user on logout
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getCurrentUserRole(): Role | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.role || null;
    } catch {
      return null;
    }
  }

  hasRole(requiredRole: Role): boolean {
    return this.getCurrentUserRole() === requiredRole;
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    return `${header}.${payload}.mock-signature`;
  }
}
