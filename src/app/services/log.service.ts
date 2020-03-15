import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() {
  }

  i(message: string) {
    if (!environment.production) {
      console.log(message);
    }
  }

  e(message: string) {
    if (!environment.production) {
      console.error(message);
    }
  }

  w(message: string) {
    if (!environment.production) {
      console.warn(message);
    }
  }
}
