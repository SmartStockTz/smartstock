import {Injectable, OnInit} from '@angular/core';
import {StorageService} from './storage.service';
import {EventApiService} from '../modules/lib/services/event-api.service';
import {SsmEvents} from '../modules/common-lib/utils/eventsNames';
import {Capacitor} from '@capacitor/core';
import {SyncStocksService} from '../modules/stocks/services/syncStocks.service';
import {SyncSalesService} from '../modules/sales/services/syncSales.service';

/*
This should use web sockets when web workers not available
in a browser
 */
@Injectable({
  providedIn: 'root'
})
export class ThreadsService implements OnInit {

  constructor(private readonly eventApi: EventApiService,
              private readonly swLocalDataService: SyncStocksService,
              private readonly swSalesProxyService: SyncSalesService,
              private readonly _storage: StorageService) {
  }

  private salesWorkerProxy: Worker;
  private stocksWorkerProxy: Worker;

  ngOnInit(): void {
  }

  async start() {
    try {
      // const activeShop = await this._storage.getActiveShop();
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
    this.swSalesProxyService.stop();
    this.swLocalDataService.stop();
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
      if (Capacitor.isNative) {
        this.swSalesProxyService.start();
      } else {
        if (typeof Worker !== 'undefined') {
          this.salesWorkerProxy = new Worker('assets/js/sw-sales-proxy.js');
          this.salesWorkerProxy.onmessage = ({data}) => {
          };
          this.salesWorkerProxy.postMessage({});
          return 'Ok';
        } else {
          this._noWorkerSalesProxy();
        }
      }
    } catch (e) {
      this._noWorkerSalesProxy();
      throw {message: 'Fails to start sales proxy'};
    }
  }

  private async startStockUpdateProxy() {
    try {
      if (Capacitor.isNative) {
        this.swLocalDataService.start();
      } else {
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
      }
    } catch (e) {
      this._noWorkerStockSync();
      throw {message: 'Fails to start stocks proxy'};
    }
  }

  private _noWorkerSalesProxy() {
    this.swSalesProxyService.start();
  }

  private _noWorkerStockSync() {
    this.swLocalDataService.start();
  }

}
