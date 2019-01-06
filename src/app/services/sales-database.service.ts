import {Injectable} from '@angular/core';
import {SalesDatasource} from '../database/connector/SalesDatasource';
import {CashSaleI} from '../model/CashSale';
import {DatabaseCallback} from '../database/DatabaseCallback';
import {AngularFirestore} from '@angular/fire/firestore';
import {OrderI} from '../model/OderI';

@Injectable({
  providedIn: 'root'
})
export class SalesDatabaseService implements SalesDatasource {

  constructor(private firestore: AngularFirestore) {
  }

  static getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + '-' + month + '-' + day;
  }

  async addCashSale(sale: CashSaleI[], callback?: DatabaseCallback) {
    const writeBatch = this.firestore.firestore.batch();
    const updateBatch = this.firestore.firestore.batch();
    sale.forEach(value => {
      const newVar = this.firestore.collection<CashSaleI>('sales').ref.doc();
      value.id = newVar.id;
      writeBatch.set(newVar, value, {merge: true});
    });
    await writeBatch.commit();
  }

  async addWholeCashSale(sale: CashSaleI[], callback?: DatabaseCallback) {
    const writeBatch = this.firestore.firestore.batch();
    sale.forEach(value => {
      const newVar = this.firestore.collection<CashSaleI>('sales').ref.doc();
      value.id = newVar.id;
      writeBatch.set(newVar, value, {merge: true});
    });
    await writeBatch.commit();
  }

  deleteCashSale(sale: CashSaleI, callback?: DatabaseCallback) {
  }

  getAllCashSale(callback?: DatabaseCallback) {
  }

  getCashSale(id: string, callback?: DatabaseCallback) {
  }

  updateCashSale(sale: CashSaleI, callback?: DatabaseCallback) {
  }

  getAllCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void, callback?: DatabaseCallback) {
    return this.firestore.collection('sales').ref
      .where('user', '==', id)
      .where('date', '==', SalesDatabaseService.getCurrentDate())
      .where('channel', '==', 'retail').onSnapshot(value => {
        const arrayD: CashSaleI[] = [];
        value.forEach(value2 => {
          arrayD.push({
            product: value2.get('product'),
            amount: value2.get('amount'),
            id: value2.get('id'),
            user: value2.get('user'),
            idTra: value2.get('idTra'),
            date: value2.get('date'),
            channel: value2.get('channel'),
            unit: value2.get('unit'),
            category: value2.get('category'),
            quantity: value2.get('quantity'),
            discount: value2.get('discount')
          });
        });
        results(arrayD);
      }, error1 => {
        console.log(error1);
        results([]);
      });
  }

  getAllWholeCashSaleOfUser(id: string, results: (datasource: CashSaleI[]) => void, callback?: DatabaseCallback) {
    return this.firestore.collection('sales').ref
      .where('user', '==', id)
      .where('date', '==', SalesDatabaseService.getCurrentDate())
      .where('channel', '==', 'whole').onSnapshot(value => {
        const arrayD: CashSaleI[] = [];
        value.forEach(value2 => {
          arrayD.push({
            product: value2.get('product'),
            amount: value2.get('amount'),
            id: value2.get('id'),
            user: value2.get('user'),
            idTra: value2.get('idTra'),
            date: value2.get('date'),
            channel: value2.get('channel'),
            unit: value2.get('unit'),
            category: value2.get('category'),
            quantity: value2.get('quantity'),
            discount: value2.get('discount')
          });
        });
        results(arrayD);
      }, error1 => {
        console.log(error1);
        results([]);
      });
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
}
