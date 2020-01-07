import {Injectable} from '@angular/core';
import {PurchaseDataSource} from '../database/connector/PurchaseDataSource';
import {ReceiptI} from '../model/ReceiptI';
import {PurchaseI} from '../model/PurchaseI';
import {HttpClient} from '@angular/common/http';
import {BatchI} from '../model/batchI';
import * as Parse from 'node_modules/parse';
import {NgForage} from 'ngforage';
import {serverUrl} from '../database/ParseBackend';
import {SettingsServiceService} from './Settings-service.service';

Parse.initialize('lbpharmacy');
Parse.serverURL = serverUrl;

@Injectable({
  providedIn: 'root'
})
export class PurchaseDatabaseService implements PurchaseDataSource {

  constructor(private readonly httpClient: HttpClient,
              private readonly settings: SettingsServiceService,
              private readonly indexDb: NgForage) {
  }

  addAllInvoices(invoices: ReceiptI[], callback: (value: any) => void) {
  }

  addAllPurchase(purchases: PurchaseI[], callback: (value: any) => void) {
    const bat: BatchI[] = [];
    purchases.forEach(value => {
      bat.push({
        method: 'POST',
        path: '/classes/purchases',
        body: value
      });
    });
    if (purchases.length <= 50) {
      this.httpClient.post(this.settings.getCustomerServerURL() + '/batch', {
        'requests': bat
      }, {
        headers: this.settings.getCustomerPostHeader()
      }).subscribe(value => {
        callback(value);
      }, error1 => {
        console.log(error1);
        callback(null);
      });
    } else {
      callback('BE');
    }
  }

  addAllReceipts(invoices: ReceiptI[], callback: (value: any) => void) {
  }

  addInvoice(invoice: ReceiptI, callback: (value: any) => void) {
    this.addReceipt(invoice, callback);
  }

  addPurchase(purchase: PurchaseI, callback: (value: any) => void) {
    this.httpClient.post<PurchaseI>(this.settings.getCustomerServerURL() + '/classes/purchases', purchase, {
      headers: this.settings.getCustomerPostHeader()
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addReceipt(invoice: ReceiptI, callback: (value: any) => void) {
    this.httpClient.post<ReceiptI>(this.settings.getCustomerServerURL() + '/classes/purchaseRefs', invoice, {
      headers: this.settings.getCustomerPostHeader(),
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
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
    return new Promise<PurchaseI[]>((resolve, reject) => {
      this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/purchases', {
        headers: this.settings.getCustomerHeader(),
        params: {
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
    const query = new Parse.Query('purchaseRefs');
    const subscription = query.subscribe();
    subscription.on('open', () => {
      console.log('purchase refs socket connected');
      this.updateCachedPurchaseRefs();
    });
    subscription.on('update', value => {
      this.updateCachedPurchaseRefs();
    });
    subscription.on('delete', value => {
      this.updateCachedPurchaseRefs();
    });
    subscription.on('create', value => {
      this.updateCachedPurchaseRefs();
    });
  }

  private updateCachedPurchaseRefs() {
    this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/purchaseRefs', {
      headers: this.settings.getCustomerHeader(),
      params: {
        'limit': '1000'
      }
    }).subscribe(value => {
      this.indexDb.setItem<ReceiptI[]>('purchaseRefs', value.results).then(value1 => {
        console.log('updated purchaseRefs is ---> ' + value1.length);
      }).catch(reason => console.log(reason));
    }, error1 => {
      console.log(error1);
    });
  }

  getInvoice(id: string, callback: (invoice: ReceiptI) => void) {
  }

  getPurchase(id: string, callback: (purchase: PurchaseI) => void) {
    this.httpClient.get<any>(this.settings.getCustomerServerURL() + '/classes/purchases/' + id, {
      headers: this.settings.getCustomerHeader()
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getReceipt(id: string, callback: (invoice: ReceiptI) => void) {
  }

  updatePurchase(id: string, callback: (value: any) => void) {
  }
}
