import { Role } from "./role.model";

export interface MenuItem {
    label: string;
    iconUrl?: string;    
    route?: string;
    icon?: string;
    roles: string[];
    children?: MenuItem[];
  }