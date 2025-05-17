export class Order {
  constructor(
    public id: number = 0,
    public customerName: string = '',
    public itemName: string = '',
    public quantity: number = 0,
    public price: number = 0,
    public total: number = 0,
    public date: string = new Date().toISOString()
  ) {}

  // Calculate total automatically
  calculateTotal(): number {
    return this.quantity * this.price;
  }
}