import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  userForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['2', Validators.required] // Default to User role
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, password, role } = this.userForm.value;

    this.api.getUsers().subscribe({
      next: (users: User[]) => {
        if (users.some(u => u.username === username)) {
          this.errorMessage = 'Username already exists';
          this.isLoading = false;
          return;
        }

        const newUser: Omit<User, 'id'> = { 
          username, 
          password, 
          role: parseInt(role, 10) 
        };

        this.api.createUser(newUser).subscribe({
          next: () => {
            this.successMessage = 'User created successfully!';
            this.isLoading = false;
            setTimeout(() => this.router.navigate(['/admin/users']), 1500);
          },
          error: (err) => {
            this.errorMessage = 'Error creating user';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Error checking users';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.userForm.reset({
      role: '2'
    });
  }
}