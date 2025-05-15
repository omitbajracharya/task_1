import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Role } from '../../shared/models/role.model';  // Import Role enum

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  currentUser: any;
  isCollapsed = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get the current user info when component is initialized
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  // Method to toggle sidebar collapse state
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  // Getters to check if the user has specific roles using AuthService
  get isAdmin() {
    return this.authService.hasRole(Role.Admin);  // Use Role enum (numeric value 1)
  }

  get isSupervisor() {
    return this.authService.hasRole(Role.Supervisor);  // Use Role enum (numeric value 2)
  }

  get isSalesPerson() {
    return this.authService.hasRole(Role.SalesPerson);  // Use Role enum (numeric value 3)
  }

  // Logout method to clear session and redirect to login
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);  // Navigate to the login page after logout
  }

  // Method to toggle collapse state of the header
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
