import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() {
  }

  i(message: any, tag?: string) {
    if (!environment.production) {
      console.log(tag, message);
    }
  }

  e(message: any, tag?: string) {
    if (!environment.production) {
      console.error(tag, message);
    }
  }

  w(message: any, tag?: string) {
    if (!environment.production) {
      console.warn(tag, message);
    }
  }
}
