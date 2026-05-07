import { Cosmetologist } from './cosmetologist.js';

export class WorkDay {
  id: number;
  cosmetologist: Cosmetologist;
  date: Date;
  startTime: string;
  endTime: string;
  isWorking: boolean = false;

  constructor(
    id: number,
    cosmetologist: Cosmetologist,
    date: Date,
    startTime: string,
    endTime: string,
    isWorking: boolean = false
  ) {
    this.id = id;
    this.cosmetologist = cosmetologist;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isWorking = isWorking;
  }
}
