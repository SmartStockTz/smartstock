import {Injectable} from '@angular/core';
import {StorageAdapter} from '../adapter/StorageAdapter';
import {UserI} from '../model/UserI';
import {NgForage} from 'ngforage';
import {ShopI} from '../model/ShopI';
import {BatchI} from '../model/batchI';
import {randomString} from '../adapter/ParseBackend';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StorageAdapter {

  constructor(private readonly _storage: NgForage) {
  }

  async getActiveUser(): Promise<UserI> {
    return await this._storage.getItem<UserI>('user');
  }

  async saveSales(batchs: BatchI[]): Promise<any> {
    try {
      const activeShop = await this.getActiveShop();
      return await this._storage
        .clone({name: activeShop.projectId + '_sales'})
        .setItem<BatchI[]>(randomString(12), batchs);
    } catch (e) {
      throw e;
    }
  }

  async getActiveShop(): Promise<ShopI> {
    try {
      const response = await this._storage.getItem<ShopI>('activeShop');
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
      return await this._storage.setItem<ShopI>('activeShop', shop);
    } catch (e) {
      throw e;
    }
  }

  async getCurrentProjectId(): Promise<string> {
    try {
      return await this._storage.getItem<string>('cPID');
    } catch (e) {
      throw e;
    }
  }

  async saveCurrentProjectId(projectId: string): Promise<any> {
    try {
      return await this._storage.setItem<string>('cPID', projectId);
    } catch (e) {
      throw e;
    }
  }

  async clearSsmStorage(): Promise<any> {
    try {
      return await this._storage.clear();
    } catch (e) {
      throw e;
    }
  }

  async saveActiveUser(user: UserI): Promise<any> {
    try {
      return await this._storage.setItem<UserI>('user', user);
    } catch (e) {
      throw e;
    }
  }

  async removeActiveShop(): Promise<any> {
    try {
      return await this._storage.removeItem('activeShop');
    } catch (e) {
      throw e;
    }
  }

  async removeActiveUser(): Promise<any> {
    try {
      return await this._storage.removeItem('user');
    } catch (e) {
      throw e;
    }
  }

  async removeStocks(): Promise<any> {
    try {
      return await this._storage.removeItem('stocks');
    } catch (e) {
      throw e;
    }
  }
}
