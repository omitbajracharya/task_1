import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    // Simulated login
    setTimeout(() => {
      const { username, password } = this.loginForm.value;
      if (username === 'admin' && password === 'admin') {
        this.errorMessage = '';
        alert('Login success');
      } else {
        this.errorMessage = 'Invalid credentials';
      }
      this.isLoading = false;
    }, 1000);
  }
}
