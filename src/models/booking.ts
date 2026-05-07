import { Cosmetologist } from './cosmetologist.js';
import { Procedure } from './procedure.js';
import { User } from './user.js';

export class Booking {
  id: number;
  user: User;
  cosmetologist: Cosmetologist;
  date: Date;
  startTime: string;
  endTime: string;
  procedures: Procedure[];
  duration: string;
  price: number;
  status: boolean;

  get start(): string {
    return `${this.date.toISOString().split('T')[0]}T${this.startTime}`;
  }

  get end(): string {
    return `${this.date.toISOString().split('T')[0]}T${this.endTime}`;
  }

  constructor(
    id: number,
    user: User,
    cosmetologist: Cosmetologist,
    date: Date,
    startTime: string,
    endTime: string,
    procedures: Procedure[] = [],
    duration: string = '00:00',
    price: number = 0,
    status: boolean = false
  ) {
    this.id = id;
    this.user = user;
    this.cosmetologist = cosmetologist;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.procedures = procedures;
    this.duration = duration;
    this.price = price;
    this.status = status;
  }
}
