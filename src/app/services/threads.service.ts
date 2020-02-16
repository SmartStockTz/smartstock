import {Injectable} from '@angular/core';
import {SettingsServiceService} from './Settings-service.service';

/*
This should handle sockets and when data found check
workers if available push updates to worker if not
handle updates in main thread
 */
@Injectable()
export class ThreadsService {

  constructor(private readonly settings: SettingsServiceService) {
  }

  async startSalesProxy() {
    try {
      if (typeof Worker !== 'undefined') {
        const worker = new Worker('assets/js/sw-sales-proxy.js');
        worker.onmessage = ({data}) => {
          console.log(`page got message: ${data}`);
        };
        // const applicationId = await this.settings.getCustomerApplicationId();
        // const serverUrl = await this.settings.getCustomerServerURLId();
        worker.postMessage(
          JSON.stringify({
            // appId: applicationId,
            // projectUrlId: serverUrl
          })
        );
        return 'Ok';
      } else {
        throw new Error('Web Workers are not supported in this environment.');
      }
    } catch (e) {
      console.log(e);
      throw {message: 'Fails to start sales proxy'};
    }
  }

  async startStockUpdateProxy() {
    try {
      if (typeof Worker !== 'undefined') {
        const worker = new Worker('assets/js/sw-local-data.js');
        worker.onmessage = ({data}) => {
          console.log(`page got message: ${data}`);
        };
        // const projectUrlId = await this.settings.getCustomerServerURLId();
        // const projectId = await this.settings.getCustomerProjectId();
        // const applicationId = await this.settings.getCustomerApplicationId();
        worker.postMessage(
          JSON.stringify({
            // appId: applicationId,
            // projectUrlId: projectUrlId,
            // projectId: projectId
          })
        );
        return 'Ok';
      } else {
        // console.log('fallback to normal routine');
        throw new Error('Web Workers are not supported in this environment.');
      }
    } catch (e) {
      console.log(e);
      throw {message: 'Fails to start stocks proxy'};
    }
  }

}
