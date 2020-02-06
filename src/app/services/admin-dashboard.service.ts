import {Injectable} from '@angular/core';
import {AdminReportAdapter} from '../database/connector/AdminReportAdapter';
import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {HttpClient} from '@angular/common/http';
import {NgForage} from 'ngforage';
import {SettingsServiceService} from './Settings-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService implements AdminReportAdapter {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: NgForage,
              private readonly _settings: SettingsServiceService) {
  }

  getFrequentlySoldProductsByDate(date: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
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
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
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
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
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
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
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
}
