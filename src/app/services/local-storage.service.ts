import {Injectable} from '@angular/core';
import {StorageAdapter} from '../adapter/StorageAdapter';
import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {BatchI} from '../model/batchI';
import {randomString} from '../adapter/ParseBackend';
import {Stock} from '../model/stock';
import {SsmEvents} from '../utils/eventsNames';
import {EventApiService} from './event-api.service';
import {BFast} from 'bfastjs';
import {CacheAdapter} from 'bfastjs/dist/src/adapters/CacheAdapter';

const cache: CacheAdapter = BFast.cache({cacheName: 'ssm', storeName: 'ng_forage'});

//   localforage.createInstance({
//   name: 'ssm',
//   storeName: 'ng_forage',
//   size: 200 * 1024
// });


const cacheClone = function ({name}): CacheAdapter {
  return BFast.cache({cacheName: name, storeName: 'ng_forage'});
  // return localforage.createInstance({
  //   name: name,
  //   storeName: 'ng_forage',
  //   size: 200 * 1024
  // });
};

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StorageAdapter {

  constructor(private readonly eventApi: EventApiService) {
  }

  async getActiveUser(): Promise<UserI> {
    return await BFast.auth().currentUser();
  }

  async saveSales(batchs: BatchI[]): Promise<any> {
    const activeShop = await this.getActiveShop();
    const sales = batchs.map<BatchI>(value => {
      value.body.syncId = new Date().getFullYear().toString() + randomString(20);
      return {
        body: value.body,
        method: value.method,
        path: value.path
      };
    });
    await cacheClone({name: activeShop.projectId + '_sales'}).set<BatchI[]>(randomString(12), sales);
  }

  async getActiveShop(): Promise<ShopI> {
    const response = await cache.get<ShopI>('activeShop');
    if (response) {
      return response;
    } else {
      throw {message: 'No Active Shop'};
    }
  }

  async saveActiveShop(shop: ShopI): Promise<any> {
    const response = await cache.set<ShopI>('activeShop', shop);
    window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_SET));
    return response;
  }

  async getCurrentProjectId(): Promise<string> {
    return await cache.get<string>('cPID');
  }

  async saveCurrentProjectId(projectId: string): Promise<any> {
    return await cache.set<string>('cPID', projectId);
  }

  async clearSsmStorage(): Promise<any> {
    return await cache.clearAll();
  }

  async saveActiveUser(user: UserI): Promise<any> {
    try {
      return await BFast.auth().setCurrentUser<UserI>(user);
    } catch (e) {
      console.log('Fail to set user');
      throw e;
    }
  }

  async removeActiveShop(): Promise<any> {
    const response = await cache.set('activeShop', undefined);
    this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
    return response;
  }

  async removeActiveUser(): Promise<any> {
    return await BFast.auth().setCurrentUser(undefined);
  }

  async removeStocks(): Promise<any> {
    const shop = await this.getActiveShop();
    return await cache.set(shop.projectId + '_stocks', undefined);
  }

  async getStocks(): Promise<Stock[]> {
    const shop = await this.getActiveShop();
    return await cache.get<Stock[]>(shop.projectId + '_stocks');
  }

  async saveStocks(stocks: Stock[]): Promise<any> {
    const shop = await this.getActiveShop();
    return await cache.set<Stock[]>(shop.projectId + '_stocks', stocks);
  }
}
