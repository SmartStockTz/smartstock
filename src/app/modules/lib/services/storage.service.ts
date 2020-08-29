import {Injectable} from '@angular/core';
import {UserModel} from '../../account/models/user.model';
import {ShopModel} from '../../account/models/shop.model';
import {BatchModel} from '../../sales/models/batch.model';
import {EventService} from './event.service';
import {BFast} from 'bfastjs';
import {CustomerModel} from '../../sales/models/customer.model';
import {StockModel} from '../../stocks/models/stock.model';
import {SecurityUtil} from '../utils/security.util';
import {SsmEvents} from '../utils/eventsNames.util';
import {CacheController} from 'bfastjs/dist/controllers/CacheController';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  smartStockCache: CacheController = BFast.cache({database: 'smartstock', collection: 'config'});

  constructor(private readonly eventApi: EventService) {
  }

  async getActiveUser(): Promise<UserModel> {
    return await BFast.auth().currentUser();
  }

  async saveSales(batchs: BatchModel[]): Promise<any> {
    const activeShop = await this.getActiveShop();
    await BFast.cache({database: 'sales', collection: activeShop.projectId})
      .set<BatchModel[]>(SecurityUtil.randomString(12), batchs, {
        dtl: 720
      });
  }

  async getActiveShop(): Promise<ShopModel> {
    const response = await this.smartStockCache.get<ShopModel>('activeShop');
    if (response) {
      return response;
    } else {
      throw {message: 'No Active Shop'};
    }
  }

  async saveActiveShop(shop: ShopModel): Promise<any> {
    const response = await this.smartStockCache.set<ShopModel>('activeShop', shop, {
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

  async saveActiveUser(user: UserModel): Promise<any> {
    try {
      return await BFast.auth().setCurrentUser<UserModel>(user);
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

  async getStocks(): Promise<StockModel[]> {
    const shop = await this.getActiveShop();
    const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    return await stocksCache.get<StockModel[]>('all');
  }

  async saveStocks(stocks: StockModel[]): Promise<any> {
    const shop = await this.getActiveShop();
    const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    return await stocksCache.set('all', stocks, {
      dtl: 360
    });
  }

  async saveStock(stock: StockModel): Promise<StockModel> {
    // const shop = await this.getActiveShop();
    // const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    // return stocksCache.set(stock.id, stock);
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
