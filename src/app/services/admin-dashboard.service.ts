import {Injectable} from '@angular/core';
import {AdminReportAdapter} from '../adapter/AdminReportAdapter';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {StorageService} from './storage.service';
import {Stock} from '../model/stock';
import {BFast} from 'bfastjs';
import {toSqlDate} from '../utils/date';

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

  getStockReorderReportReport(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/stock-reports/stockReorderReport/${activeShop.projectId}`, {
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

  async getExpiredProducts(date: Date, skip = 0, size = 100 ): Promise<Stock[]> {
    const activeShop = await this._storage.getActiveShop();

    return BFast.database(activeShop.projectId).collection('stocks').query().find<Stock>({
      filter: {
        // @ts-ignore
        expire: {
          $lte: toSqlDate(date)
        }
      },
      size,
      skip
    });
  }
}
