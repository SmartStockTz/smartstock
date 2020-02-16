import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {BatchI} from '../model/batchI';

export interface StorageAdapter {
  getActiveUser(): Promise<UserI>;

  saveActiveUser(user: UserI): Promise<any>;

  removeActiveUser(): Promise<any>;

  saveSales(batchs: BatchI[]): Promise<any>;

  getActiveShop(): Promise<ShopI>;

  saveActiveShop(shop: ShopI): Promise<any>;

  removeActiveShop(): Promise<any>;

  saveCurrentProjectId(projectId: string): Promise<any>;

  getCurrentProjectId(): Promise<string>;

  clearSsmStorage(): Promise<any>;

  removeStocks(): Promise<any>;
}
