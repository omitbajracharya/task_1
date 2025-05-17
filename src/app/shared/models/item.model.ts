export class Item {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sold: number;

  constructor(id: number, name: string, description: string, price: number, stock: number,sold: number = 0) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.sold = sold;
  }
}
