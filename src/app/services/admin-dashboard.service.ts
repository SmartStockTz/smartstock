import {Injectable} from '@angular/core';
import {AdminReportAdapter} from '../adapter/AdminReportAdapter';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {StorageService} from './storage.service';
import {Stock} from '../model/stock';
import {BFast} from 'bfastjs';
import {toSqlDate} from '../utils/date';
import {CartModel} from '../model/cart';

@Injectable()
export class AdminDashboardService implements AdminReportAdapter {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  getFrequentlySoldProductsByDate(date: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/admin/dailySales/${activeShop.projectId}/${date}`, {
          headers: this._settings.ssmFunctionsHeader
        }).subscribe(value => {
          resolve(value);
        }, error => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getSalesTrendByDates(from: string, to: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/admin/salesGraphData/day/${activeShop.projectId}/${from}/${to}`, {
          headers: this._settings.ssmFunctionsHeader
        }).subscribe(value => {
          resolve(value);
        }, error => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getTotalCostOfGoodSoldByDate(date: string): Promise<{ total: number }[]> {
    return new Promise<{ total: number }[]>(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get<{ total: number }[]>(this._settings.ssmFunctionsURL +
          `/dashboard/admin/stock/${activeShop.projectId}/${date}`, {
          headers: this._settings.ssmFunctionsHeader
        }).subscribe(value => {
          resolve(value);
        }, error => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getTotalSaleByDate(date: string): Promise<{ total: number }[]> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get<{ total: number }[]>(this._settings.ssmFunctionsURL +
          `/dashboard/admin/sales/${activeShop.projectId}/${date}`, {
          headers: this._settings.ssmFunctionsHeader
        }).subscribe(value => {
          resolve(value);
        }, error => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getProductPerformanceReport(channel: string, from: string, to: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/sales-reports/productPerformanceReport/${activeShop.projectId}/${channel}/${from}/${to}`, {
          headers: this._settings.ssmFunctionsHeader
        }).subscribe(value => {
          resolve(value);
        }, error => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async getStockReorderReportReport(skip = 0, size = 100): Promise<any> {
    // return new Promise<any>(async (resolve, reject) => {
    //   try {
    //     const activeShop = await this._storage.getActiveShop();
    //     this._httpClient.get(this._settings.ssmFunctionsURL +
    //       `/dashboard/stock-reports/stockReorderReport/${activeShop.projectId}`, {
    //       headers: this._settings.ssmFunctionsHeader
    //     }).subscribe(value => {
    //       resolve(value);
    //     }, error => {
    //       reject(error);
    //     });
    //   } catch (e) {
    //     reject(e);
    //   }
    // // });

    const activeShop = await this._storage.getActiveShop();
    let stocks = await this._storage.getStocks();

    if (! (stocks && Array.isArray(stocks) && stocks.length > 0) ) {
      stocks = await  BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter( stock => stock.reorder >= stock.quantity);
  }

  async getExpiredProducts(date: Date, skip = 0, size = 1000 ): Promise<Stock[]> {
    const activeShop = await this._storage.getActiveShop();

    return BFast.database(activeShop.projectId).collection('stocks').query().find<Stock>({
      filter: {
        // @ts-ignore
        expire: {
          $lte: toSqlDate(date)
        }
      },
      skip,
      size
    }, {
      cacheEnable: true,
      dtl: 0,
      freshDataCallback: value => {
        console.log(value);
      }
    });
  }

  async getProductsAboutToExpire(): Promise<Stock[]>{
    const activeShop = await this._storage.getActiveShop();
    let stocks = await this._storage.getStocks();
    const today = new Date();

    if (! (stocks && Array.isArray(stocks) && stocks.length > 0) ) {
      stocks = await  BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter( stock => stock.expire <= toSqlDate(new Date()));
  }

  async getSoldCarts(date: Date, skip = 0, size = 1000): Promise<CartModel[]> {
    const activeShop = await this._storage.getActiveShop();

    return BFast.database(activeShop.projectId).collection('sales').query().find<CartModel>({
      filter: {
        // @ts-ignore
        expire: {
          $lte: toSqlDate(date)
        }
      },
      skip,
      size
    }, {
      cacheEnable: true,
      dtl: 0,
      freshDataCallback: value => {
        console.log(value);
      }
    });
  }
}
