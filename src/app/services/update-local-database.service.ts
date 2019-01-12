import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {NgForage} from 'ngforage';
import {Stock} from '../model/stock';
import {CategoryI} from '../model/CategoryI';
import {SupplierI} from '../model/SupplierI';
import {UnitsI} from '../model/UnitsI';
import {ReceiptI} from '../model/ReceiptI';
import * as Parse from 'node_modules/parse';
import {StockDatabaseService} from './stock-database.service';

Parse.initialize('ssm');
Parse.serverURL = 'http://localhost:3000/parse';

@Injectable({
  providedIn: 'root'
})
export class UpdateLocalDatabaseService implements OnInit {
  private stocks: Stock[];
  private categories: CategoryI[];
  private suppliers: SupplierI[];
  private units: UnitsI[];
  private receipts: ReceiptI[];
  private invoices: ReceiptI[];

  constructor(private firestore: AngularFirestore,
              private stockDatabase: StockDatabaseService,
              private indexDb: NgForage) {
  }

  updateStock() {
    const query = new Parse.Query('stocks');
    const subscription = query.subscribe();
    subscription.on('open', () => {
      console.log('live server connected on stocks');
      this.stockDatabase.getAllStock(stocks => {
        if (stocks === null) {
          console.log('cant get all stocks');
        } else {
          this.indexDb.setItem<Stock[]>('stocks', stocks).then(value => {
            console.log('updated stocks is --> ' + value.length);
          }).catch(reason => {
            console.log(reason);
          });
        }
      });
    });

    subscription.on('create', (value) => {
      this.stockDatabase.getStock(value.id, value1 => {
        if (value1 === null) {
          console.log('object id is not available');
        } else {
          console.log(value1);
          this.indexDb.getItem<Stock[]>('stocks').then(value2 => {
            value2.push(value1);
            this.indexDb.setItem<Stock[]>('stocks', value2).then(value3 => {
              console.log(value3.length);
            }).catch(reason => console.log(reason));
          }).catch(reason => console.log(reason));
        }
      });
    });

    subscription.on('update', value => {
      console.log('stock updated is ');
      console.log(value);
    });

  }

  updateCategories() {
    const query = new Parse.Query('categories');
    const subscription = query.subscribe();
    subscription.on('open', () => {
      console.log('Live server connect on categories');
      this.stockDatabase.getAllCategory(categories => {
        if (categories === null) {
          console.log('failed to update categories');
        } else {
          this.indexDb.setItem('categories', categories).then(value => {
            console.log('category updated is ---> ' + value.length);
          }).catch(reason => console.log(reason));
        }
      });
    });
  }

  updateSuppliers() {
    const query = new Parse.Query('suppliers');
    const subscription = query.subscribe();
    subscription.on('open', () => {
      console.log('Live server connect on suppliers');
      this.stockDatabase.getAllSupplier(suppliers => {
        if (suppliers === null) {
          console.log('failed to update suppliers');
        } else {
          this.indexDb.setItem('suppliers', suppliers).then(value => {
            console.log('supplier updated is ---> ' + value.length);
          }).catch(reason => console.log(reason));
        }
      });
    });
  }

  updateUnits() {
    const query = new Parse.Query('units');
    const subscription = query.subscribe();
    subscription.on('open', () => {
      console.log('Live server connect on units');
      this.stockDatabase.getAllUnit(value => {
        if (value === null) {
          console.log('failed to update units');
        } else {
          this.indexDb.setItem('units', value).then(value1 => {
            console.log('units updated is ---> ' + value1.length);
          }).catch(reason => console.log(reason));
        }
      });
    });
  }

  ngOnInit(): void {
  }
}

// updateReceipts();
// {
//   this.firestore.collection<ReceiptI>('purchaseRefs').snapshotChanges().subscribe(value => {
//     if (value.length > 0) {
//       this.receipts = [];
//       value.forEach(value1 => {
//         this.receipts.push(value1.payload.doc.data());
//       });
//       this.indexDb.setItem('purchaseRefs', this.receipts).then(value1 => {
//         console.log('inserted purchase reference data in the cache is  : ' + value1.length);
//       }, reason => console.log(reason));
//     }
//   }, error1 => {
//     console.log(error1);
//   });
// }
//
// ngOnInit();
// :
// void {};
// }
