import {UserI} from '../model/UserI';

export interface StorageAdapter {
  getActiveUser(): Promise<UserI>;
}
