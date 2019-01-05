import {Injectable} from '@angular/core';
import {SalesDatasource} from '../database/connector/SalesDatasource';
import {CashSaleI} from '../model/CashSale';
import {DatabaseCallback} from '../database/DatabaseCallback';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SalesDatabaseService implements SalesDatasource {

  constructor(private firestore: AngularFirestore) {
  }

  async addCashSale(sale: CashSaleI, callback?: DatabaseCallback) {
    await this.firestore.collection<CashSaleI>('sales').ref.doc().set(sale, {merge: true});
  }

  deleteCashSale(sale: CashSaleI, callback?: DatabaseCallback) {
  }

  getAllCashSale(callback?: DatabaseCallback) {
  }

  getCashSale(id: string, callback?: DatabaseCallback) {
  }

  updateCashSale(sale: CashSaleI, callback?: DatabaseCallback) {
  }
}
