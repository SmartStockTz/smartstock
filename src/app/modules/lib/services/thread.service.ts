import {Injectable, OnInit} from '@angular/core';
import {StorageService} from './storage.service';
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
              private readonly _storage: StorageService) {
  }

  private settingsWorker: Worker;
  private salesWorker: Worker;
  private stocksWorkerProxy: Worker;

  ngOnInit(): void {
  }

  async start() {
    try {
      await this.startSalesProxy();
      await this.startStockUpdateProxy();
      await this.startSettingsWatch();
      return 'Done start proxy';
    } catch (e) {
      console.warn(e);
    }
  }

  async stop() {
    this._stopWorkers();
  }

  private _stopWorkers() {
    // this.swSalesProxyService.stop();
    this.swLocalDataService.stop();
    if (this.salesWorker) {
      this.salesWorker.terminate();
    } else {
      this.salesWorker = undefined;
    }
    if (this.stocksWorkerProxy) {
      this.stocksWorkerProxy.terminate();
    } else {
      this.stocksWorkerProxy = undefined;
    }
    if (this.settingsWorker) {
      this.settingsWorker.terminate();
    } else {
      this.settingsWorker = undefined;
    }
  }

  private async startSalesProxy() {
    try {
      if (typeof Worker !== 'undefined') {
        this.salesWorker = new Worker('./sales.worker.service', {type: 'module'});
        this.salesWorker.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerSalesProxy();
      }
    } catch (e) {
      this._noWorkerSalesProxy();
      throw {message: 'Fails to start sales proxy'};
    }
  }

  private startSettingsWatch() {
    try {
      if (typeof Worker !== 'undefined') {
        this.settingsWorker = new Worker('./settings.worker.service', {type: 'module'});
        this.settingsWorker.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerSettings();
      }
    } catch (e) {
      this._noWorkerSalesProxy();
      throw {message: 'Fails to start sales proxy'};
    }
  }

  private async startStockUpdateProxy() {
    try {
      // if (Capacitor.isNative) {
      //   this.swLocalDataService.start();
      // } else {
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
      // }
    } catch (e) {
      this._noWorkerStockSync();
      throw {message: 'Fails to start stocks proxy'};
    }
  }

  private _noWorkerSalesProxy() {
    // this.swSalesProxyService.start();
  }

  private _noWorkerStockSync() {
    this.swLocalDataService.start();
  }

  private _noWorkerSettings() {

  }
}
