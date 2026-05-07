import { User } from './user.js';

export class Cosmetologist {
  id: number = 0;
  user: User;
  bio: string = '';
  specialization: string = '';
  avatarUrl: string = '';

  constructor(
    id: number = 0,
    user: User,
    bio: string = '',
    specialization: string = '',
    avatarUrl: string = ''
  ) {
    this.id = id;
    this.user = user;
    this.bio = bio;
    this.specialization = specialization;
    this.avatarUrl = avatarUrl;
  }
}
