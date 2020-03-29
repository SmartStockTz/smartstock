import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() {
  }

  i(message: string, tag?: string) {
    if (!environment.production) {
      console.log(tag, message);
    }
  }

  e(message: string, tag?: string) {
    if (!environment.production) {
      console.error(tag, message);
    }
  }

  w(message: string, tag?: string) {
    if (!environment.production) {
      console.warn(tag, message);
    }
  }
}
