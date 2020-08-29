import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '../../account/services/settings.service';
import {BFast} from 'bfastjs';
import {SalesModel} from '../../sales/models/sale.model';
import {StorageService} from '../../lib/services/storage.service';
import {StockModel} from '../models/stock.model';
import {CartModel} from '../models/cart.model';
import * as moment from 'moment';
import {toSqlDate} from '../../lib/utils/date.util';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

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

  getSalesTrend(beginDate: string, endDate: string): Promise<any> {
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
    const total: number = await BFast.database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', toSqlDate(endDate))
      .greaterThanOrEqual('date', toSqlDate(beginDate))
      .count(true).find();
    let sales: SalesModel[] = await BFast.database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', toSqlDate(endDate))
      .greaterThanOrEqual('date', toSqlDate(beginDate))
      .skip(0)
      .size(total)
      .find<SalesModel[]>({
        returnFields: ['amount', 'batch']
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
  }

  getProductPerformanceReport(channel: string, from: string, to: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        this.httpClient.get(this.settings.ssmFunctionsURL +
          `/dashboard/sales-reports/productPerformanceReport/${activeShop.projectId}/${from}/${to}`, {
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

  getSalesByCategory(channel: string, from: string, to: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        BFast.functions()
          .request(`/dashboard/sales-reports/profitByCategory/${activeShop.projectId}/${from}/${to}`).get({
          headers: this.settings.ssmFunctionsHeader
        }).then(value => {
          resolve(value);
        }).catch(error => {
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

  async getExpiredProducts(date: Date, skip = 0, size = 1000): Promise<StockModel[]> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database(activeShop.projectId).collection('stocks')
      .query()
      .lessThanOrEqual('expire', toSqlDate(date))
      .skip(skip)
      .size(size)
      .find<StockModel[]>();
  }

  async getProductsAboutToExpire(): Promise<StockModel[]> {
    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();
    const today = new Date();
    if (!(stocks && Array.isArray(stocks) && stocks.length > 0)) {
      stocks = await BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0,
      });
    }
    return stocks.filter(stock => (stock.expire > toSqlDate(today) && (stock.expire <= toSqlDate(moment(today).add(3, 'M').toDate()))));
  }

  async getSoldCarts(from: string, to: string, channel: string, skip = 0, size = 100): Promise<CartModel[]> {
    // const activeShop = await this.storage.getActiveShop();

    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this.storage.getActiveShop();
        this.httpClient.get(this.settings.ssmFunctionsURL +
          `/dashboard/sales-reports/cartOrderReport/${activeShop.projectId}/${channel}/${from}/${to}`, {
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

  async getTotalGrossSale(beginDate: Date, endDate: Date) {
    const activeShop = await this.storage.getActiveShop();
    const total: number = await BFast.database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', toSqlDate(endDate))
      .greaterThanOrEqual('date', toSqlDate(beginDate))
      .count(true)
      .find();
    let sales = await BFast.database(activeShop.projectId).collection('sales')
      .query()
      .lessThanOrEqual('date', toSqlDate(endDate))
      .greaterThanOrEqual('date', toSqlDate(beginDate))
      .skip(0)
      .size(total)
      .find<SalesModel[]>({
        returnFields: ['amount', 'batch', 'quantity', 'stock'],
      });

    const duplication: { batch: string, value: any } = {batch: 'a', value: 'a'};

    sales = sales.filter(value => {
      if (duplication[value.batch] === value.batch) {
        return false;
      }
      duplication[value.batch] = value.batch;
      return true;
    });

    const salesCost = sales.map(value => value.amount).reduce((a, b) => a + b, 0);
    const costOfGoodSold = sales.map(value => (value.quantity * value.stock.purchase)).reduce((a, b) => a + b, 0);
    return salesCost - costOfGoodSold;
  }

  async getStockStatus(): Promise<{ x: string; y: number }[]> {
    const activeShop = await this.storage.getActiveShop();
    let stocks = await this.storage.getStocks();
    const status: { x: string; y: number }[] = [];
    if (stocks && Array.isArray(stocks) && stocks.length > 0) {
      status.push({x: 'total', y: stocks.length});
      status.push({x: 'out', y: stocks.filter(stock => stock.quantity <= 0).length});
      status.push({x: 'order', y: stocks.filter(stock => stock.quantity <= stock.reorder).length});
    } else {
      stocks = await BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0
      });
      status.push({x: 'total', y: stocks.length});
      status.push({x: 'out', y: stocks.filter(stock => stock.quantity > 0).length});
      status.push({x: 'order', y: stocks.filter(stock => stock.quantity <= stock.reorder).length});
    }
    return status;
  }

  async getStockStatusByCategory(): Promise<{ x: string; y: number }[]> {
    const activeShop = await this.storage.getActiveShop();
    const categories = {};
    let stocks = await this.storage.getStocks();
    const status: { x: string; y: number }[] = [];
    if (stocks && Array.isArray(stocks) && stocks.length > 0) {
      stocks.forEach(stock => categories[stock.category] = stock.category);
      Object.keys(categories).forEach(category => {
        status.push({x: category, y: stocks.filter(stock => stock.category === category).length});
      });
    } else {
      stocks = await BFast.database(activeShop.projectId).collection('stocks').getAll(null, {
        cacheEnable: false,
        dtl: 0
      });
      stocks.forEach(stock => categories[stock.category] = stock.category);
      Object.keys(categories).forEach(category => {
        status.push({x: category, y: stocks.filter(stock => stock.category === category).length});
      });
    }
    return status;
  }
}
