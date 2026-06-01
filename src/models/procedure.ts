import { Category } from './category.js';
import { Cosmetologist } from './cosmetologist.js';

export class Procedure {
  id: number = 0;
  name: string = '';
  price: number = 0;
  duration: string = '';
  description: string = '';
  category: Category;
  isSale: boolean = false;
  cosmetologist: Cosmetologist;

  constructor(
    id: number = 0,
    name: string = '',
    price: number = 0,
    duration: string = '',
    description: string = '',
    isSale: false,
    category: Category,
    cosmetologist: Cosmetologist
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.duration = duration;
    this.description = description;
    this.isSale = isSale;
    this.category = category;
    this.cosmetologist = cosmetologist;
  }
}
