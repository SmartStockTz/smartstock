import {Injectable} from '@angular/core';
import {StockDataSource} from '../adapter/StockDataSource';
import {CategoryI} from '../model/CategoryI';
import {Stock} from '../model/stock';
import {SupplierI} from '../model/SupplierI';
import {HttpClient} from '@angular/common/http';
import {UnitsI} from '../model/UnitsI';
import {randomString} from '../adapter/ParseBackend';
import {SettingsServiceService} from './Settings-service.service';
import {PurchaseI} from '../model/PurchaseI';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService implements StockDataSource {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _settings: SettingsServiceService) {
  }

  exportToExcel(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.get(this._settings.ssmFunctionsURL + '/functions/stocks/export/' + await this._settings.getCustomerProjectId(), {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  async addAllStock(stocks: Stock[]): Promise<any> {
    try {
      return await this._httpClient.post(this._settings.ssmFunctionsURL +
        '/functions/stocks/import/' + await this._settings.getCustomerProjectId(), stocks, {
        headers: this._settings.ssmFunctionsHeader
      }).toPromise();
    } catch (e) {
      throw e;
    }
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  addCategory(category: CategoryI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.post(await this._settings.getCustomerServerURL() + '/classes/categories', category, {
        headers: await this._settings.getCustomerPostHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  addUnit(unit: UnitsI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.post(await this._settings.getCustomerServerURL() + '/classes/units', unit, {
        headers: await this._settings.getCustomerPostHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsI[]> {
    return new Promise<UnitsI[]>(async (resolve, reject) => {
      this._httpClient.get<any>(await this._settings.getCustomerServerURL() + '/classes/units', {
        headers: await this._settings.getCustomerHeader(),
        params: {
          'order': '-updatedAt',
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
    return new Promise<Stock>(async (resolve, reject) => {
      try {
        const serverUrl = await this._settings.getCustomerServerURL();
        stock.idOld = randomString(8);
        if (stock.image) {
          Parse.initialize(await this._settings.getCustomerApplicationId());
          Parse.serverURL = serverUrl;
          const file = new Parse.File('product.png', {base64: stock.image});
          const imageRequest = await file.save();
          // imageRequest = await this._httpClient.post<any>(serverUrl + '/files/product.png', stock.image, {
          //   headers: await this._settings.getCustomerPostHeader('image/png')
          // }).toPromise();
          // console.log(imageRequest.toJSON());
          stock.image = imageRequest.toJSON().url;
        }
        const addStockRequest = this._httpClient.post<Stock>(serverUrl + '/classes/stocks', stock, {
          headers: await this._settings.getCustomerPostHeader()
        }).toPromise();
        const response = await addStockRequest;
        // @ts-ignore
        resolve(response);
      } catch (e) {
        reject(e);
      }
    });
  }

  addSupplier(supplier: SupplierI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.post(await this._settings.getCustomerServerURL() + '/classes/suppliers', supplier, {
        headers: await this._settings.getCustomerPostHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        console.log(error1);
        reject(null);
      });
    });
  }

  deleteAllCategory(categories: CategoryI[], callback: (value: any) => void) {
  }

  deleteAllStock(stocks: Stock[], callback?: (value: any) => void) {
  }

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void) {
  }

  deleteCategory(category: CategoryI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.delete(await this._settings.getCustomerServerURL() + '/classes/categories/' + category.objectId, {
        headers: await this._settings.getCustomerHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  deleteStock(stock: Stock, callback?: (value: any) => void): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this._httpClient.delete(await this._settings.getCustomerServerURL() + '/classes/stocks/' + stock.objectId, {
        headers: await this._settings.getCustomerHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  deleteSupplier(objectId: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.delete(await this._settings.getCustomerServerURL() + '/classes/suppliers/' + objectId, {
        headers: await this._settings.getCustomerHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryI[]> {
    return new Promise<CategoryI[]>(async (resolve, reject) => {
      this._httpClient.get<any>(await this._settings.getCustomerServerURL() + '/classes/categories', {
        headers: await this._settings.getCustomerHeader(),
        params: {
          'order': '-updatedAt',
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

  getAllStock(): Promise<Stock[]> {
    return new Promise<Stock[]>(async (resolve, reject) => {
      this._httpClient.get<any>(await this._settings.getCustomerServerURL() + '/classes/stocks', {
        headers: await this._settings.getCustomerHeader(),
        params: {
          'order': '-updatedAt',
          'limit': '100000'
        }
      }).subscribe(value => {
        const result: Stock[] = value.results;
        resolve(result);
      }, error1 => {
        reject(error1);
      });
    });
  }

  getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierI[]> {
    return new Promise<SupplierI[]>(async (resolve, reject) => {
      this._httpClient.get<any>(await this._settings.getCustomerServerURL() + '/classes/suppliers', {
        headers: await this._settings.getCustomerHeader(),
        params: {
          'order': '-updatedAt',
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
    // this.httpClient.get<Stock>(this.settings.getCustomerServerURL() + '/classes/stocks/' + id, {
    //   headers: this.settings.getCustomerHeader()
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
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
    return new Promise<any>(async (resolve, reject) => {
      const categoryId = category.objectId;
      const data = {};
      data[category.field] = category.value;
      delete category.objectId;
      this._httpClient.put<CategoryI>(await this._settings.getCustomerServerURL() + '/classes/categories/' + categoryId, data,
        {
          headers: await this._settings.getCustomerPostHeader()
        }).subscribe(value => {
        value.objectId = categoryId;
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  updateStock(stock: Stock): Promise<Stock> {
    return new Promise<Stock>(async (resolve, reject) => {
      try {
        const serverUrl = await this._settings.getCustomerServerURL();
        const stockId = stock.objectId;
        delete stock.objectId;
        if (stock.image && !stock.image.toString().startsWith('http://')) {
          Parse.initialize(await this._settings.getCustomerApplicationId());
          Parse.serverURL = serverUrl;
          const file = new Parse.File('product.png', {base64: stock.image});
          const imageRequest = await file.save();
          stock.image = imageRequest.toJSON().url;
        }
        this._httpClient.put<Stock>(serverUrl + '/classes/stocks/' + stockId,
          stock,
          {
            headers: await this._settings.getCustomerPostHeader()
          }).subscribe(value => {
          resolve(value);
        }, error1 => {
          reject(error1);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  updateSupplier(value: { objectId: string, field: string, value: string }): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const supplierId = value.objectId;
      const data = {};
      data[value.field] = value.value;
      delete value.objectId;
      this._httpClient.put<CategoryI>(await this._settings.getCustomerServerURL() + '/classes/suppliers/' + supplierId, data,
        {
          headers: await this._settings.getCustomerPostHeader()
        }).subscribe(value1 => {
        value1.objectId = supplierId;
        resolve(value1);
      }, error1 => {
        reject(error1);
      });
    });
  }

  updateUnit(unit: { objectId: string; value: string; field: string }): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const unitId = unit.objectId;
      const data = {};
      data[unit.field] = unit.value;
      delete unit.objectId;
      this._httpClient.put<CategoryI>(await this._settings.getCustomerServerURL() + '/classes/units/' + unitId, data,
        {
          headers: await this._settings.getCustomerPostHeader()
        }).subscribe(value => {
        value.objectId = unitId;
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  deleteUnit(unit: UnitsI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.delete(await this._settings.getCustomerServerURL() + '/classes/units/' + unit.objectId, {
        headers: await this._settings.getCustomerHeader()
      }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  addPurchase(purchaseI: PurchaseI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.post(this._settings.ssmFunctionsURL
        + '/functions/purchases/' + await this._settings.getCustomerProjectId(), purchaseI, {
        headers: this._settings.ssmFunctionsHeader
      }).subscribe(purchase => {
        resolve(purchase);
      }, error => {
        reject(error);
      });
    });
  }
}

