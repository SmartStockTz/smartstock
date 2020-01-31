import {Injectable} from '@angular/core';
import {SecurityAdapter} from '../adapter/SecurityAdapter';

@Injectable({
  providedIn: 'root'
})
export class SecurityService<T> implements SecurityAdapter {

  constructor() {
  }

  decryptData(data: string, password: string): T {
    new Crypto().subtle.digest()
    return undefined;
  }

  encryptData(data: T, password: string): string {
    return '';
  }

}
