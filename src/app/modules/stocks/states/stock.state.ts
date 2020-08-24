import {Injectable} from '@angular/core';
import {UnitsModel} from '../models/units.model';
import {HttpClient} from '@angular/common/http';
import {SupplierModel} from '../models/supplier.model';
import {UserDatabaseService} from '../../account/services/user-database.service';
import {SettingsService} from '../../account/services/settings.service';
import {CategoryModel} from '../models/category.model';
import {BFast} from 'bfastjs';
import {StorageService} from '../../lib/services/storage.service';
import {StockModel} from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockState {

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

  addAllCategory(categories: CategoryModel[], callback?: (value: any) => void) {
  }

  async importStocks(stocks: StockModel[]): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.functions(shop.projectId)
      .request(this._settings.ssmFunctionsURL + '/functions/stocks/import/' + shop.projectId)
      .post(stocks, {
        headers: this._settings.ssmFunctionsHeader
      });
  }

  addAllSupplier(suppliers: SupplierModel[], callback: (value: any) => void) {
  }

  async addCategory(category: CategoryModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection<CategoryModel>('categories').save(category);
  }

  async addUnit(unit: UnitsModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection<UnitsModel>('units').save(unit);
  }

  async getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsModel[]> {
    const shop = await this._storage.getActiveShop();
    const units = await BFast.database(shop.projectId).collection('units').getAll<UnitsModel>();
    units.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return units;
  }

  async addStock(stock: StockModel): Promise<StockModel> {
    const shop = await this._storage.getActiveShop();
    if (stock.image) {
      const imageRequest = await BFast.storage(shop.projectId).save({fileName: 'product.png', data: {base64: stock.image}, fileType: null});
      stock.image = imageRequest.url;
    }
    if (stock.downloads && stock.downloads.length > 0) {
      for (const value of stock.downloads) {
        const fileUpload = await BFast.storage(shop.projectId).save({
          fileName: `downloadableFile.${value.name.split('.').pop()}`,
          data: {base64: value.url},
          fileType: value.type
        });
        value.url = fileUpload.url;
      }
    }
    return BFast.database(shop.projectId).collection('stocks').save(stock);
  }

  async addSupplier(supplier: SupplierModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').save(supplier);
  }

  deleteAllCategory(categories: CategoryModel[], callback: (value: any) => void) {
  }

  deleteAllStock(stocks: StockModel[], callback?: (value: any) => void) {
  }

  deleteAllSupplier(suppliers: SupplierModel[], callback?: (value: any) => void) {
  }

  async deleteCategory(category: CategoryModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('categories').delete(category.objectId);
  }

  async deleteStock(stock: StockModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').delete(stock._id ? stock._id : stock.objectId);
  }

  async deleteSupplier(objectId: string): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').delete(objectId);
  }

  async getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryModel[]> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('categories').getAll(null, {
      cacheEnable: true,
      dtl: 7,
      freshDataCallback: value => {
        // console.log(value);
      }
    });
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this._storage.getActiveShop();
    // const totalStock = await BFast.database(shop.projectId)
    //   .collection('stocks')
    //   .query()
    //   .count({}, {cacheEnable: false, dtl: 0});
    const stocks: StockModel[] = await BFast.database(shop.projectId)
      .collection<StockModel>('stocks')
      .getAll<StockModel>(undefined, {
        cacheEnable: false,
        dtl: 0
      });
    await this._storage.saveStocks(stocks);
    // stocks.sort((a, b) => {
    //   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    // });
    return stocks;
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierModel[]> {
    const shop = await this._storage.getActiveShop();
    const suppliers: SupplierModel[] = await BFast.database(shop.projectId).collection<SupplierModel>('suppliers').getAll<SupplierModel>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getCategory(id: string, callback: (category: CategoryModel) => void) {
  }

  async getStock(id: string, callback: (stock: StockModel) => void) {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').get(id, {
      cacheEnable: false,
      dtl: 0
    });
  }

  getSupplier(id: string, callback: (supplier: SupplierModel) => void) {
  }

  updateAllCategory(categories: CategoryModel[], callback?: (value: any) => void) {
  }

  updateAllStock(stocks: StockModel[], callback?: (value: any) => void) {
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

  updateCategoryMobile(category: CategoryModel, categoryId): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.put<CategoryModel>(await this._settings.getCustomerServerURL() + '/classes/categories-mobile-ui/' + categoryId, category,
        {
          headers: await this._settings.getCustomerPostHeader()
        }).subscribe(value => {
        resolve(value);
      }, error1 => {
        reject(error1);
      });
    });
  }

  async updateStock(stock: StockModel): Promise<StockModel> {
    const shop = await this._storage.getActiveShop();
    const stockId = stock._id ? stock._id : stock.objectId;
    delete stock.objectId;
    if (stock.image && !stock.image.toString().startsWith('http')) {
      const imageRequest = await BFast.storage(shop.projectId).save({fileName: 'product.png', data: {base64: stock.image}, fileType: null});
      stock.image = imageRequest.url;
    }
    if (stock.downloads && stock.downloads.length > 0) {
      for (const value of stock.downloads) {
        if (value && !value.url.startsWith('http')) {
          const fileUpload = await BFast.storage(shop.projectId).save({
            fileName: `downloadableFile.${value.name.split('.').pop()}`,
            data: {base64: value.url},
            fileType: value.type
          });
          value.url = fileUpload.url;
        }
      }
    }
    return BFast.database(shop.projectId).collection('stocks').update<StockModel>(stockId, stock);
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

  async deleteUnit(unit: UnitsModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.database(shop.projectId).collection('units').delete(unit.objectId);
  }
}

