import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  returnUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Get return URL from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login() {
    this.error = '';
    this.authService
      .login(this.username, this.password)
      .subscribe((success) => {
        if (success) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.error = 'Invalid username or password';
        }
      });
  }
}
