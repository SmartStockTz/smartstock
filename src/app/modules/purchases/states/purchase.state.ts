import {Injectable} from '@angular/core';
import {PurchaseModel} from '../models/purchase.model';
import {HttpClient} from '@angular/common/http';
import {ReceiptModel} from '../models/receipt.model';
import {SettingsService} from '../../account/services/settings.service';
import {BFast} from 'bfastjs';
import {StorageService} from '../../lib/services/storage.service';
import {SupplierModel} from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseState {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _storage: StorageService,
              private readonly _settings: SettingsService) {
  }

  recordPayment(id: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.put(await this._settings.getCustomerServerURL() + '/classes/purchases/' + id, {
        paid: true
      }, {
        headers: await this._settings.getCustomerPostHeader()
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }

  addAllInvoices(invoices: ReceiptModel[], callback: (value: any) => void) {
  }

  addAllPurchase(purchases: PurchaseModel[], callback: (value: any) => void) {
    // const bat: BatchI[] = [];
    // purchases.forEach(value => {
    //   bat.push({
    //     method: 'POST',
    //     path: '/classes/purchases',
    //     body: value
    //   });
    // });
    // if (purchases.length <= 50) {
    //   this.httpClient.post(this._settings.getCustomerServerURL() + '/batch', {
    //     'requests': bat
    //   }, {
    //     headers: this._settings.getCustomerPostHeader()
    //   }).subscribe(value => {
    //     callback(value);
    //   }, error1 => {
    //     console.log(error1);
    //     callback(null);
    //   });
    // } else {
    //   callback('BE');
    // }
  }

  addAllReceipts(invoices: ReceiptModel[], callback: (value: any) => void) {
  }

  addInvoice(invoice: ReceiptModel, callback: (value: any) => void) {
    // this.addReceipt(invoice, callback);
  }

  async addPurchase(purchaseI: PurchaseModel): Promise<any> {
    const shop = await this._storage.getActiveShop();
    return BFast.functions(shop.projectId).request(
      this._settings.ssmFunctionsURL + '/functions/purchases/' + shop.projectId)
      .post(purchaseI, {
        headers: this._settings.ssmFunctionsHeader
      });
  }

  addReceipt(invoice: ReceiptModel, callback: (value: any) => void) {
    // this.httpClient.post<ReceiptModel>(this._settings.getCustomerServerURL() + '/classes/purchaseRefs', invoice, {
    //   headers: this._settings.getCustomerPostHeader(),
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  deleteInvoice(id: string, callback: (value: any) => void) {
  }

  // deletePurchase(id: string, callback: (value: any) => void) {
  // }

  deleteReceipts(id: string, callback: (value: any) => void) {
  }

  getAllInvoice(callback: (invoices: ReceiptModel[]) => void) {
  }

  // @ts-ignore
  deletePurchase(purchase: PurchaseModel): Promise<PurchaseModel> {
    return new Promise<PurchaseModel>(async (resolve, reject) => {
      this._httpClient.delete<PurchaseModel>(await this._settings.getCustomerServerURL() + '/classes/purchases/' + purchase.id, {
        headers: await this._settings.getCustomerHeader()
      }).subscribe(value => {
        resolve(value);
      }, error => {
        reject(error);
      });
    });
  }


  getAllPurchase(page: { size?: number, skip?: number }): Promise<PurchaseModel[]> {
    return new Promise<PurchaseModel[]>(async (resolve, reject) => {
      this._httpClient.get<any>(await this._settings.getCustomerServerURL() + '/classes/purchases', {
        headers: await this._settings.getCustomerHeader(),
        params: {
          'order': '-updatedAt',
          'limit': page.size ? page.size.toString() : '100',
          'skip': page.skip ? page.skip.toString() : '0',
        }
      }).subscribe(value => {
        resolve(value.results);
      }, error1 => {
        reject(error1);
      });
    });
  }

  private updateCachePurchase() {

  }

  // must be updated and its socket method
  getAllReceipts(callback: (invoices: ReceiptModel[]) => void) {
    // const query = new Parse.Query('purchaseRefs');
    // const subscription = query.subscribe();
    // subscription.on('open', () => {
    //   console.log('purchase refs socket connected');
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('update', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('delete', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    // subscription.on('create', value => {
    //   this.updateCachedPurchaseRefs();
    // });
    callback(null);
  }

  private updateCachedPurchaseRefs() {
    // this.httpClient.get<any>(this._settings.getCustomerServerURL() + '/classes/purchaseRefs', {
    //   headers: this._settings.getCustomerHeader(),
    //   params: {
    //     'limit': '1000'
    //   }
    // }).subscribe(value => {
    //   this.indexDb.setItem<ReceiptModel[]>('purchaseRefs', value.results).then(value1 => {
    //     console.log('updated purchaseRefs is ---> ' + value1.length);
    //   }).catch(reason => console.log(reason));
    // }, error1 => {
    //   console.log(error1);
    // });
  }

  getInvoice(id: string, callback: (invoice: ReceiptModel) => void) {
  }

  getPurchase(id: string, callback: (purchase: PurchaseModel) => void) {
    // this.httpClient.get<any>(this._settings.getCustomerServerURL() + '/classes/purchases/' + id, {
    //   headers: this._settings.getCustomerHeader()
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierModel[]> {
    const shop = await this._storage.getActiveShop();
    const suppliers: SupplierModel[] = await BFast.database(shop.projectId).collection<SupplierModel>('suppliers').getAll<SupplierModel>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getReceipt(id: string, callback: (invoice: ReceiptModel) => void) {
  }

  updatePurchase(id: string, callback: (value: any) => void) {
  }
}
