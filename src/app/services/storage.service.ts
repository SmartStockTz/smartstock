import {Injectable} from '@angular/core';
import {StorageAdapter} from '../adapter/StorageAdapter';
import {UserI} from '../model/UserI';
import {ShopI} from '../model/ShopI';
import {BatchModel} from '../model/batchModel';
import {Stock} from '../model/stock';
import {SsmEvents} from '../utils/eventsNames';
import {EventApiService} from './event-api.service';
import {BFast} from 'bfastjs';
import {CacheAdapter} from 'bfastjs/dist/src/adapters/CacheAdapter';
import {Security} from '../utils/security';
import {CustomerModel} from '../model/CustomerModel';


@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageAdapter {
  smartStockCache: CacheAdapter = BFast.cache({database: 'smartstock', collection: 'config'});

  constructor(private readonly eventApi: EventApiService) {
  }

  async getActiveUser(): Promise<UserI> {
    return await BFast.auth().currentUser();
  }

  async saveSales(batchs: BatchModel[]): Promise<any> {
    const activeShop = await this.getActiveShop();
    await BFast.cache({database: 'sales', collection: activeShop.projectId})
      .set<BatchModel[]>(Security.randomString(12), batchs, {
        dtl: 720
      });
  }

  async getActiveShop(): Promise<ShopI> {
    const response = await this.smartStockCache.get<ShopI>('activeShop');
    if (response) {
      return response;
    } else {
      throw {message: 'No Active Shop'};
    }
  }

  async saveActiveShop(shop: ShopI): Promise<any> {
    const response = await this.smartStockCache.set<ShopI>('activeShop', shop, {
      dtl: 7
    });
    this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_SET);
    return response;
  }

  async getCurrentProjectId(): Promise<string> {
    return await this.smartStockCache.get<string>('cPID');
  }

  async saveCurrentProjectId(projectId: string): Promise<any> {
    return await this.smartStockCache.set<string>('cPID', projectId, {
      dtl: 7
    });
  }

  async clearSmartStockCache(): Promise<any> {
    return await this.smartStockCache.clearAll();
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
    const response = await this.smartStockCache.set('activeShop', undefined);
    this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
    return response;
  }

  async removeActiveUser(): Promise<any> {
    return await BFast.auth().setCurrentUser(undefined);
  }

  async removeStocks(): Promise<any> {
    const shop = await this.getActiveShop();
    return await BFast.cache({database: 'stocks', collection: shop.projectId}).clearAll();
  }

  async getStocks(): Promise<Stock[]> {
    const shop = await this.getActiveShop();
    const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    return await stocksCache.get<Stock[]>('all');
  }

  async saveStocks(stocks: Stock[]): Promise<any> {
    const shop = await this.getActiveShop();
    const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    return await stocksCache.set('all', stocks, {
      dtl: 360
    });
  }

  async saveStock(stock: Stock): Promise<Stock> {
    // const shop = await this.getActiveShop();
    // const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    // return stocksCache.set(stock.objectId, stock);
    return undefined;
  }

  async getCustomers(): Promise<CustomerModel[]> {
    const shop = await this.getActiveShop();
    const customersCache = BFast.cache({database: 'customers', collection: shop.projectId});
    const customersKey = await customersCache.keys();
    const customers = [];
    for (const key of customersKey) {
      customers.push(await customersCache.get<CustomerModel>(key));
    }
    return customers;
  }

  async saveCustomer(customer: CustomerModel): Promise<CustomerModel> {
    const shop = await this.getActiveShop();
    const customersCache = BFast.cache({database: 'customers', collection: shop.projectId});
    return await customersCache.set<CustomerModel>(customer.displayName, customer, {
      dtl: 360
    });
  }

}
