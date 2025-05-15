// dashboard.model.ts
import { Item } from './item.model';  

export interface DashboardStats {
  totalSales: number;  // Total sales value, e.g., cumulative sales
  todaySales: number;  // Sales for today
  popularItem: (Item & { salesCount: number }) | null; // Most popular item (includes sales count)
}
