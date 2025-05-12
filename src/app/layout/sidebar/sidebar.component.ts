import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  adminMenuItems = [
    { label: 'User Management', icon: 'fas fa-users', link: '/users' },
    { label: 'Role Management', icon: 'fas fa-user-tag', link: '/roles' },
    { label: 'System Settings', icon: 'fas fa-cogs', link: '/settings' },
  ];

  constructor(public authService: AuthService) {}

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isSupervisor() {
    return this.authService.isSupervisor();
  }

  get isSalesPerson() {
    return this.authService.isSalesPerson();
  }
}
