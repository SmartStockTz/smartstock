import {Injectable} from '@angular/core';
import {ShopModel} from '../models/shop.model';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';
import {StorageService} from '../../lib/services/storage.service';

@Injectable()
export class ShopDatabaseService {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  createShop(shop: ShopModel): Promise<ShopModel> {
    return new Promise<ShopModel>(async (resolve, reject) => {
      try {
        const user = await this._storage.getActiveUser();
        this._httpClient.post<ShopModel>(this._settings.ssmFunctionsURL + '/shops/' + user.objectId, shop, {
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
