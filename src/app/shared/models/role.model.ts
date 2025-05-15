export enum Role {
  Admin = 1,
  Supervisor,
  SalesPerson
}

export interface RoleData {
  id: Role;
  name: string;
  permissions: string[];
}
