import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService 
  ) {
    this.loginForm = this.fb.group({
      username: ['omit.com.np', Validators.required],
      password: ['Admin@123', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe(success => {
      this.isLoading = false;

      if (success) {
        this.errorMessage = '';

        // Navigate based on role
        const role = this.authService.getRole();
        switch (role) {
          case 1: // Admin
            this.router.navigate(['/users']);
            break;
          case 2: // Supervisor
            this.router.navigate(['/inventory']);
            break;
          case 3: // SalesPerson
            this.router.navigate(['/sales']);
            break;
          default:
            this.router.navigate(['/home']);
        }
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
