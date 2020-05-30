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
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService implements StockDataSource {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _user: UserDatabaseService,
              private readonly _storage: LocalStorageService,
              private readonly _settings: SettingsService) {
  }

  async exportToExcel(): Promise<any> {
    const user = await this._user.currentUser();
    const projectId = await this._settings.getCustomerProjectId();
    const email = encodeURIComponent(user.email);
    return BFast.functions()
      .request(this._settings.ssmFunctionsURL + '/functions/stocks/export/' + projectId + '/' + email)
      .get({}, this._settings.ssmFunctionsHeader);
  }

  addAllCategory(categories: CategoryI[], callback?: (value: any) => void) {
  }

  async importStocks(stocks: Stock[]): Promise<any> {
    return BFast.functions()
      .request(this._settings.ssmFunctionsURL + '/functions/stocks/import/' + await this._settings.getCustomerProjectId())
      .post(stocks, this._settings.ssmFunctionsHeader);
  }

  addAllSupplier(suppliers: SupplierI[], callback: (value: any) => void) {
  }

  async addCategory(category: CategoryI): Promise<any> {
    return BFast.database().collection<CategoryI>('categories').save(category);
  }

  async addUnit(unit: UnitsI): Promise<any> {
    return BFast.database().collection<UnitsI>('units').save(unit);
  }

  async getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsI[]> {
    const units = await BFast.database().collection('units').getAll<UnitsI>();
    units.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return units;
  }

  async addStock(stock: Stock): Promise<Stock> {
    if (stock.image) {
      const imageRequest = await BFast.storage().save({fileName: 'product.png', data: {base64: stock.image}, fileType: null});
      stock.image = imageRequest.url;
    }
    return BFast.database().collection('stocks').save(stock);
  }

  async addSupplier(supplier: SupplierI): Promise<any> {
    return BFast.database().collection('suppliers').save(supplier);
  }

  deleteAllCategory(categories: CategoryI[], callback: (value: any) => void) {
  }

  deleteAllStock(stocks: Stock[], callback?: (value: any) => void) {
  }

  deleteAllSupplier(suppliers: SupplierI[], callback?: (value: any) => void) {
  }

  async deleteCategory(category: CategoryI): Promise<any> {
    return BFast.database().collection('categories').delete(category.objectId);
  }

  async deleteStock(stock: Stock, callback?: (value: any) => void): Promise<any> {
    return BFast.database().collection('stocks').delete(stock.objectId);
  }

  async deleteSupplier(objectId: string): Promise<any> {
    return BFast.database().collection('suppliers').delete(objectId);
  }

  async getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryI[]> {
    return BFast.database().collection('categories').getAll();
  }

  async getAllStock(): Promise<Stock[]> {
    const stocks: Stock[] = await BFast.database().collection<Stock>('stocks').getAll<Stock>(null, {
      cacheEnable: false,
      dtl: 1
    });
    await this._storage.saveStocks(stocks);
    stocks.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return stocks;
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierI[]> {
    const suppliers: SupplierI[] = await BFast.database().collection<SupplierI>('suppliers').getAll<SupplierI>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getCategory(id: string, callback: (category: CategoryI) => void) {
  }

  async getStock(id: string, callback: (stock: Stock) => void) {
    return BFast.database().collection('stocks').get(id, {
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

  async updateCategory(category: { objectId: string, value: string, field: string }): Promise<any> {
    const categoryId = category.objectId;
    const data = {};
    data[category.field] = category.value;
    delete category.objectId;
    const response = await BFast.database().collection('categories').update<any>(categoryId, data);
    response.objectId = categoryId;
    return response;
  }

  async updateStock(stock: Stock): Promise<Stock> {
    const stockId = stock.objectId;
    delete stock.objectId;
    if (stock.image && !stock.image.toString().startsWith('http://')) {
      const imageRequest = await BFast.storage().save({fileName: 'product.png', data: {base64: stock.image}, fileType: null});
      stock.image = imageRequest.url;
    }
    return BFast.database().collection('stocks').update<Stock>(stockId, stock);
  }

  async updateSupplier(value: { objectId: string, field: string, value: string }): Promise<any> {
    const supplierId = value.objectId;
    const data = {};
    data[value.field] = value.value;
    delete value.objectId;
    const response = await BFast.database().collection('suppliers').update<any>(supplierId, data);
    response.objectId = supplierId;
    return response;
  }

  async updateUnit(unit: { objectId: string; value: string; field: string }): Promise<any> {
    const unitId = unit.objectId;
    const data = {};
    data[unit.field] = unit.value;
    delete unit.objectId;
    const response = await BFast.database().collection('units').update<any>(unitId, data);
    response.objectId = unitId;
    return response;
  }

  deleteUnit(unit: UnitsI): Promise<any> {
    return BFast.database().collection('units').delete(unit.objectId);
  }

  async addPurchase(purchaseI: PurchaseI): Promise<any> {
    return BFast.functions().request(
      this._settings.ssmFunctionsURL + '/functions/purchases/' + await this._settings.getCustomerProjectId())
      .post(purchaseI, this._settings.ssmFunctionsHeader);
  }
}

