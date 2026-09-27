import { Manufacturer } from './manufacturer.js';
import { SkinType } from './skinType.js';
import { ProductPurpose } from './productPurpose.js';
import { Collection } from './collection.js';
import { ProductMedia } from './productMedia.js';

export type Currency = 'BYN' | 'USD';
export type NetAmountUnit = 'ml' | 'l' | 'g' | 'kg' | 'pcs';

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
  imageUrl: string = '';
  media: ProductMedia[] = [];
  inStock: boolean = true;
  createdAt: string = '';
  costPrice: number | null = null;
  netAmount: number | null = null;
  netAmountUnit: NetAmountUnit | '' = '';
  ingredients: string = '';
  shelfLifeMonths: number | null = null;
  storageConditions: string = '';
  precautions: string = '';
  usageInstructions: string = '';
  isForChildren: boolean = false;
  colorShade: string = '';
  fluorideContent: string = '';
  batchNumber: string = '';
  conformityDocumentNumber: string = '';
  conformityDocumentValidUntil: string | null = null;

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
    createdAt: string = '',
    netAmount: number | null = null,
    netAmountUnit: NetAmountUnit | '' = '',
    ingredients: string = '',
    shelfLifeMonths: number | null = null,
    storageConditions: string = '',
    precautions: string = '',
    usageInstructions: string = '',
    isForChildren: boolean = false,
    colorShade: string = '',
    fluorideContent: string = '',
    batchNumber: string = '',
    conformityDocumentNumber: string = '',
    conformityDocumentValidUntil: string | null = null,
    costPrice: number | null = null
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
    this.netAmount = netAmount;
    this.netAmountUnit = netAmountUnit;
    this.ingredients = ingredients;
    this.shelfLifeMonths = shelfLifeMonths;
    this.storageConditions = storageConditions;
    this.precautions = precautions;
    this.usageInstructions = usageInstructions;
    this.isForChildren = isForChildren;
    this.colorShade = colorShade;
    this.fluorideContent = fluorideContent;
    this.batchNumber = batchNumber;
    this.conformityDocumentNumber = conformityDocumentNumber;
    this.conformityDocumentValidUntil = conformityDocumentValidUntil;
    this.costPrice = costPrice;
  }
}