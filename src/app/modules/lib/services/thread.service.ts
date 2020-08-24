import {Injectable, OnInit} from '@angular/core';
import {StorageService} from './storage.service';
import {Capacitor} from '@capacitor/core';
import {SyncSalesService} from '../../sales/services/syncSales.service';
import {SyncStocksService} from '../../stocks/services/syncStocks.service';
import {SsmEvents} from '../utils/eventsNames.util';
import {EventService} from './event.service';

/*
This should use web sockets when web workers not available
in a browser
 */
@Injectable({
  providedIn: 'root'
})
export class ThreadService implements OnInit {

  constructor(private readonly eventApi: EventService,
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
      if (typeof Worker !== 'undefined') {
        this.salesWorkerProxy = new Worker('./sales.worker.service', {type: 'module'});
        // wrap<SalesWorkerService>(this.salesWorkerProxy);
        // this.salesWorkerProxy.onmessage = ({data}) => {
        // };
        this.salesWorkerProxy.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerSalesProxy();
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
          this.stocksWorkerProxy = new Worker('./stocks.worker.service', {type: 'module'});
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
