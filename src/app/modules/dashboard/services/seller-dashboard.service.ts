import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from '@smartstocktz/core-libs';
import {StorageService} from '@smartstocktz/core-libs';

@Injectable()
export class SellerDashboardService {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  getTotalSaleOfUserByDate(date: string): Promise<{ total: number }[]> {
    return new Promise<{ total: number }[]>(async (resolve, reject) => {
      try {
        const user = await this._storage.getActiveUser();
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get<{ total: number }[]>(
          this._settings.ssmFunctionsURL + `/dashboard/seller/sales/${user.id}/${activeShop.projectId}/${date}`, {
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

  getTotalCostOfGoodSoldOfUserByDate(date: string): Promise<{ total: number }[]> {
    return new Promise<{ total: number }[]>(async (resolve, reject) => {
      try {
        const user = await this._storage.getActiveUser();
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get<{ total: number }[]>(
          this._settings.ssmFunctionsURL + `/dashboard/seller/stock/${user.id}/${activeShop.projectId}/${date}`, {
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

  getSalesTrendByUserAndDates(fromDate: string, toDate: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await this._storage.getActiveUser();
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/seller/salesGraphData/day/${user.id}/${activeShop.projectId}/${fromDate}/${toDate}`, {
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
        const user = await this._storage.getActiveUser();
        const activeShop = await this._storage.getActiveShop();
        this._httpClient.get(this._settings.ssmFunctionsURL +
          `/dashboard/seller/dailySales/${user.id}/${activeShop.projectId}/${date}`, {
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
