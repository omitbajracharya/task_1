import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Role } from '../../shared/models/role.model';  // Import Role enum

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  adminMenuItems = [
    { label: 'User Management', icon: 'fas fa-users', link: '/users' },
    { label: 'Role Management', icon: 'fas fa-user-tag', link: '/roles' },
    { label: 'System Settings', icon: 'fas fa-cogs', link: '/settings' },
  ];

  constructor(public authService: AuthService) {}

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  // Getters to check if the user has specific roles using AuthService
  get isAdmin() {
    return this.authService.hasRole(Role.Admin);  // Use Role enum here (numeric value 1)
  }

  get isSupervisor() {
    return this.authService.hasRole(Role.Supervisor);  // Use Role enum here (numeric value 2)
  }

  get isSalesPerson() {
    return this.authService.hasRole(Role.SalesPerson);  // Use Role enum here (numeric value 3)
  }
}
