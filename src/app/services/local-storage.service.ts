import {Injectable} from '@angular/core';
import {StorageAdapter} from '../adapter/StorageAdapter';
import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {BatchI} from '../model/batchI';
import {randomString} from '../adapter/ParseBackend';
import {Stock} from '../model/stock';
import {SsmEvents} from '../utils/eventsNames';
import * as localforage from 'localforage';

const _storage = localforage.createInstance({
  name: 'ssm',
  storeName: 'ng_forage',
  size: 200 * 1024
});

_storage['clone'] = function ({name}) {
  return localforage.createInstance({
    name: name,
    storeName: 'ng_forage',
    size: 200 * 1024
  });
};

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StorageAdapter {

  constructor() {
  }

  async getActiveUser(): Promise<UserI> {
    try {
      return await _storage.getItem<UserI>('user');
    } catch (e) {
      return e;
    }
  }

  async saveSales(batchs: BatchI[]): Promise<any> {
    try {
      const activeShop = await this.getActiveShop();
      return await _storage['clone']({name: activeShop.projectId + '_sales'})
        .setItem<BatchI[]>(randomString(12), batchs);
    } catch (e) {
      throw e;
    }
  }

  async getActiveShop(): Promise<ShopI> {
    try {
      const response = await _storage.getItem<ShopI>('activeShop');
      if (response) {
        return response;
      } else {
        throw {message: 'No Active Shop'};
      }
    } catch (e) {
      throw e;
    }
  }

  async saveActiveShop(shop: ShopI): Promise<any> {
    try {
      const response = await _storage.setItem<ShopI>('activeShop', shop);
      window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_SET));
      return response;
    } catch (e) {
      throw e;
    }
  }

  async getCurrentProjectId(): Promise<string> {
    try {
      console.log(await _storage.getItem<string>('cPID'));
      return await _storage.getItem<string>('cPID');
    } catch (e) {
      throw e;
    }
  }

  async saveCurrentProjectId(projectId: string): Promise<any> {
    try {
      return await _storage.setItem<string>('cPID', projectId);
    } catch (e) {
      throw e;
    }
  }

  async clearSsmStorage(): Promise<any> {
    try {
      return await _storage.clear();
    } catch (e) {
      throw e;
    }
  }

  async saveActiveUser(user: UserI): Promise<any> {
    try {
      return await _storage.setItem<UserI>('user', user);
    } catch (e) {
      console.log('Fail to set user');
      throw e;
    }
  }

  async removeActiveShop(): Promise<any> {
    try {
      const response = await _storage.removeItem('activeShop');
      window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_REMOVE));
      return response;
    } catch (e) {
      throw e;
    }
  }

  async removeActiveUser(): Promise<any> {
    try {
      return await _storage.removeItem('user');
    } catch (e) {
      throw e;
    }
  }

  async removeStocks(): Promise<any> {
    try {
      return await _storage.removeItem('stocks');
    } catch (e) {
      throw e;
    }
  }

  async getStocks(): Promise<Stock[]> {
    try {
      return await _storage.getItem<Stock[]>('stocks');
    } catch (e) {
      throw e;
    }
  }

  async saveStocks(stocks: Stock[]): Promise<any> {
    try {
      return await _storage.setItem<Stock[]>('stocks', stocks);
    } catch (e) {
      throw e;
    }
  }
}
