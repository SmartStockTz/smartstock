import {Injectable} from '@angular/core';
import {StockDataSource} from '../database/connector/StockDataSource';
import {CategoryI} from '../model/CategoryI';
import {Stock} from '../model/stock';
import {SupplierI} from '../model/SupplierI';
import {AngularFirestore} from '@angular/fire/firestore';
import {NgForage} from 'ngforage';

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService implements StockDataSource {

  constructor(private firestore: AngularFirestore, private indexDb: NgForage) {
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  addAllStock(stocks: Stock[], callback: (value: any) => void) {
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  addCategory(category: CategoryI, callback?: (value: any) => void) {
  }

  addStock(stock: Stock, callback?: (value: any) => void) {
    if (stock.id === 'newS') {
      const documentReference = this.firestore.collection('stocks').ref.doc();
      stock.id = documentReference.id;
      documentReference.set(stock).then(value => {
        callback('Done insert stock value is : ' + value);
      }).catch(reason => {
        console.log(reason);
        callback(null);
      });
    } else {
      this.updateStock(stock, value => {
        if (value === null) {
          callback(null);
        } else {
          callback(value);
        }
      });
    }
  }

  addSupplier(supplier: SupplierI, callback: (value: any) => void) {
  }

  deleteAllCategory(categories: CategoryI[], callback: (value: any) => void) {
  }

  deleteAllStock(stocks: Stock[], callback?: (value: any) => void) {
  }

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void) {
  }

  deleteCategory(category: CategoryI, callback?: (value: any) => void) {
  }

  deleteStock(stock: Stock, callback?: (value: any) => void) {
    this.firestore.collection('stocks').doc(stock.id).delete().then(value => {
      callback(' Done delete stock with value : ' + value);
    }).catch(reason => {
      callback(null);
      console.log(reason);
    });
  }

  deleteSupplier(supplier: SupplierI, callback?: (value: any) => void) {
  }

  getAllCategory(callback: (categories: CategoryI[]) => void) {
  }

  getAllStock(callback: (stocks: Stock[]) => void) {

    this.indexDb.getItem('stocks').then(value => {
      callback(<Stock[]>value);
    }).catch(reason => {
      console.log(reason);
    });

    // this.firestore.collection<Stock>('stocks').snapshotChanges().subscribe(value => {
    //   if (value.length > 0) {
    //     const st: Stock[] = [];
    //     value.forEach(value1 => {
    //       st.push(value1.payload.doc.data());
    //     });
    //     callback(st);
    //   }
    // }, error1 => {
    //   console.log(error1);
    // });
  }

  getAllSupplier(callback: (suppliers: SupplierI[]) => void) {
  }

  getCategory(id: string, callback: (category: CategoryI) => void) {
  }

  getStock(id: string, callback: (stock: Stock) => void) {
  }

  getSupplier(id: string, callback: (supplier: SupplierI) => void) {
  }

  updateAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  updateAllStock(stocks: Stock[], callback?: (value: any) => void) {
  }

  updateAllSupplier(callback?: (value: any) => void) {
  }

  updateCategory(category: CategoryI, callback?: (value: any) => void) {
  }

  updateStock(stock: Stock, callback?: (value: any) => void) {
    this.firestore.collection('stocks').doc(stock.id).update(stock).then(value => {
      callback('done update with value : ' + value);
    }).catch(reason => {
      console.log(reason);
      callback(null);
    });
  }

  updateSupplier(id: string, callback?: (value: any) => void) {
  }
}
