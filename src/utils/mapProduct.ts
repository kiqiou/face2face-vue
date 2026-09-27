import { Product } from '../models/product.js';
import { Manufacturer } from '../models/manufacturer.js';
import { SkinType } from '../models/skinType.js';
import { ProductPurpose } from '../models/productPurpose.js';
import { Collection } from '../models/collection.js';
import { ProductMedia } from '../models/productMedia.js';

export function mapProduct(item: any): Product {
  const manufacturer = new Manufacturer(
    item.manufacturer.id,
    item.manufacturer.name,
    item.manufacturer.address ?? '',
    item.manufacturer.country ?? ''
  );

  const skinTypes = (item.skin_types ?? []).map(
    (st: any) => new SkinType(st.id, st.name, st.description)
  );
  const purposes = (item.purposes ?? []).map(
    (p: any) => new ProductPurpose(p.id, p.name)
  );
  const collections = (item.collections ?? []).map(
    (c: any) => new Collection(c.id, c.name, c.is_active)
  );
  const media = (item.media ?? []).map(
    (m: any) => new ProductMedia(m.id, m.url, m.media_type, m.order)
  );

  return new Product(
    item.id,
    item.name,
    item.description,
    item.price_amount,
    item.price_currency,
    item.price_usd ?? null,
    manufacturer,
    skinTypes,
    purposes,
    collections,
    item.image ?? '',
    media,
    item.in_stock,
    item.created_at,
    item.net_amount !== null && item.net_amount !== undefined ? Number(item.net_amount) : null,
    item.net_amount_unit ?? '',
    item.ingredients ?? '',
    item.shelf_life_months ?? null,
    item.storage_conditions ?? '',
    item.precautions ?? '',
    item.usage_instructions ?? '',
    item.is_for_children ?? false,
    item.color_shade ?? '',
    item.fluoride_content ?? '',
    item.batch_number ?? '',
    item.conformity_document_number ?? '',
    item.conformity_document_valid_until ?? null,
    item.cost_price ?? null // Поле добавлено для админов (ProductAdminSerializer)
  );
}
