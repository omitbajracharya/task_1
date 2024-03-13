import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a404-page',
  templateUrl: './a404-page.component.html',
  styleUrls: ['./a404-page.component.scss']
})
export class A404PageComponent {
  constructor(private router: Router) { }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
