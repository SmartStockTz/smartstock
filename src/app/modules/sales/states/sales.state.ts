import {Injectable} from '@angular/core';
import {SalesModel} from '../models/sale.model';
import {OrderModel} from '../models/order.model';
import {BatchModel} from '../models/batch.model';
import {StorageService} from '../../lib/services/storage.service';
import {StockModel} from '../models/stock.model';
import {BFast} from 'bfastjs';
import {SecurityUtil} from '../../lib/utils/security.util';

@Injectable({
  providedIn: 'any'
})
export class SalesState {

  constructor(private readonly _storage: StorageService) {
  }

  async getSalesByUser(userId: string, channel: string): Promise<SalesModel[]> {
    return Promise.reject('not implemented');
  }

  async saveOrder(order: OrderModel): Promise<OrderModel> {
    return Promise.reject('not implemented');
  }

  async saveOrders(orders: OrderModel[]): Promise<any> {
    return Promise.reject('not implemented');
  }

  async deleteOrder(orderId: string): Promise<any> {
    return Promise.reject('not implemented');
  }

  async getOrders(): Promise<OrderModel[]> {
    return Promise.reject('not implemented');
  }

  async getOrder(id: string): Promise<OrderModel> {
    return Promise.reject('not implemented');
  }

  async updateOrder(orderId: string, order: OrderModel): Promise<OrderModel> {
    return Promise.reject('not implemented');
  }

  async saveSales(sales: SalesModel[], cartId: string): Promise<any> {
    const batchs: BatchModel[] = [];
    sales.forEach(sale => {
      sale.cartId = cartId;
      sale.batch = SecurityUtil.generateUUID();
      batchs.push({
        method: 'POST',
        body: sale,
        path: '/classes/sales'
      });
    });
    return await this._storage.saveSales(batchs);
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this._storage.getActiveShop();
    // const totalStock = await BFast.database(shop.projectId)
    //   .collection('stocks')
    //   .query()
    //   .count({}, {cacheEnable: false, dtl: 0});
    const stocks: StockModel[] = await BFast.database(shop.projectId)
      .collection<StockModel>('stocks')
      .getAll<StockModel>(undefined, {
        cacheEnable: false,
        dtl: 0
      });
    await this._storage.saveStocks(stocks);
    // stocks.sort((a, b) => {
    //   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    // });
    return stocks;
  }

}
