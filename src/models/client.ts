// models/client.ts
export class Client {
  id: number = 0;
  username: string = '';
  phone: string = '';
  totalSpent: number = 0;
  ordersCount: number = 0;
  manualDiscountPercent: number | null = null;
  currentDiscountPercent: number = 0;

  constructor(
    id: number = 0, username: string = '', phone: string = '',
    totalSpent: number = 0, ordersCount: number = 0,
    manualDiscountPercent: number | null = null, currentDiscountPercent: number = 0
  ) {
    this.id = id;
    this.username = username;
    this.phone = phone;
    this.totalSpent = totalSpent;
    this.ordersCount = ordersCount;
    this.manualDiscountPercent = manualDiscountPercent;
    this.currentDiscountPercent = currentDiscountPercent;
  }
}