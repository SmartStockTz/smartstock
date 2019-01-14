import {Injectable} from '@angular/core';
import {PurchaseDataSource} from '../database/connector/PurchaseDataSource';
import {ReceiptI} from '../model/ReceiptI';
import {PurchaseI} from '../model/PurchaseI';
import {HttpClient} from '@angular/common/http';
import {BatchI} from '../model/batchI';

@Injectable({
  providedIn: 'root'
})
export class PurchaseDatabaseService implements PurchaseDataSource {

  serverUrl = 'http://localhost:3000/parse/classes';
  serverUrlBatch = 'http://localhost:3000/parse/batch';

  constructor(private httpClient: HttpClient) {
  }

  addAllInvoices(invoices: ReceiptI[], callback: (value: any) => void) {
  }

  addAllPurchase(purchases: PurchaseI[], callback: (value: any) => void) {
    const bat: BatchI[] = [];
    purchases.forEach(value => {
      bat.push({
        method: 'POST',
        path: '/parse/classes/purchases',
        body: value
      });
    });
    if (purchases.length <= 50) {
      this.httpClient.post(this.serverUrlBatch, bat, {
        headers: {
          'X-Parse-Application-Id': 'ssm',
          'Content-Type': 'application/json'
        }
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
  }

  addPurchase(purchase: PurchaseI, callback: (value: any) => void) {
    this.httpClient.post<PurchaseI>(this.serverUrl + '/purchases', purchase, {
      headers: {
        'X-Parse-Application-Id': 'ssm',
        'Content-Type': 'application/json'
      }
    }).subscribe(value => {
      callback(value);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  addReceipt(invoice: ReceiptI, callback: (value: any) => void) {
  }

  deleteInvoice(id: string, callback: (value: any) => void) {
  }

  deletePurchase(id: string, callback: (value: any) => void) {
  }

  deleteReceipts(id: string, callback: (value: any) => void) {
  }

  getAllInvoice(callback: (invoices: ReceiptI[]) => void) {
  }

  getAllPurchase(callback: (purchases: PurchaseI[]) => void) {
    this.httpClient.get<any>(this.serverUrl + '/purchases', {
      headers: {
        'X-Parse-Application-Id': 'ssm'
      },
      params: {
        'limit': '1000000000'
      }
    }).subscribe(value => {
      callback(value.results);
    }, error1 => {
      console.log(error1);
      callback(null);
    });
  }

  getAllReceipts(callback: (invoices: ReceiptI[]) => void) {
  }

  getInvoice(id: string, callback: (invoice: ReceiptI) => void) {
  }

  getPurchase(id: string, callback: (purchase: PurchaseI) => void) {
    this.httpClient.get<any>(this.serverUrl + '/purchases', {
      headers: {
        'X-Parse-Application-Id': 'ssm',
      },
      params: {
        'limit': '100000000'
      }
    }).subscribe(value => {
      callback(value.results);
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
