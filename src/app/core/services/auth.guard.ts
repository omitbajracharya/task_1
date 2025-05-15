import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in (by verifying if a token exists in localStorage)
    const isLoggedIn = localStorage.getItem('auth_token') !== null;

    if (isLoggedIn) {
      return true;
    } else {
      // If not logged in, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
  