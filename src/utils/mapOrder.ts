import { Order, OrderItem } from '../models/order.js';
import { mapProduct } from './mapProduct.js';

export function mapOrder(item: any): Order {
  const items: OrderItem[] = (item.items ?? []).map(
    (oi: any) => new OrderItem(oi.id, mapProduct(oi.product), oi.quantity, oi.price_at_order)
  );

  return new Order(
    item.id,
    item.name,
    item.phone,
    item.payment_method,
    item.comment,
    item.status,
    item.created_at,
    items
  );
}