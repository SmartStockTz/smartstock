import {Injectable, OnInit} from '@angular/core';
import {StorageService} from './storage.service';
import {ShopI} from '../model/ShopI';
import {EventApiService} from './event-api.service';
import {SsmEvents} from '../utils/eventsNames';

/*
This should use web sockets when web workers not available
in a browser
 */
@Injectable({
  providedIn: 'root'
})
export class ThreadsService implements OnInit {

  constructor(private readonly eventApi: EventApiService,
              private readonly _storage: StorageService) {
  }

  private salesWorkerProxy: Worker;
  private stocksWorkerProxy: Worker;

  ngOnInit(): void {
  }

  async start() {
    try {
      const activeShop = await this._storage.getActiveShop();
      // this._setUpParseServer(activeShop);
      await this.startSalesProxy();
      await this.startStockUpdateProxy();
      return 'Done start proxy';
    } catch (e) {
      console.warn(e);
    }
  }

  async stop() {
    this._stopWorkers();
  }

  private _stopWorkers() {
    if (this.salesWorkerProxy) {
      this.salesWorkerProxy.terminate();
    } else {
      this.salesWorkerProxy = undefined;
    }
    if (this.stocksWorkerProxy) {
      this.stocksWorkerProxy.terminate();
    } else {
      this.stocksWorkerProxy = undefined;
    }
  }

  private async startSalesProxy() {
    try {
      if (typeof Worker !== 'undefined') {
        this.salesWorkerProxy = new Worker('assets/js/sw-landing-proxy.js');
        this.salesWorkerProxy.onmessage = ({data}) => {
          // this.eventApi.broadcast(SsmEvents.STOCK_UPDATED);
        };
        this.salesWorkerProxy.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerSalesProxy();
      }
    } catch (e) {
      console.log(e);
      throw {message: 'Fails to start landing proxy'};
    }
  }

  private async startStockUpdateProxy() {
    try {
      if (typeof Worker !== 'undefined') {
        this.stocksWorkerProxy = new Worker('assets/js/sw-local-data.js');
        this.stocksWorkerProxy.onmessage = ({data}) => {
          this.eventApi.broadcast(SsmEvents.STOCK_UPDATED);
        };
        this.stocksWorkerProxy.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerStockSync();
      }
    } catch (e) {
      throw {message: 'Fails to start stocks proxy'};
    }
  }

  private _noWorkerSalesProxy() {
  }

  private _noWorkerStockSync() {
  }

}
