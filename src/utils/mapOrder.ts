import { Order, OrderItem } from '../models/order.js';
import { User } from '../models/user.js';
import { mapProduct } from './mapProduct.js';

export function mapOrder(item: any): Order {
  const items: OrderItem[] = (item.items ?? []).map(
    (oi: any) => new OrderItem(oi.id, mapProduct(oi.product), oi.quantity, oi.price_at_order)
  );

  return new Order(
    item.id,
    new User(
      item.user.id,
      item.user.username,
      item.user.phone,
      item.user.role
    ),
    item.payment_method,
    item.approvement_method,
    item.comment,
    item.status,
    item.created_at,
    items
  );
}