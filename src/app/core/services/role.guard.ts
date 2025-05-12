// guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../../shared/models/role.model';
import { AuthService } from '../../shared/services/auth.service';
// import { AuthService } from '../services/auth.service';
// import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requiredRoles = next.data['roles'] as Role[];
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRole = this.authService.currentUserValue?.roleId;
    if (userRole !== undefined && requiredRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have required role - redirect to dashboard or login
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }
    return false;
  }
}
