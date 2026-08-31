import { Manufacturer } from './manufacturer.js';
import { SkinType } from './skinType.js';
import { ProductPurpose } from './productPurpose.js';
import { Collection } from './collection.js';
import { ProductMedia } from './productMedia.js';

export type Currency = 'BYN' | 'USD';

export class Product {
  id: number = 0;
  name: string = '';
  description: string = '';
  priceAmount: number = 0;
  priceCurrency: Currency = 'BYN';
  priceUsd: number | null = null;
  manufacturer: Manufacturer;
  skinTypes: SkinType[] = [];
  purposes: ProductPurpose[] = [];
  collections: Collection[] = [];
  imageUrl: string = '';        // legacy-обложка
  media: ProductMedia[] = [];   // новая галерея
  inStock: boolean = true;
  createdAt: string = '';

  constructor(
    id: number = 0,
    name: string = '',
    description: string = '',
    priceAmount: number = 0,
    priceCurrency: Currency = 'BYN',
    priceUsd: number | null = null,
    manufacturer: Manufacturer,
    skinTypes: SkinType[] = [],
    purposes: ProductPurpose[] = [],
    collections: Collection[] = [],
    imageUrl: string = '',
    media: ProductMedia[] = [],
    inStock: boolean = true,
    createdAt: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priceAmount = priceAmount;
    this.priceCurrency = priceCurrency;
    this.priceUsd = priceUsd;
    this.manufacturer = manufacturer;
    this.skinTypes = skinTypes;
    this.purposes = purposes;
    this.collections = collections;
    this.imageUrl = imageUrl;
    this.media = media;
    this.inStock = inStock;
    this.createdAt = createdAt;
  }
}