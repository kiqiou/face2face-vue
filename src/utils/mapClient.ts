// mappers/mapClient.ts
import { Client } from '../models/client.js';

export function mapClient(item: any): Client {
  return new Client(
    item.id, item.username, item.phone,
    Number(item.total_spent), item.orders_count,
    item.manual_discount_percent, item.current_discount_percent
  );
}