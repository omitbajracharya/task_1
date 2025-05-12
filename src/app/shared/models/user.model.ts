export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public roleId: number,
    public isActive: boolean = true,
  ) {}
}
