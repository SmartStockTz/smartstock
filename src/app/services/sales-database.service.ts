import {Injectable} from '@angular/core';
import {SalesDatasource} from '../adapter/SalesDatasource';
import {SalesModel} from '../model/CashSale';
import {OrderModel} from '../model/OderI';
import {BatchModel} from '../model/batchModel';
import {StorageService} from './storage.service';
import {Security} from '../utils/security';

@Injectable()
export class SalesDatabaseService implements SalesDatasource {

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
      sale.batch = Security.generateUUID();
      batchs.push({
        method: 'POST',
        body: sale,
        path: '/classes/sales'
      });
    });
    return await this._storage.saveSales(batchs);
  }

}
