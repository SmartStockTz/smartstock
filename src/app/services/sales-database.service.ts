import {Injectable} from '@angular/core';
import {SalesDatasource} from '../database/connector/SalesDatasource';
import {CashSaleI} from '../model/CashSale';
import {AngularFirestore} from '@angular/fire/firestore';
import {OrderI} from '../model/OderI';
import {HttpClient} from '@angular/common/http';
import {NgForage} from 'ngforage';
import {CartI} from '../model/cart';
import * as Parse from 'node_modules/parse';
import {BatchI} from '../model/batchI';

Parse.initialize('ssm');
Parse.serverURL = 'http://localhost:3000/parse';

@Injectable({
  providedIn: 'root'
})
export class SalesDatabaseService implements SalesDatasource {
  private serverUrl = 'http://localhost:3000/parse/classes';
  private query = new Parse.Query('sales');
  private orderQuery = new Parse.Query('orders');
  private ordersSubscription = this.orderQuery.subscribe();
  private subscription = this.query.subscribe();

  constructor(private firestore: AngularFirestore,
              private indexDb: NgForage,
              private httpClient: HttpClient) {
  }

  static getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString(10);
    let day = (date.getDate()).toString(10);
    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }
    return year + '-' + month + '-' + day;
  }

  addAllCashSale(sales: CashSaleI[], callback: (value: any) => void) {
    const batchs: BatchI[] = [];
    sales.forEach(value => {
      batchs.push({
        method: 'POST',
        body: value,
        path: '/parse/classes/sales'
      });
    });
    this.httpClient.post<BatchI[]>('http://localhost:3000/parse/batch', {
        'requests': batchs
      },
      {
        headers: {
          'X-Parse-Application-Id': 'ssm'
        }
      }
    ).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addWholeCashSale(sale: CashSaleI[], callback: (value: any) => void) {
    if (sale.length <= 50) {
      const batchs: BatchI[] = [];
      sale.forEach(value => {
        batchs.push({
          method: 'POST',
          body: value,
          path: '/parse/classes/sales'
        });
      });
      this.httpClient.post<BatchI[]>('http://localhost:3000/parse/batch', {
          'requests': batchs
        },
        {
          headers: {
            'X-Parse-Application-Id': 'ssm'
          }
        }
      ).subscribe(value => {
        callback(value);
      }, error1 => {
        console.log(error1);
        callback(null);
      });
    } else {
      console.log('sales cant fit in batch');
      callback('BE');
    }
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
    this.subscription.on('open', () => {
      console.log('sales socket created');
      this.getSales(id, results);
    });
    this.subscription.on('create', value => {
      this.getSales(id, results);
    });
    this.subscription.on('update', value => {
      this.getSales(id, results);
    });
    this.subscription.on('delete', value => {
      this.getSales(id, results);
    });
  }

  private getSales(id: string, res: any) {
    this.httpClient.get<any>(this.serverUrl + '/sales', {
      headers: {
        'X-Parse-Application-Id': 'ssm'
      },
      params: {
        'where': '{ "user":"' + id + '", "date":"' + SalesDatabaseService.getCurrentDate() + '", "channel":"retail" }',
        'limit': '10000000'
      }
    }).subscribe(value => {
      res(value.results);
    }, error1 => {
      console.log(error1);
      res([]);
    });
  }

  private getWholeSale(id: string, res: any) {
    this.httpClient.get<any>(this.serverUrl + '/sales', {
      headers: {
        'X-Parse-Application-Id': 'ssm'
      },
      params: {
        'where': '{ "user":"' + id + '", "date":"' + SalesDatabaseService.getCurrentDate() + '", "channel":"whole" }',
        'limit': '10000000'
      }
    }).subscribe(value => {
      res(value.results);
    }, error1 => {
      console.log(error1);
      res([]);
    });
  }

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void) {
    this.subscription.on('open', () => {
      console.log('sales socket created');
      this.getWholeSale(id, results);
    });
    this.subscription.on('create', value => {
      this.getWholeSale(id, results);
    });
    this.subscription.on('update', value => {
      this.getWholeSale(id, results);
    });
    this.subscription.on('delete', value => {
      this.getWholeSale(id, results);
    });
  }

  addOrder(order: OrderI, callback?: (value) => void) {
    order.idOld = this.firestore.createId();
    this.httpClient.post<OrderI>(this.serverUrl + '/orders', order, {
      headers: {
        'X-Parse-Application-Id': 'ssm',
        'Content-Type': 'application/json'
      }
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addOrders(orders: OrderI[], callback?: (value) => void) {
  }

  deleteOrder(order: OrderI, callback?: (value) => void) {
    this.httpClient.delete(this.serverUrl + '/orders/' + order.objectId, {
      headers: {
        'X-Parse-Application-Id': 'ssm'
      }
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getAllOrders(callback: (orders: OrderI[]) => void) {
    this.ordersSubscription.on('open', () => {
      console.log('order socket connected');
      this.getOrders(callback);
    });
    this.ordersSubscription.on('create', value => {
      console.log('new order saved');
      this.getOrders(callback);
    });
    this.ordersSubscription.on('update', value => {
      this.getOrders(callback);
    });
    this.ordersSubscription.on('delete', value => {
      this.getOrders(callback);
    });
  }

  private getOrders(res: any) {
    this.httpClient.get<any>(this.serverUrl + '/orders', {
      headers: {
        'X-Parse-Application-Id': 'ssm'
      },
      params: {
        'limit': '100000'
      }
    }).subscribe(value => {
      res(value.results);
    }, error1 => {
      console.log(error1);
      res(null);
    });
  }

  getOrder(id: string, callback: (order: OrderI) => void) {
  }

  updateOrder(order: OrderI, callback?: (value) => void) {
    // this.firestore.collection<OrderI>('orders').doc(order.id)
  }

  addCashSale(sale: CashSaleI, callback: (value: any) => void) {
  }

  addCashSaleToCache(sales: CartI[], callback: (value: any) => void) {
    this.indexDb.setItem<CartI[]>('cart', sales).then(value => {
      console.log('saved sales are ---> ' + value.length);
      callback('Ok');
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
  }
}
