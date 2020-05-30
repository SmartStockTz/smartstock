import {Injectable} from '@angular/core';
import {ShopDatabaseAdapter} from '../adapter/ShopDatabaseAdapter';
import {ShopI} from '../model/ShopI';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {StorageService} from './storage.service';

@Injectable()
export class ShopDatabaseService implements ShopDatabaseAdapter {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  createShop(shop: ShopI): Promise<ShopI> {
    return new Promise<ShopI>(async (resolve, reject) => {
      try {
        const user = await this._storage.getActiveUser();
        this._httpClient.post<ShopI>(this._settings.ssmFunctionsURL + '/shops/' + user.objectId, shop, {
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
