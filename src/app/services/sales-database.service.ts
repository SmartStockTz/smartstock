import {Injectable} from '@angular/core';
import {SalesDatasource} from '../adapter/SalesDatasource';
import {CashSaleI} from '../model/CashSale';
import {OrderI} from '../model/OderI';
import {NgForage} from 'ngforage';
import {CartI} from '../model/cart';
import {BatchI} from '../model/batchI';
import {randomString} from '../adapter/ParseBackend';
import {ShopI} from '../model/ShopI';

@Injectable({
  providedIn: 'root'
})
export class SalesDatabaseService implements SalesDatasource {

  constructor(private indexDb: NgForage) {
  }

  addAllCashSale(sales: CashSaleI[]): Promise<any> {
    console.log(sales);
    return new Promise<any>(async (resolve, reject) => {
      try {
        const batchs: BatchI[] = [];
        sales.forEach(value => {
          batchs.push({
            method: 'POST',
            body: value,
            path: '/classes/sales'
          });
        });
        const activeShop = await this.indexDb.getItem<ShopI>('activeShop');
        this.indexDb
          .clone({name: activeShop.projectId + '_sales'})
          .setItem<BatchI[]>(randomString(8), batchs).then(_ => {
          resolve('Ok');
        }).catch(reason => {
          console.log(reason);
          reject(null);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  addWholeCashSale(sale: CashSaleI[]): Promise<any> {
    return this.addAllCashSale(sale);
  }

  deleteCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  getAllCashSale(callback: (sales: CashSaleI[]) => void) {
  }

  getCashSale(id: string, callback: (sale: CashSaleI) => void) {
  }

  updateCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  getAllCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void) {
    // this.subscription.on('open', () => {
    //   console.log('sales socket created');
    //   this.getSales(id, results);
    // });
    // this.subscription.on('create', value => {
    //   this.getSales(id, results);
    // });
    // this.subscription.on('update', value => {
    //   this.getSales(id, results);
    // });
    // this.subscription.on('delete', value => {
    //   this.getSales(id, results);
    // });
  }

  private getSales(id: string, res: any) {
    // this.httpClient.get<any>(this.serverUrl + '/classes/sales', {
    //   headers: this.getHeader,
    //   params: {
    //     'where': '{ "user":"' + id + '", "date":"' + toSqlDate(new Date()) + '", "channel":"retail" }',
    //     'limit': '10000000'
    //   }
    // }).subscribe(value => {
    //   res(value.results);
    // }, error1 => {
    //   console.log(error1);
    //   res([]);
    // });
  }

  private getWholeSale(id: string, res: any) {
    // this.httpClient.get<any>(this.serverUrl + '/classes/sales', {
    //   headers: this.getHeader,
    //   params: {
    //     'where': '{ "user":"' + id + '", "date":"' + toSqlDate(new Date()) + '", "channel":"whole" }',
    //     'limit': '10000000'
    //   }
    // }).subscribe(value => {
    //   res(value.results);
    // }, error1 => {
    //   console.log(error1);
    //   res([]);
    // });
  }

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void) {
    // this.subscription.on('open', () => {
    //   console.log('sales socket created');
    //   this.getWholeSale(id, results);
    // });
    // this.subscription.on('create', value => {
    //   this.getWholeSale(id, results);
    // });
    // this.subscription.on('update', value => {
    //   this.getWholeSale(id, results);
    // });
    // this.subscription.on('delete', value => {
    //   this.getWholeSale(id, results);
    // });
  }

  addOrder(order: OrderI, callback?: (value) => void) {
    // order.idOld = randomString(8);
    // this.httpClient.post<OrderI>(this.serverUrl + '/classes/orders', order, {
    //   headers: this.postHeader
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  addOrders(orders: OrderI[], callback?: (value) => void) {
  }

  deleteOrder(order: OrderI, callback?: (value) => void) {
    // this.httpClient.delete(this.serverUrl + '/classes/orders/' + order.objectId, {
    //   headers: {
    //     'X-Parse-Application-Id': 'lbpharmacy'
    //   }
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  getAllOrders(callback: (orders: OrderI[]) => void) {
    // this.ordersSubscription.on('open', () => {
    //   console.log('order socket connected');
    //   this.getOrders(callback);
    // });
    // this.ordersSubscription.on('create', value => {
    //   console.log('new order saved');
    //   this.getOrders(callback);
    // });
    // this.ordersSubscription.on('update', value => {
    //   this.getOrders(callback);
    // });
    // this.ordersSubscription.on('delete', value => {
    //   this.getOrders(callback);
    // });
  }

  private getOrders(res: any) {
    // this.httpClient.get<any>(this.serverUrl + '/classes/orders', {
    //   headers: this.getHeader,
    //   params: {
    //     'limit': '100000'
    //   }
    // }).subscribe(value => {
    //   res(value.results);
    // }, error1 => {
    //   console.log(error1);
    //   res(null);
    // });
  }

  getOrder(id: string, callback: (order: OrderI) => void) {
  }

  updateOrder(order: OrderI, callback?: (value) => void) {
    // this.firestore.collection<OrderI>('orders').doc(order.id)
  }

  addCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  addCashSaleToCache(sales: CartI[], callback: (value: any) => void) {
    // this.indexDb.setItem<CartI[]>('cart', sales).then(value => {
    //   console.log('saved sales are ---> ' + value.length);
    //   callback('Ok');
    // }).catch(reason => {
    //   console.log(reason);
    //   callback(null);
    // });
    callback('Ok');
  }
}
