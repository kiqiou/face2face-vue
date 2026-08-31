export class Collection {
  id: number = 0;
  name: string = '';
  isActive: boolean = true;

  constructor(id: number = 0, name: string = '', isActive: boolean = true) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
  }
}