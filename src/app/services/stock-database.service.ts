import {Injectable} from '@angular/core';
import {StockDataSource} from '../database/connector/StockDataSource';
import {CategoryI} from '../model/CategoryI';
import {Stock} from '../model/stock';
import {SupplierI} from '../model/SupplierI';
import {HttpClient} from '@angular/common/http';
import {UnitsI} from '../model/UnitsI';
import {randomString} from '../database/ParseBackend';
import {SettingsServiceService} from './Settings-service.service';


@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService implements StockDataSource {

  constructor(private readonly httpClient: HttpClient,
              private readonly settings: SettingsServiceService) {
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  addAllStock(stocks: Stock[], callback: (value: any) => void) {
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  addCategory(category: CategoryI): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.post(this.settings.getCustomerServerURL() + '/classes/categories', category, {
        headers: this.settings.getCustomerPostHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  addUnit(unit: UnitsI, callback: (value: any) => void) {
    this.httpClient.post(this.settings.getCustomerServerURL() + '/classes/units', unit, {
      headers: this.settings.getCustomerPostHeader()
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsI[]> {
    return new Promise<UnitsI[]>((resolve, reject) => {
      this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/units', {
        headers: this.settings.getCustomerHeader(),
        params: {
          'limit': '1000'
        }
      }).subscribe(value => {
        const unt: UnitsI[] = value.results;
        resolve(unt);
      }, error1 => {
        reject(error1);
      });
    });
  }

  addStock(stock: Stock): Promise<Stock> {
    return new Promise<Stock>((resolve, reject) => {
      stock.idOld = randomString(8);
      this.httpClient.post<Stock>(this.settings.getCustomerServerURL() + '/classes/stocks', stock, {
        headers: this.settings.getCustomerPostHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  addSupplier(supplier: SupplierI, callback: (value: any) => void) {
    supplier.idOld = randomString(8);
    this.httpClient.post(this.settings.getCustomerServerURL() + '/classes/suppliers', supplier, {
      headers: this.settings.getCustomerPostHeader()
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

  deleteCategory(category: CategoryI): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient.delete(this.settings.getCustomerServerURL() + '/classes/categories/' + category.objectId, {
        headers: this.settings.getCustomerHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  deleteStock(stock: Stock, callback?: (value: any) => void) {
    this.httpClient.delete(this.settings.getCustomerServerURL() + '/classes/stocks/' + stock.objectId, {
      headers: this.settings.getCustomerHeader()
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  deleteSupplier(supplier: SupplierI, callback?: (value: any) => void) {
  }

  getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryI[]> {
    return new Promise<CategoryI[]>((resolve, reject) => {
      this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/categories', {
        headers: this.settings.getCustomerHeader(),
        params: {
          'limit': pagination.size ? pagination.size.toString() : '1000'
        }
      }).subscribe(value => {
        const categ: CategoryI[] = value.results;
        resolve(categ);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getAllStock(callback: (stocks: Stock[]) => void) {
    this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/stocks', {
      headers: this.settings.getCustomerHeader(),
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

  getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierI[]> {
    return new Promise<SupplierI[]>((resolve, reject) => {
      this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/suppliers', {
        headers: this.settings.getCustomerHeader(),
        params: {
          'limit': '1000'
        }
      }).subscribe(value => {
        const supp: SupplierI[] = value.results;
        resolve(supp);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getCategory(id: string, callback: (category: CategoryI) => void) {
  }

  getStock(id: string, callback: (stock: Stock) => void) {
    this.httpClient.get<Stock>(this.settings.getCustomerServerURL() + '/classes/stocks/' + id, {
      headers: this.settings.getCustomerHeader()
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

  updateCategory(category: { objectId: string, value: string, field: string }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const categoryId = category.objectId;
      const data = {};
      data[category.field] = category.value;
      delete category.objectId;
      this.httpClient.put<CategoryI>(this.settings.getCustomerServerURL() + '/classes/categories/' + categoryId, data,
        {
          headers: this.settings.getCustomerPostHeader()
        }).subscribe(value => {
        value.objectId = categoryId;
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  updateStock(stock: Stock): Promise<Stock> {
    return new Promise<Stock>((resolve, reject) => {
      const stockId = stock.objectId;
      delete stock.objectId;
      this.httpClient.put<Stock>(this.settings.getCustomerServerURL() + '/classes/stocks/' + stockId,
        stock,
        {
          headers: this.settings.getCustomerPostHeader()
        }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  updateSupplier(id: string, callback?: (value: any) => void) {
  }
}

