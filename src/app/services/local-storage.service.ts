import {Injectable} from '@angular/core';
import {StorageAdapter} from '../adapter/StorageAdapter';
import {UserI} from '../model/UserI';
import {NgForage} from 'ngforage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StorageAdapter {

  constructor(private readonly _storage: NgForage) {
  }

  async getActiveUser(): Promise<UserI> {
    return await this._storage.getItem<UserI>('user');
  }
}
