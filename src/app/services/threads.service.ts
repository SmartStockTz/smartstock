import {Injectable, OnInit} from '@angular/core';
import {SettingsServiceService} from './Settings-service.service';
import * as Parse from 'parse/dist/parse';
import {LocalStorageService} from './local-storage.service';
import {ShopI} from '../model/ShopI';

/*
This should handle sockets and when data found check
workers if available push updates to worker if not
handle updates in main thread
 */
@Injectable()
export class ThreadsService implements OnInit {

  constructor(private readonly _settings: SettingsServiceService,
              private readonly _storage: LocalStorageService) {
  }

  private salesWorkerProxy: Worker;
  private stocksWorkerProxy: Worker;

  private static _setUpParseServer(activeShop: ShopI) {
    Parse.initialize(activeShop.applicationId, '');
    Parse.serverURL = `https://${activeShop.projectUrlId}.bfast.fahamutech.com`;
  }

  ngOnInit(): void {
  }

  async start() {
    try {
      const activeShop = await this._storage.getActiveShop();
      ThreadsService._setUpParseServer(activeShop);
      await this.startSalesProxy();
      await this.startStockUpdateProxy();
      return 'Done start proxy';
    } catch (e) {
      console.warn(e);
    }
  }

  async stop() {
    this._stopWorkers();
    if (Parse.applicationId && Parse.serverURL) {
      Parse.LiveQuery.close();
    }
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
        this.salesWorkerProxy = new Worker('assets/js/sw-sales-proxy.js');
        this.salesWorkerProxy.onmessage = ({data}) => {
          console.log(`page got message: ${data}`);
        };
        this.salesWorkerProxy.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerSalesProxy();
      }
    } catch (e) {
      console.log(e);
      throw {message: 'Fails to start sales proxy'};
    }
  }

  private async startStockUpdateProxy() {
    try {
      if (typeof Worker !== 'undefined') {
        this.stocksWorkerProxy = new Worker('assets/js/sw-local-data.js');
        this.stocksWorkerProxy.onmessage = ({data}) => {
          console.log(`page got message: ${data}`);
        };
        this.stocksWorkerProxy.postMessage({});
        return 'Ok';
      } else {
        this._noWorkerStockSync();
      }
    } catch (e) {
      console.log(e);
      throw {message: 'Fails to start stocks proxy'};
    }
  }

  private _noWorkerSalesProxy() {

  }

  private async _noWorkerStockSync() {
    // const query = new Parse.Query('stocks');
    // query.equalTo('product', 'Test1');
    // const stockLiveQuery = await query.subscribe();
    //
    // console.log(stockLiveQuery);
    //
    // stockLiveQuery.on('open', () => {
    //   console.log('connection open for stocks');
    // });
    //
    // // stockLiveQuery.on('create', (stocks) => {
    // //   console.log('stocks created');
    // //   console.log(stocks);
    // // });
    // //
    // stockLiveQuery.on('update', (stocks) => {
    //   console.log('stocks updated');
    //   console.log(stocks);
    // });
    // //
    // // stockLiveQuery.on('delete', (stocks) => {
    // //   console.log('stocks deleted');
    // //   console.log(stocks);
    // // });
    // //
    // // stockLiveQuery.on('enter', (stocks) => {
    // //   console.log('stocks enter');
    // //   console.log(stocks);
    // // });
    // //
    // // stockLiveQuery.on('leave', (stocks) => {
    // //   console.log('stocks leave');
    // //   console.log(stocks);
    // // });
    //
    // stockLiveQuery.on('close', (stocks) => {
    //   console.log('stocks connection closed');
    // });
  }

}
