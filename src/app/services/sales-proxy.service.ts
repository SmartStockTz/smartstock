import {Injectable} from '@angular/core';
import {ParseBackend} from '../database/ParseBackend';

@Injectable({
  providedIn: 'root'
})
export class SalesProxyService extends ParseBackend {

  constructor() {
    super();
  }

  saleProxy() {
    this.salesBackground();
  }

  salesBackground() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('/assets/js/sw-sales-proxy.js');
      worker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('start sales auto post');
    } else {
      console.log('fallback to normal routine');
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}
