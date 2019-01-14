import {Injectable} from '@angular/core';
import {isString} from 'util';

@Injectable({
  providedIn: 'root'
})
export class SsmToolsService {

  constructor() {
  }

  static getDateInString(date: any) {
    if (isString(date)) {
      return date;
    } else {
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString(10);
      let day = (date.getDate()).toString(10);
      if (month.length === 1) {
        month = '0' + month;
      }
      if (day.length === 1) {
        day = '0' + day;
      }
      return year + '-' + month + '-' + day;
    }
  }
}
