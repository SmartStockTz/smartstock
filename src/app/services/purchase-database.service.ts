import {Injectable} from '@angular/core';
import {PurchaseDataSource} from '../adapter/PurchaseDataSource';
import {ReceiptI} from '../model/ReceiptI';
import {PurchaseI} from '../model/PurchaseI';
import {HttpClient} from '@angular/common/http';
import {SettingsServiceService} from './Settings-service.service';

@Injectable()
export class PurchaseDatabaseService implements PurchaseDataSource {

  constructor(private readonly _httpClient: HttpClient,
              private readonly _settings: SettingsServiceService) {
  }

  recordPayment(objectId: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._httpClient.put(await this._settings.getCustomerServerURL() + '/classes/purchases/' + objectId, {
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

  addAllInvoices(invoices: ReceiptI[], callback: (value: any) => void) {
  }

  addAllPurchase(purchases: PurchaseI[], callback: (value: any) => void) {
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

  addAllReceipts(invoices: ReceiptI[], callback: (value: any) => void) {
  }

  addInvoice(invoice: ReceiptI, callback: (value: any) => void) {
    // this.addReceipt(invoice, callback);
  }

  addPurchase(purchase: PurchaseI, callback: (value: any) => void) {
    // this.httpClient.post<PurchaseI>(this._settings.getCustomerServerURL() + '/classes/purchases', purchase, {
    //   headers: this._settings.getCustomerPostHeader()
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  addReceipt(invoice: ReceiptI, callback: (value: any) => void) {
    // this.httpClient.post<ReceiptI>(this._settings.getCustomerServerURL() + '/classes/purchaseRefs', invoice, {
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

  deletePurchase(id: string, callback: (value: any) => void) {
  }

  deleteReceipts(id: string, callback: (value: any) => void) {
  }

  getAllInvoice(callback: (invoices: ReceiptI[]) => void) {
  }


  getAllPurchase(page: { size?: number, skip?: number }): Promise<PurchaseI[]> {
    return new Promise<PurchaseI[]>(async (resolve, reject) => {
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
  getAllReceipts(callback: (invoices: ReceiptI[]) => void) {
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
    //   this.indexDb.setItem<ReceiptI[]>('purchaseRefs', value.results).then(value1 => {
    //     console.log('updated purchaseRefs is ---> ' + value1.length);
    //   }).catch(reason => console.log(reason));
    // }, error1 => {
    //   console.log(error1);
    // });
  }

  getInvoice(id: string, callback: (invoice: ReceiptI) => void) {
  }

  getPurchase(id: string, callback: (purchase: PurchaseI) => void) {
    // this.httpClient.get<any>(this._settings.getCustomerServerURL() + '/classes/purchases/' + id, {
    //   headers: this._settings.getCustomerHeader()
    // }).subscribe(value => {
    //   callback(value);
    // }, error1 => {
    //   console.log(error1);
    //   callback(null);
    // });
  }

  getReceipt(id: string, callback: (invoice: ReceiptI) => void) {
  }

  updatePurchase(id: string, callback: (value: any) => void) {
  }
}
