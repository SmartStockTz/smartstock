import {Injectable} from '@angular/core';
import {AdminReportAdapter} from '../adapter/AdminReportAdapter';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {StorageService} from './storage.service';
import {Stock} from '../model/stock';
import {BFast} from 'bfastjs';
import {toSqlDate} from '../utils/date';
import {CartModel} from '../model/cart';
import {SalesModel} from '../model/CashSale';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService implements AdminReportAdapter {

  constructor(private readonly httpClient: HttpClient,
              private readonly storage: StorageService,
              private readonly settings: SettingsService) {
  }

  getFrequentlySoldProducts(beginDate: Date, endDate: Date): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        this.httpClient.get(this.settings.ssmFunctionsURL +
          `/dashboard/admin/dailySales/${activeShop.projectId}/${beginDate}`, {
          headers: this.settings.ssmFunctionsHeader
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

  getSalesTrend(beginDate: Date, endDate: Date): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        this.httpClient.get(this.settings.ssmFunctionsURL +
          `/dashboard/admin/salesGraphData/day/${activeShop.projectId}/${beginDate}/${endDate}`, {
          headers: this.settings.ssmFunctionsHeader
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

  getTotalCostOfGoodSold(beginDate: Date, endDate: Date): Promise<{ total: number }[]> {
    return new Promise<{ total: number }[]>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        this.httpClient.get<{ total: number }[]>(this.settings.ssmFunctionsURL +
          `/dashboard/admin/stock/${activeShop.projectId}/${beginDate}`, {
          headers: this.settings.ssmFunctionsHeader
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

  async getTotalSale(beginDate: Date, endDate: Date): Promise<number> {
    const activeShop = await this.storage.getActiveShop();
    const total = await BFast.database(activeShop.projectId).collection('sales')
      .query()
      .count({
        date: {
          $lte: toSqlDate(endDate),
          $gte: toSqlDate(beginDate)
        }
      }, {
        cacheEnable: false,
        dtl: 0
      });
    let sales = await BFast.database(activeShop.projectId).collection('sales')
      .query()
      .find<SalesModel>({
        filter: {
          // @ts-ignore
          date: {
            $lte: toSqlDate(endDate),
            $gte: toSqlDate(beginDate)
          }
        },
        skip: 0,
        size: total,
        keys: ['amount', 'batch'],
      }, {
        cacheEnable: false,
        dtl: 0
      });

    const duplication: { batch: string, value: any } = {batch: 'a', value: 'a'};

    sales = sales.filter(value => {
      if (duplication[value.batch] === value.batch) {
        return false;
      }
      duplication[value.batch] = value.batch;
      return true;
    });
    return sales.map(value => value.amount).reduce((a, b) => a + b, 0);
    // return new Promise<any>(async (resolve, reject) => {
    //   try {
    //     const activeShop = await this.storage.getActiveShop();
    //     this._httpClient.get<{ total: number }[]>(this._settings.ssmFunctionsURL +
    //       `/dashboard/admin/sales/${activeShop.projectId}/${beginDate}`, {
    //       headers: this._settings.ssmFunctionsHeader
    //     }).subscribe(value => {
    //       resolve(value);
    //     }, error => {
    //       reject(error);
    //     });
    //   } catch (e) {
    //     reject(e);
    //   }
    // });
  }

  getProductPerformanceReport(channel: string, from: string, to: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        this.httpClient.get(this.settings.ssmFunctionsURL +
          `/dashboard/sales-reports/productPerformanceReport/${activeShop.projectId}/${channel}/${from}/${to}`, {
          headers: this.settings.ssmFunctionsHeader
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
    //     const activeShop = await this.storage.getActiveShop();
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

    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();

    if (!(stocks && Array.isArray(stocks) && stocks.length > 0)) {
      stocks = await BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter(stock => stock.reorder >= stock.quantity);
  }

  async getExpiredProducts(date: Date, skip = 0, size = 1000): Promise<Stock[]> {
    const activeShop = await this.storage.getActiveShop();

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

  async getProductsAboutToExpire(): Promise<Stock[]> {
    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();
    const today = new Date();

    if (!(stocks && Array.isArray(stocks) && stocks.length > 0)) {
      stocks = await BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter(stock => stock.expire <= toSqlDate(new Date()));
  }

  async getSoldCarts(date: Date, skip = 0, size = 1000): Promise<CartModel[]> {
    const activeShop = await this.storage.getActiveShop();

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
