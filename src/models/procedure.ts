import { Cosmetologist } from './cosmetologist.js';

export class Procedure {
  id: number = 0;
  name: string = '';
  price: number = 0;
  duration: string = '';
  cosmetologist: Cosmetologist;

  constructor(
    id: number = 0,
    name: string = '',
    price: number = 0,
    duration: string = '',
    cosmetologist: Cosmetologist
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.duration = duration;
    this.cosmetologist = cosmetologist;
  }
}
