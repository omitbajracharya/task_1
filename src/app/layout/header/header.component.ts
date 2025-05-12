import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
  currentUser: any;
  isCollapsed = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isSupervisor() {
    return this.authService.isSupervisor();
  }

  get isSalesPerson() {
    return this.authService.isSalesPerson();
  }

  logout() {
    this.authService.logout();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
