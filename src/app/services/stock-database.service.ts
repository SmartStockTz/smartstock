import {Injectable} from '@angular/core';
import {StockDataSource} from '../adapter/StockDataSource';
import {CategoryI} from '../model/CategoryI';
import {Stock} from '../model/stock';
import {SupplierI} from '../model/SupplierI';
import {HttpClient} from '@angular/common/http';
import {UnitsI} from '../model/UnitsI';
import {SettingsService} from './settings.service';
import {PurchaseI} from '../model/PurchaseI';
import {UserDatabaseService} from './user-database.service';
import {BFast} from 'bfastjs';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService implements StockDataSource {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _user: UserDatabaseService,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  async exportToExcel(): Promise<any> {
    const user = await this._user.currentUser();
    const projectId = await this._settings.getCustomerProjectId();
    const email = encodeURIComponent(user.email);
    return BFast.functions(projectId)
      .request(this._settings.ssmFunctionsURL + '/functions/stocks/export/' + projectId + '/' + email)
      .get({});
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  async importStocks(stocks: Stock[]): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.functions(shop.projectId)
      .request(this._settings.ssmFunctionsURL + '/functions/stocks/import/' + shop.projectId)
      .post(stocks, this._settings.ssmFunctionsHeader);
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  async addCategory(category: CategoryI): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection<CategoryI>('categories').save(category);
  }

  async addUnit(unit: UnitsI): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection<UnitsI>('units').save(unit);
  }

  async getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsI[]> {
    const shop = await this._storage.getActiveShop();
    const units = await BFast.database(shop.projectId).collection('units').getAll<UnitsI>();
    units.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return units;
  }

  async addStock(stock: Stock): Promise<Stock> {
    const shop = await this._storage.getActiveShop();
    if (stock.image) {
      const imageRequest = await BFast.storage(shop.projectId).save({fileName: 'product.png', data: {base64: stock.image}, fileType: null});
      stock.image = imageRequest.url;
    }
    return BFast.database(shop.projectId).collection('stocks').save(stock);
  }

  async addSupplier(supplier: SupplierI): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').save(supplier);
  }

  deleteAllCategory(categories: CategoryI[], callback: (value: any) => void) {
  }

  deleteAllStock(stocks: Stock[], callback?: (value: any) => void) {
  }

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void) {
  }

  async deleteCategory(category: CategoryI): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('categories').delete(category.objectId);
  }

  async deleteStock(stock: Stock): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').delete(stock._id ? stock._id : stock.objectId);
  }

  async deleteSupplier(objectId: string): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').delete(objectId);
  }

  async getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryI[]> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('categories').getAll(null, {
      cacheEnable: true,
      dtl: 7,
      freshDataCallback: value => {
        // console.log(value);
      }
    });
  }

  async getAllStock(): Promise<Stock[]> {
    const shop = await this._storage.getActiveShop();
    // const totalStock = await BFast.database(shop.projectId)
    //   .collection('stocks')
    //   .query()
    //   .count({}, {cacheEnable: false, dtl: 0});
    const stocks: Stock[] = await BFast.database(shop.projectId)
      .collection<Stock>('stocks')
      .getAll<Stock>(undefined, {
        cacheEnable: false,
        dtl: 0
      });
    await this._storage.saveStocks(stocks);
    // stocks.sort((a, b) => {
    //   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    // });
    return stocks;
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierI[]> {
    const shop = await this._storage.getActiveShop();
    const suppliers: SupplierI[] = await BFast.database(shop.projectId).collection<SupplierI>('suppliers').getAll<SupplierI>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getCategory(id: string, callback: (category: CategoryI) => void) {
  }

  async getStock(id: string, callback: (stock: Stock) => void) {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').get(id, {
      cacheEnable: false,
      dtl: 0
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

  // @ts-ignore
  async updateCategory(category: { objectId: string, value: string, field: string }): Promise<any> {
    const shop = await this._storage.getActiveShop();
    const categoryId = category.objectId;
    const data = {};
    data[category.field] = category.value;
    delete category.objectId;
    const response = await BFast.database(shop.projectId).collection('categories').update<any>(categoryId, data);
    response.objectId = categoryId;
    return response;
  }

  updateCategoryMobile(category: CategoryI, categoryId): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.put<CategoryI>(await this._settings.getCustomerServerURL() + '/classes/categories-mobile-ui/' + categoryId, category,
        {
          headers: await this._settings.getCustomerPostHeader()
        }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  async updateStock(stock: Stock): Promise<Stock> {
    const shop = await this._storage.getActiveShop();
    const stockId = stock._id ? stock._id : stock.objectId;
    delete stock.objectId;
    if (stock.image && !stock.image.toString().startsWith('http://')) {
      const imageRequest = await BFast.storage(shop.projectId).save({fileName: 'product.png', data: {base64: stock.image}, fileType: null});
      stock.image = imageRequest.url;
    }
    return BFast.database(shop.projectId).collection('stocks').update<Stock>(stockId, stock);
  }

  async updateSupplier(value: { objectId: string, field: string, value: string }): Promise<any> {
    const shop = await this._storage.getActiveShop();
    const supplierId = value.objectId;
    const data = {};
    data[value.field] = value.value;
    delete value.objectId;
    const response = await BFast.database(shop.projectId).collection('suppliers').update<any>(supplierId, data);
    response.objectId = supplierId;
    return response;
  }

  async updateUnit(unit: { objectId: string; value: string; field: string }): Promise<any> {
    const shop = await this._storage.getActiveShop();
    const unitId = unit.objectId;
    const data = {};
    data[unit.field] = unit.value;
    delete unit.objectId;
    const response = await BFast.database(shop.projectId).collection('units').update<any>(unitId, data);
    response.objectId = unitId;
    return response;
  }

  async deleteUnit(unit: UnitsI): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('units').delete(unit.objectId);
  }

  async addPurchase(purchaseI: PurchaseI): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.functions(shop.projectId).request(
      this._settings.ssmFunctionsURL + '/functions/purchases/' + shop.projectId)
      .post(purchaseI, this._settings.ssmFunctionsHeader);
  }
}

