export class Sale {
  id: number;
  itemId: number;
  quantity: number;
  total: number;
  date: string;

  constructor(id: number, itemId: number, quantity: number, total: number, date: string) {
    this.id = id;
    this.itemId = itemId;
    this.quantity = quantity;
    this.total = total;
    this.date = date;
  }
}
