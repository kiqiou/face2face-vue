export class User {
  id: number = 0;
  username: string = '';
  phone: string = '';
  role: number = 0;

  constructor(
    id: number = 0,
    username: string = '',
    phone: string = '',
    role: number = 0
  ) {
    this.id = id;
    ((this.username = username), (this.phone = phone));
    this.role = role;
  }
}
