import {UserI} from '../model/UserI';
import {CashSaleI} from '../model/CashSale';
import {ShopI} from '../model/ShopI';

export interface StorageAdapter {
  getActiveUser(): Promise<UserI>;

  saveSales(sales: CashSaleI[]): Promise<any>;

  getActiveShop(): Promise<ShopI>;

  saveActiveShop(shop: ShopI): Promise<any>;
}
