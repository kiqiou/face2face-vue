import { Product } from './product.js';

export type PaymentMethod = 'cash' | 'card';
export type OrderStatus = 'new' | 'confirmed' | 'done' | 'cancelled';

export class OrderItem {
  id: number = 0;
  product: Product;
  quantity: number = 1;
  priceAtOrder: number = 0;

  constructor(id: number = 0, product: Product, quantity: number = 1, priceAtOrder: number = 0) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.priceAtOrder = priceAtOrder;
  }
}

export class Order {
  id: number = 0;
  name: string = '';
  phone: string = '';
  paymentMethod: PaymentMethod = 'cash';
  comment: string = '';
  status: OrderStatus = 'new';
  createdAt: string = '';
  items: OrderItem[] = [];

  constructor(
    id: number = 0,
    name: string = '',
    phone: string = '',
    paymentMethod: PaymentMethod = 'cash',
    comment: string = '',
    status: OrderStatus = 'new',
    createdAt: string = '',
    items: OrderItem[] = []
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.paymentMethod = paymentMethod;
    this.comment = comment;
    this.status = status;
    this.createdAt = createdAt;
    this.items = items;
  }
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  done: 'Выполнен',
  cancelled: 'Отменён',
};