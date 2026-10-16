export class User {
  id: number = 0;
  username: string = '';
  phone: string = '';
  is_staff: boolean = false;

  constructor(
    id: number = 0,
    username: string = '',
    phone: string = '',
    is_staff: boolean = false,
  ) {
    this.id = id;
    this.username = username;
    this.is_staff = is_staff;
  }
}