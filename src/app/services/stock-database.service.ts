import {Injectable} from '@angular/core';
import {StockDataSource} from '../database/connector/StockDataSource';
import {CategoryI} from '../model/CategoryI';
import {Stock} from '../model/stock';
import {SupplierI} from '../model/SupplierI';
import {AngularFirestore} from '@angular/fire/firestore';
import {NgForage} from 'ngforage';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService implements StockDataSource {

  serverUrl = 'http://localhost:3000/parse/classes';

  constructor(private firestore: AngularFirestore,
              private httpClient: HttpClient,
              private indexDb: NgForage) {
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  addAllStock(stocks: Stock[], callback: (value: any) => void) {
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  addCategory(category: CategoryI, callback?: (value: any) => void) {
    this.httpClient.post(this.serverUrl + '/categories', {
      'name': category.name
    }, {
      headers: {
        'X-Parse-Application-id': 'ssm',
        'Content-Type': 'application/json'
      }
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addStock(stock: Stock, callback?: (value: any) => void) {
    if (stock.id === 'newS') {
      this.updateStock(stock, callback);
    } else {
      stock.id = this.firestore.createId();
      this.httpClient.post(this.serverUrl + '/stocks', {
        'product': stock.product,
        'unit': stock.unit,
        'category': stock.category,
        'shelf': stock.shelf,
        'quantity': stock.quantity,
        'wholesaleQuantity': stock.wholesaleQuantity,
        'q_status': stock.q_status,
        'reorder': stock.reorder,
        'supplier': stock.supplier,
        'purchase': stock.purchase,
        'retailPrice': stock.retailPrice,
        'retailWholesalePrice': stock.retailWholesalePrice,
        'profit': stock.profit,
        'times': stock.times,
        'expire': stock.expire,
        'idOld': stock.id,
        'retail_stockcol': stock.retail_stockcol,
        'nhifPrice': stock.nhifPrice,
        'wholesalePrice': stock.wholesalePrice
      }, {
        headers: {
          'X-Parse-Application-id': 'ssm',
          'Content-Type': 'application/json'
        }
      }).subscribe(value => {
        callback(value);
      }, error1 => {
        console.log(error1);
        callback(null);
      });
    }
  }

  addSupplier(supplier: SupplierI, callback: (value: any) => void) {
    supplier.id = this.firestore.createId();
    this.httpClient.post(this.serverUrl + '/suppliers', {
      'name': supplier.name,
      'email': supplier.email,
      'address': supplier.address,
      'number': supplier.number,
      'idOld': supplier.id
    }, {
      headers: {
        'X-Parse-Application-id': 'ssm',
        'Content-Type': 'application/json'
      }
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
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
    this.httpClient.delete(this.serverUrl + '/stocks/' + stock.objectId, {
      headers: {
        'X-Parse-Application-id': 'ssm',
      }
    }).subscribe(value => {
      console.log(value);
    }, error1 => {
      console.log(error1);
      callback(null);
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
    this.httpClient.put(this.serverUrl + '/stocks/' + stock.objectId,
      {
        'product': stock.product,
        'unit': stock.unit,
        'category': stock.category,
        'shelf': stock.shelf,
        'quantity': stock.quantity,
        'wholesaleQuantity': stock.wholesaleQuantity,
        'reorder': stock.reorder,
        'supplier': stock.supplier,
        'purchase': stock.purchase,
        'retailPrice': stock.retailPrice,
        'retailWholesalePrice': stock.retailWholesalePrice,
        'expire': stock.expire,
        'nhifPrice': stock.nhifPrice,
        'wholesalePrice': stock.wholesalePrice
      },
      {
        headers: {
          'X-Parse-Application-id': 'ssm',
          'Content-Type': 'application/json'
        }
      }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  updateSupplier(id: string, callback?: (value: any) => void) {
  }
}
