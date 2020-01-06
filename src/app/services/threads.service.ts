import {Injectable} from '@angular/core';
import {SettingsServiceService} from './Settings-service.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {

  constructor(private readonly settings: SettingsServiceService) {
  }

  async startSalesProxy() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('assets/js/sw-sales-proxy.js');
      worker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage(
        JSON.stringify({
          appId: this.settings.getCustomerApplicationId(),
          projectUrlId: this.settings.getCustomerServerURLId()
        })
      );
      return 'Ok';
    } else {
      throw {message: 'Web Workers are not supported in this environment.'};
    }
  }

  async startStockUpdateProxy() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('assets/js/sw-local-data.js');
      worker.onmessage = ({data}) => {
        // console.log(`page got message: ${data}`);
      };
      worker.postMessage(
        JSON.stringify({
          appId: this.settings.getCustomerApplicationId(),
          projectUrlId: this.settings.getCustomerServerURLId(),
          projectId: this.settings.getCustomerProjectId(),
        })
      );
      return 'Ok';
    } else {
      // console.log('fallback to normal routine');
      throw {message: 'Web Workers are not supported in this environment.'};
    }
  }

  // async startCategoryUpdateProxy(){
  //
  // }
}
