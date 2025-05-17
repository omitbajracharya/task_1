export class Product {
    constructor(
      public id: number = 0,
      public name: string = '',
      public price: number = 0,
      public description: string = '',
      public category: string = 'General',
      public stock: number = 0,
      public imageUrl: string = 'assets/default-product.png'
    ) {}
  
    // Example method
    get formattedPrice(): string {
      return `$${this.price.toFixed(2)}`;
    }
  }