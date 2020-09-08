import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '../../lib/services/storage.service';
import {OrderModel} from '../models/order.model';

@Injectable({
  providedIn: 'any'
})
export class OrderService {

  constructor(private readonly storageService: StorageService) {
  }

  async getOrders(size = 20, skip = 0): Promise<OrderModel[]> {
    const shop = await this.storageService.getActiveShop();
    const orders = await BFast.database(shop.projectId).collection('orders')
      .query()
      .skip(skip)
      .size(size)
      .find<OrderModel[]>();
    return orders.map<OrderModel>(x => {
      x.displayName = x.user.displayName;
      return x;
    });
  }

  async checkOrderIsPaid(order: string): Promise<any> {
    const payments = await BFast.functions('fahamupay')
      .request(`/functions/pay/check/${order}`)
      .get<any[]>();
    return payments.map(x => Math.round(Number(x.amount))).reduce((a, b) => a + b, 0);
  }
}
