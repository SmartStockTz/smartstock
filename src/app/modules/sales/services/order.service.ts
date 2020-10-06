import { Injectable } from '@angular/core';
import { BFast } from 'bfastjs';
import { StorageService } from '../../lib/services/storage.service';
import { toSqlDate } from '../../lib/utils/date.util';
import { SecurityUtil } from '../../lib/utils/security.util';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'any'
})
export class OrderService {

  constructor(private readonly storageService: StorageService,
    ) {
  }

  async getOrders(size = 20, skip = 0): Promise<OrderModel[]> {
    const shop = await this.storageService.getActiveShop();
    const orders = await BFast.database(shop.projectId).collection('orders')
      .query()
      .skip(skip)
      .size(size)
      .orderBy('_created_at', -1)
      .find<OrderModel[]>();
    return orders.map<OrderModel>(x => {
      x.displayName = x.user.displayName;
      return x;
    });
  }

  async markOrderIsPaid(orderId: string) {
    // console.log(orderId);
    return BFast.database().collection('orders')
      .query()
      .byId(orderId)
      .updateBuilder()
      .set('paid', true)
      .update();
  }

  async markAsCompleted(order: OrderModel) {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).transaction()
      .update('orders', {
        query: {
          id: order.id,
        },
        update: {
          $set: {
            'paid': true,
            'status': 'COMPLETED'
          }
        }
      })
      .create('sales', order.carts.map(x => {
        const quantity = x.quantity;
        return {
          amount: quantity * x.product.retailPrice,
          discount: 0,
          quantity: quantity,
          product: x.product.product,
          category: x.product.category,
          unit: x.product.unit,
          channel: "online",
          date: toSqlDate(new Date()),
          idTra: "n",
          user: "online",
          batch: SecurityUtil.generateUUID(),
          stockId: x.product.id
        }
      }))
      .update('stocks', order.carts
        .filter(x => x.product.stockable === true)
        .map(y => {
          return {
            query: {
              id: y.product.id,
            },
            update: {
              $inc: {
                'quantity': -Number(y.quantity),
              }
            }
          }
        })).commit();
  }

  async checkOrderIsPaid(order: string): Promise<any> {
    const payments = await BFast.functions('fahamupay')
      .request(`/functions/pay/check/${order}`)
      .get<any[]>();
    return payments.map(x => Math.round(Number(x.amount))).reduce((a, b) => a + b, 0);
  }
}
