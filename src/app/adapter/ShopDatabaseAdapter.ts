import {ShopI} from '../model/ShopI';

export interface ShopDatabaseAdapter {
  createShop(shop: ShopI): Promise<ShopI>;
}
