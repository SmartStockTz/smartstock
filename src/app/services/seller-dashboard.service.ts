import {Injectable} from '@angular/core';
import {SellerReportAdapter} from '../adapter/SellerReportAdapter';
import {HttpClient} from '@angular/common/http';
import {SettingsServiceService} from './Settings-service.service';
import {NgForage} from 'ngforage';
import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';

@Injectable({
  providedIn: 'root'
})
export class SellerDashboardService implements SellerReportAdapter {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: NgForage,
              private readonly _settings: SettingsServiceService) {
  }

  getTotalSaleOfUserByDate(date: string): Promise<{ total: number }[]> {
    return new Promise<{ total: number }[]>(async (resolve, reject) => {
      try {
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
        this._httpClient.get<{ total: number }[]>(this._settings.ssmFunctionsURL +
          `/dashboard/seller/sales/${user.objectId}/${activeShop.projectId}/${date}`, {
          headers: this._settings.ssmFunctionsHeader
        })
          .subscribe(value => {
            resolve(value);
          }, error => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  getTotalCostOfGoodSoldOfUserByDate(date: string): Promise<{ total: number }[]> {
    return new Promise<{ total: number }[]>(async (resolve, reject) => {
      try {
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
        this._httpClient.get<{ total: number }[]>(this._settings.ssmFunctionsURL +
          `/dashboard/seller/stock/${user.objectId}/${activeShop.projectId}/${date}`, {
          headers: this._settings.ssmFunctionsHeader
        })
          .subscribe(value => {
            resolve(value);
          }, error => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  getSalesTrendByUserAndDates(fromDate: string, toDate: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/seller/salesGraphData/day/${user.objectId}/${activeShop.projectId}/${fromDate}/${toDate}`, {
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

  getSoldProductsByDate(date: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await this._storage.getItem<UserI>('user');
        const activeShop = await this._storage.getItem<ShopI>('activeShop');
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/seller/dailySales/${user.objectId}/${activeShop.projectId}/${date}`, {
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
