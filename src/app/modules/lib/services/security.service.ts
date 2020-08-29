import {Injectable} from '@angular/core';

@Injectable()
export class SecurityService<T> {

  constructor() {
  }

  decryptData(data: string, password: string): T {
    // new Crypto().subtle.digest()
    return undefined;
  }

  encryptData(data: T, password: string): string {
    return '';
  }

}
