import {Injectable} from '@angular/core';
import {PurchaseDataSource} from '../database/connector/PurchaseDataSource';
import {ReceiptI} from '../model/ReceiptI';
import {PurchaseI} from '../model/PurchaseI';
import {HttpClient} from '@angular/common/http';
import {BatchI} from '../model/batchI';
import * as Parse from 'node_modules/parse';
import {NgForage} from 'ngforage';
import {ParseBackend, serverUrl} from '../database/ParseBackend';

Parse.initialize('lbpharmacy');
Parse.serverURL = serverUrl;

@Injectable({
  providedIn: 'root'
})
export class PurchaseDatabaseService extends ParseBackend implements PurchaseDataSource {

  constructor(private httpClient: HttpClient, private indexDb: NgForage) {
    super();
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
      this.httpClient.post(this.serverUrl + '/batch', {
        'requests': bat
      }, {
        headers: this.postHeader
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
    this.httpClient.post<PurchaseI>(this.serverUrl + '/classes/purchases', purchase, {
      headers: this.postHeader
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addReceipt(invoice: ReceiptI, callback: (value: any) => void) {
    this.httpClient.post<ReceiptI>(this.serverUrl + '/classes/purchaseRefs', invoice, {
      headers: this.postHeader,
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

  // socket method
  getAllPurchase(callback: (purchases: PurchaseI[]) => void) {
    const query = new Parse.Query('purchases');
    const subscription = query.subscribe();
    subscription.on('open', () => {
      console.log('socket connected on purchases');
      this.updateCachePurchase();
    });
    subscription.on('update', value => {
      this.updateCachePurchase();
    });
    subscription.on('delete', value => {
      this.updateCachePurchase();
    });
    subscription.on('create', value => {
      this.updateCachePurchase();
    });
  }

  private updateCachePurchase() {
    this.httpClient.get<any>(this.serverUrl + '/classes/purchases', {
      headers: this.getHeader,
      params: {
        'limit': '1000000'
      }
    }).subscribe(value => {
      this.indexDb.setItem<PurchaseI[]>('purchases', value.results).then(value1 => {
        console.log('updated purchases is ---> ' + value1.length);
      }).catch(reason => console.log(reason));
    }, error1 => {
      console.log(error1);
    });
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
    this.httpClient.get<any>(this.serverUrl + '/classes/purchaseRefs', {
      headers: this.getHeader,
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
    this.httpClient.get<any>(this.serverUrl + '/classes/purchases/' + id, {
      headers: this.getHeader
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
