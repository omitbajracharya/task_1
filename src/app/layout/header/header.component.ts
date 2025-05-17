import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Role } from '../../shared/models/role.model';  // Import Role enum
import { BrowserService } from '../../shared/services/browser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  currentUser: any;
  isCollapsed = true;
  // @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  isDropdownOpen = false;
  isHoveringDropdown = false;
  hoverTimeout: any;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private browser: BrowserService,
    private elementRef: ElementRef
    // public translate: TranslateService,

  ) {
    this.setupMobileDropdown();
  }

  
  private setupMobileDropdown() {
    if ('ontouchstart' in window) {
      const dropdowns = this.elementRef.nativeElement.querySelectorAll('.nav-item.dropdown');
      dropdowns.forEach((dropdown: HTMLElement) => {
        dropdown.addEventListener('click', (event) => {
          event.preventDefault();
          const menu = dropdown.querySelector('.dropdown-menu');
          if (menu) {
            menu.classList.toggle('show');
          }
        });
      });
    }
  }

  // Open dropdown on button hover
  onButtonHover() {
    clearTimeout(this.hoverTimeout);
    this.isDropdownOpen = true;
  }

  // Close dropdown after delay when leaving button (unless hovering dropdown)
  onButtonLeave() {
    this.hoverTimeout = setTimeout(() => {
      if (!this.isHoveringDropdown) {
        this.isDropdownOpen = false;
      }
    }, 200); // 200ms delay
  }

  // Keep dropdown open when hovering it
  onDropdownEnter() {
    clearTimeout(this.hoverTimeout);
    this.isHoveringDropdown = true;
    this.isDropdownOpen = true;
  }

  // Close dropdown when leaving it
  onDropdownLeave() {
    this.isHoveringDropdown = false;
    this.isDropdownOpen = false;
  }

  // Close when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
  ngOnInit() {
    // Get the current user info when component is initialized
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  // Method to toggle sidebar collapse state
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  // Getters to check if the user has specific roles using AuthService
  get isAdmin() {
    return this.authService.hasRole(Role.Admin);  // Use Role enum (numeric value 1)
  }

  get isSupervisor() {
    return this.authService.hasRole(Role.Supervisor);  // Use Role enum (numeric value 2)
  }

  get isSalesPerson() {
    return this.authService.hasRole(Role.SalesPerson);  // Use Role enum (numeric value 3)
  }

  // Logout method to clear session and redirect to login
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);  // Navigate to the login page after logout
  }

  Switchlanguage(): void {
    let _lang = localStorage.getItem("lang");
    if (_lang == "eng") {
      // this.translate.use("nep");
      localStorage.setItem("lang", "nep");
    } else {
      // this.translate.use("eng");
      localStorage.setItem("lang", "eng");
    }
  }

  getRole() {
    this.authService.getCurrentUserRole();
  }

  // Method to toggle collapse state of the header
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
