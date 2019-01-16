import {Injectable} from '@angular/core';
import {StockDataSource} from '../database/connector/StockDataSource';
import {CategoryI} from '../model/CategoryI';
import {Stock} from '../model/stock';
import {SupplierI} from '../model/SupplierI';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {UnitsI} from '../model/UnitsI';
import {ParseBackend} from '../database/ParseBackend';


@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService extends ParseBackend implements StockDataSource {

  constructor(private firestore: AngularFirestore,
              private httpClient: HttpClient) {
    super();
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  addAllStock(stocks: Stock[], callback: (value: any) => void) {
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  addCategory(category: CategoryI, callback?: (value: any) => void) {
    this.httpClient.post(this.serverUrl + '/classes/categories', category, {
      headers: this.postHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addUnit(unit: UnitsI, callback: (value: any) => void) {
    this.httpClient.post(this.serverUrl + '/classes/units', unit, {
      headers: this.postHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getAllUnit(callback: (value: UnitsI[]) => void) {
    this.httpClient.get<any>(this.serverUrl + '/classes/units', {
      headers: this.getHeader,
      params: {
        'limit': '1000'
      }
    }).subscribe(value => {
      const unt: UnitsI[] = value.results;
      callback(unt);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addStock(stock: Stock, callback?: (value: any) => void) {
    stock.idOld = this.firestore.createId();
    this.httpClient.post(this.serverUrl + '/classes/stocks', stock, {
      headers: this.postHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addSupplier(supplier: SupplierI, callback: (value: any) => void) {
    supplier.idOld = this.firestore.createId();
    this.httpClient.post(this.serverUrl + '/classes/suppliers', supplier, {
      headers: this.postHeader
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
    this.httpClient.delete(this.serverUrl + '/classes/stocks/' + stock.objectId, {
      headers: this.getHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  deleteSupplier(supplier: SupplierI, callback?: (value: any) => void) {
  }

  getAllCategory(callback: (categories: CategoryI[]) => void) {
    this.httpClient.get<any>(this.serverUrl + '/classes/categories', {
      headers: this.getHeader,
      params: {
        'limit': '1000'
      }
    }).subscribe(value => {
      const categ: CategoryI[] = value.results;
      callback(categ);
    }, error1 => {
      console.log(error1);
      callback(error1);
    });
  }

  getAllStock(callback: (stocks: Stock[]) => void) {
    this.httpClient.get<any>(this.serverUrl + '/classes/stocks', {
      headers: this.getHeader,
      params: {
        'limit': '100000'
      }
    }).subscribe(value => {
      const result: Stock[] = value.results;
      // console.log(value.results);
      callback(result);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getAllSupplier(callback: (suppliers: SupplierI[]) => void) {
    this.httpClient.get<any>(this.serverUrl + '/classes/suppliers', {
      headers: this.getHeader,
      params: {
        'limit': '10000'
      }
    }).subscribe(value => {
      const supp: SupplierI[] = value.results;
      callback(supp);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getCategory(id: string, callback: (category: CategoryI) => void) {
  }

  getStock(id: string, callback: (stock: Stock) => void) {
    this.httpClient.get<Stock>(this.serverUrl + '/classes/stocks/' + id, {
      headers: this.getHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
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
    this.httpClient.put(this.serverUrl + '/classes/stocks/' + stock.objectId,
      stock,
      {
        headers: this.postHeader
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

// {
//   'product': stock.product,
//   'unit': stock.unit,
//   'category': stock.category,
//   'shelf': stock.shelf,
//   'quantity': stock.quantity,
//   'wholesaleQuantity': stock.wholesaleQuantity,
//   'reorder': stock.reorder,
//   'supplier': stock.supplier,
//   'purchase': stock.purchase,
//   'retailPrice': stock.retailPrice,
//   'retailWholesalePrice': stock.retailWholesalePrice,
//   'expire': stock.expire,
//   'nhifPrice': stock.nhifPrice,
//   'wholesalePrice': stock.wholesalePrice
// }

// {
//   'product': stock.product,
//   'unit': stock.unit,
//   'category': stock.category,
//   'shelf': stock.shelf,
//   'quantity': stock.quantity,
//   'wholesaleQuantity': stock.wholesaleQuantity,
//   'q_status': stock.q_status,
//   'reorder': stock.reorder,
//   'supplier': stock.supplier,
//   'purchase': stock.purchase,
//   'retailPrice': stock.retailPrice,
//   'retailWholesalePrice': stock.retailWholesalePrice,
//   'profit': stock.profit,
//   'times': stock.times,
//   'expire': stock.expire,
//   'idOld': stock.idOld,
//   'retail_stockcol': stock.retail_stockcol,
//   'nhifPrice': stock.nhifPrice,
//   'wholesalePrice': stock.wholesalePrice
// }
