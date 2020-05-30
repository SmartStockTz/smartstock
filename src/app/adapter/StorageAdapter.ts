import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {BatchModel} from '../model/batchModel';
import {Stock} from '../model/stock';
import {CustomerModel} from '../model/CustomerModel';

export interface StorageAdapter {
  getActiveUser(): Promise<UserI>;

  saveActiveUser(user: UserI): Promise<any>;

  removeActiveUser(): Promise<any>;

  saveSales(batchs: BatchModel[]): Promise<any>;

  getActiveShop(): Promise<ShopI>;

  saveActiveShop(shop: ShopI): Promise<any>;

  removeActiveShop(): Promise<any>;

  saveCurrentProjectId(projectId: string): Promise<any>;

  getCurrentProjectId(): Promise<string>;

  clearSmartStockCache(): Promise<any>;

  removeStocks(): Promise<any>;

  getStocks(): Promise<Stock[]>;

  saveStocks(stocks: Stock[]): Promise<any>;

  saveStock(stock: Stock): Promise<Stock>;

  saveCustomer(customer: CustomerModel): Promise<CustomerModel>;

  getCustomers(): Promise<CustomerModel[]>;
}
