import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { User } from '../../shared/models/user.model';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading = true;

  constructor(
    private api: ApiService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(term) ||
      user.id.toString().includes(term) ||
      this.getRoleName(user.role).toLowerCase().includes(term)
    );
  }

  getRoleName(roleId: number): string {
    switch(roleId) {
      case 1: return 'Admin';
      case 2: return 'User';
      case 3: return 'Manager';
      default: return 'Unknown';
    }
  }

  getRoleClass(roleId: number): string {
    switch(roleId) {
      case 1: return 'role-admin';
      case 2: return 'role-user';
      case 3: return 'role-manager';
      default: return '';
    }
  }

  editUser(userId: number): void {
    this.router.navigate(['/admin/users/edit', userId]);
  }

  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <strong>${user.username}</strong>?`,
      header: 'Confirm Deletion',
      icon: 'bi bi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(userId: number): void {
    this.api.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user', err);
      }
    });
  }
}