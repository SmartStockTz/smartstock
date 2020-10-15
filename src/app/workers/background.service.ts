
import {Injectable, OnInit} from '@angular/core';
import {EventService, SsmEvents, StorageService} from '@smartstock/core-libs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService implements OnInit {

  constructor(private readonly eventApi: EventService,
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
        this.salesWorker = new Worker('./sales.worker', {type: 'module'});
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
        this.settingsWorker = new Worker('./settings.worker', {type: 'module'});
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
        this.stocksWorkerProxy = new Worker('./stocks.worker', {type: 'module'});
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
  }

  private _noWorkerSettings() {

  }
}
