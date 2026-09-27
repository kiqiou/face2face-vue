export class Manufacturer {
  id: number = 0;
  name: string = '';
  address: string = '';
  country: string = '';

  constructor(id: number = 0, name: string = '', address: string = '', country: string = '') {
    this.id = id;
    this.name = name;
    this.address = address;
    this.country = country;
  }
}