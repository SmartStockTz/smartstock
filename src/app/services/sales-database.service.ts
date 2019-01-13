import {Injectable} from '@angular/core';
import {SalesDatasource} from '../database/connector/SalesDatasource';
import {CashSaleI} from '../model/CashSale';
import {AngularFirestore} from '@angular/fire/firestore';
import {OrderI} from '../model/OderI';
import {HttpClient} from '@angular/common/http';
import {NgForage} from 'ngforage';
import {CartI} from '../model/cart';
import * as Parse from 'node_modules/parse';

Parse.initialize('ssm');
Parse.serverURL = 'http://localhost:3000/parse';

@Injectable({
  providedIn: 'root'
})
export class SalesDatabaseService implements SalesDatasource {
  private serverUrl = 'http://localhost:3000/parse/classes';
  private query = new Parse.Query('sales');
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
    if (sales.length < 50) {
      sales.forEach(sale => {
        this.httpClient.post<CashSaleI>(this.serverUrl + '/sales', sale, {
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
      });
    }
  }

  async addWholeCashSale(sale: CashSaleI[], callback: (value: any) => void) {
    // const writeBatch = this.firestore.firestore.batch();
    // sale.forEach(value => {
    //   const newVar = this.firestore.collection<CashSaleI>('sales').ref.doc();
    //   value.id = newVar.id;
    //   writeBatch.set(newVar, value, {merge: true});
    // });
    // await writeBatch.commit();
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
      this.httpClient.get(this.serverUrl + '/sales', {
        headers: {
          'X-Parse-Application-Id': 'ssm'
        },
        params: {
          'where': '{ "user":"' + id + '", "date":"' + SalesDatabaseService.getCurrentDate() + '", "channel":"retail" }',
          'limit': '10000000'
        }
      }).subscribe(value => {
        console.log(value);
      }, error1 => console.log(error1));
    });

    // return this.firestore.collection('sales').ref
    //   .where('user', '==', id)
    //   .where('date', '==', SalesDatabaseService.getCurrentDate())
    //   .where('channel', '==', 'retail').onSnapshot(value => {
    //     const arrayD: CashSaleI[] = [];
    //     value.forEach(value2 => {
    //       arrayD.push({
    //         product: value2.get('product'),
    //         amount: value2.get('amount'),
    //         id: value2.get('id'),
    //         user: value2.get('user'),
    //         idTra: value2.get('idTra'),
    //         date: value2.get('date'),
    //         channel: value2.get('channel'),
    //         unit: value2.get('unit'),
    //         category: value2.get('category'),
    //         quantity: value2.get('quantity'),
    //         discount: value2.get('discount'),
    //         stockId: value2.get('stockId')
    //       });
    //     });
    //     results(arrayD);
    //   }, error1 => {
    //     console.log(error1);
    //     results([]);
    //   });
  }

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void) {
    return this.firestore.collection('sales').ref;
    // .where('user', '==', id)
    // .where('date', '==', SalesDatabaseService.getCurrentDate())
    // .where('channel', '==', 'whole').onSnapshot(value => {
    //   const arrayD: CashSaleI[] = [];
    //   value.forEach(value2 => {
    //     arrayD.push({
    //       product: value2.get('product'),
    //       amount: value2.get('amount'),
    //       id: value2.get('id'),
    //       user: value2.get('user'),
    //       idTra: value2.get('idTra'),
    //       date: value2.get('date'),
    //       channel: value2.get('channel'),
    //       unit: value2.get('unit'),
    //       category: value2.get('category'),
    //       quantity: value2.get('quantity'),
    //       discount: value2.get('discount'),
    //       stockId: value2.get('stockId')
    //     });
    //   });
    //   results(arrayD);
    // }, error1 => {
    //   console.log(error1);
    //   results([]);
    // });
  }

  addOrder(order: OrderI, callback?: (value) => void) {
    const documentReference = this.firestore.collection('orders').ref.doc();
    order.id = documentReference.id;
    documentReference.set(order, {merge: true}).then(value => {
      callback('Done insert data');
    }).catch(reason => {
      callback(null);
      console.log(reason);
    });
  }

  addOrders(orders: OrderI[], callback?: (value) => void) {
  }

  deleteOrder(order: OrderI, callback?: (value) => void) {
    this.firestore.collection('orders').doc(order.id).delete().then(value => {
      callback('Done delete');
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
  }

  getAllOrders(callback: (orders: OrderI[]) => void) {
    this.firestore.collection('orders').ref
      .where('complete', '==', false)
      .onSnapshot(value => {
        const ords: OrderI[] = [];
        value.forEach(value1 => {
          ords.push({
            date: value1.get('date'),
            customer: value1.get('customer'),
            amount: value1.get('amount'),
            cart: value1.get('cart'),
            complete: value1.get('complete'),
            id: value1.get('id')
          });
        });
        callback(ords);
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
