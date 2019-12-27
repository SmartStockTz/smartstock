import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UpdateLocalDatabaseService} from './services/update-local-database.service';
import {UserDatabaseService} from './services/user-database.service';
import {NgForage} from 'ngforage';
import {Router} from '@angular/router';
import {SalesProxyService} from './services/sales-proxy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private firestore: AngularFirestore,
              private userDatabase: UserDatabaseService,
              private indexDb: NgForage,
              private router: Router,
              private salesProxy: SalesProxyService,
              private updateLocal: UpdateLocalDatabaseService) {

  }

  ngOnInit(): void {
    // this.updateLocal.updateCategories();
    // this.updateLocal.updateSuppliers();
    // this.updateLocal.updateUnits();
    // this.updateLocal.updateReceipts();
    // this.updateLocal.updateStock();
    this.salesProxy.saleProxy();
  }

  // async insertCategory() {
  //   await this.httpClient.get<CategoryI[]>('/assets/datadumps/category.json').subscribe(value => {
  //     value.forEach((value1, index, array) => {
  //       console.log(value1);
  //       this.stockDatabase.addCategory(value1, value2 => {
  //         if (value2 === null) {
  //           console.log(' error happened at ---> ' + index);
  //         } else {
  //           console.log('index number ---> ' + index);
  //           console.log(value2);
  //         }
  //       });
  //     });
  //   }, error1 => {
  //     console.log('http error ' + error1);
  //   });
  // }
  //
  // async insertUnits() {
  //   await this.httpClient.get<UnitsI[]>('/assets/datadumps/units.json').subscribe(value => {
  //     value.forEach((value1, index, array) => {
  //       this.stockDatabase.addUnit(value1, value2 => {
  //         if (value2 === null) {
  //           console.log(' error happened at ---> ' + index);
  //         } else {
  //           console.log('index number ---> ' + index);
  //           console.log(value2);
  //         }
  //       });
  //     });
  //   }, error1 => {
  //     console.log(error1);
  //   });
  // }
  //
  // async insertPurchaseRef() {
  //   await this.httpClient.get<ReceiptI[]>('/assets/datadumps/invoices.json').subscribe(value => {
  //     value.forEach(((value1, index, array) => {
  //       this.purchaseDatabase.addInvoice(value1, results => {
  //         if (results == null) {
  //           console.log('error happened at ----> ' + index);
  //         } else {
  //           console.log('index number ---> ' + index);
  //           console.log(results);
  //         }
  //       });
  //     }));
  //   }, error1 => console.log(error1));
  // }
  //
  // async insertSuppliers() {
  //   await this.httpClient.get<SupplierI[]>('/assets/datadumps/receipts.json').subscribe(value => {
  //     value.forEach((value1, index, array) => {
  //       this.stockDatabase.addSupplier(value1, value2 => {
  //         if (value2 === null) {
  //           console.log(' error happened at ---> ' + index);
  //         } else {
  //           console.log('index number ---> ' + index);
  //           console.log(value2);
  //         }
  //       });
  //     });
  //   }, error1 => {
  //     console.log('http error ' + error1);
  //   });
  // }
  //
  // async insertStocks() {
  //   await this.httpClient.get<Stock[]>('/assets/datadumps/retail_stock.json').subscribe(value => {
  //     value.forEach((value1, index, array) => {
  //       this.stockDatabase.addStock(value1, value2 => {
  //         console.log('Index  --> ' + index);
  //         console.log(value2);
  //       });
  //       // const documentReference = this.firestore.collection('stocks').ref.doc();
  //       // value1.id = documentReference.id;
  //       // documentReference.set(value1).then(value2 => {
  //       //   console.log('Done insert ' + value1.product);
  //       // }).catch(reason => {
  //       //   console.log(reason);
  //       // });
  //     });
  //   }, error1 => {
  //     console.log(error1);
  //   });
  // }
  //
  // async insertSales() {
  //   await this.httpClient.get<CashSaleI[]>('/assets/datadumps/cash_sale.json').subscribe(value => {
  //     // const writeBatch = this.firestore.firestore.batch();
  //     value.forEach(value1 => {
  //       const documentReference = this.firestore.collection('sales').ref.doc();
  //       value1.idOld = documentReference.id;
  //       documentReference.set(value1).then(value2 => {
  //         console.log('Done insert ' + value1.product);
  //       }).catch(reason => {
  //         console.log(reason);
  //       });
  //     });
  //   }, error1 => {
  //     console.log(error1);
  //   });
  // }
  //
  // async insertPurchase() {
  //   await this.httpClient.get<PurchaseI[]>('/assets/datadumps/credit_purchase.json').subscribe(value => {
  //     // const writeBatch = this.firestore.firestore.batch();
  //     value.forEach(value1 => {
  //       const documentReference = this.firestore.collection('purchases').ref.doc();
  //       value1.idOld = documentReference.id;
  //       documentReference.set(value1).then(value2 => {
  //         console.log('Done insert ' + value1.product);
  //       }).catch(reason => {
  //         console.log(reason);
  //       });
  //     });
  //   }, error1 => {
  //     console.log(error1);
  //   });
  // }

}
