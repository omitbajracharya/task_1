import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { ApiService } from '../../shared/services/api.service';
// import { User } from '../../models/user.model';
// import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['2', Validators.required] // 1 = Admin, 2 = User
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, password, role } = this.registerForm.value;

    this.api.getUsers().subscribe((users: User[]) => {
      const userExists = users.some(u => u.username === username);

      if (userExists) {
        this.errorMessage = 'Username already exists.';
        this.isLoading = false;
        return;
      }

      const newUser: Omit<User, 'id'> = { username, password, role: parseInt(role, 10) };

      this.api.createUser(newUser).subscribe(() => {
        this.successMessage = 'Registration successful!';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      });
    });
  }
}
