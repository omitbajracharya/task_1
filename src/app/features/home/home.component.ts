import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { DashboardStats } from '../../shared/models/dashboard.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  dashboardStats: DashboardStats | null = null;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.apiService.getDashboardStats().subscribe(
      (stats: DashboardStats) => {
        this.dashboardStats = stats;
      },
      (error) => {
        console.error('Error loading dashboard stats', error);
      }
    );
  }
}