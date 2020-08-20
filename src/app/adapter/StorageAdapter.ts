import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {BatchModel} from '../model/batchModel';
import {CustomerModel} from '../model/CustomerModel';
import {StockModel} from '../modules/stocks/models/stock.model';

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

  getStocks(): Promise<StockModel[]>;

  saveStocks(stocks: StockModel[]): Promise<any>;

  saveStock(stock: StockModel): Promise<StockModel>;

  saveCustomer(customer: CustomerModel): Promise<CustomerModel>;

  getCustomers(): Promise<CustomerModel[]>;
}
