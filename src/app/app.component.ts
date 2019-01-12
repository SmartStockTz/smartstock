import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {UpdateLocalDatabaseService} from './services/update-local-database.service';
import {Stock} from './model/stock';
import {CashSaleI} from './model/CashSale';
import {PurchaseI} from './model/PurchaseI';
import {StockDatabaseService} from './services/stock-database.service';
import {SupplierI} from './model/SupplierI';
import {CategoryI} from './model/CategoryI';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private firestore: AngularFirestore,
              private updateLocal: UpdateLocalDatabaseService,
              private stockDatabase: StockDatabaseService,
              private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    // this.updateLocal.updateCategories();
    // this.updateLocal.updateSuppliers();
    // this.updateLocal.updateUnits();
    // this.updateLocal.updateReceipts();
    this.updateLocal.updateStock();
  }

  async insertCategory() {
    await this.httpClient.get<CategoryI[]>('/assets/datadumps/category.json').subscribe(value => {
      value.forEach((value1, index, array) => {
        this.stockDatabase.addCategory(value1, value2 => {
          if (value2 === null) {
            console.log(' error happened at ---> ' + index);
          } else {
            console.log('index number ---> ' + index);
            console.log(value2);
          }
        });
      });
    }, error1 => {
      console.log('http error ' + error1);
    });
  }

  async insertSuppliers() {
    await this.httpClient.get<SupplierI[]>('/assets/datadumps/suppliers.json').subscribe(value => {
      value.forEach((value1, index, array) => {
        this.stockDatabase.addSupplier(value1, value2 => {
          if (value2 === null) {
            console.log(' error happened at ---> ' + index);
          } else {
            console.log('index number ---> ' + index);
            console.log(value2);
          }
        });
      });
    }, error1 => {
      console.log('http error ' + error1);
    });
  }

  async insertStocks() {
    await this.httpClient.get<Stock[]>('/assets/datadumps/retail_stock.json').subscribe(value => {
      value.forEach((value1, index, array) => {
        this.stockDatabase.addStock(value1, value2 => {
          console.log('Index  --> ' + index);
          console.log(value2);
        });
        // const documentReference = this.firestore.collection('stocks').ref.doc();
        // value1.id = documentReference.id;
        // documentReference.set(value1).then(value2 => {
        //   console.log('Done insert ' + value1.product);
        // }).catch(reason => {
        //   console.log(reason);
        // });
      });
    }, error1 => {
      console.log(error1);
    });
  }

  async insertSales() {
    await this.httpClient.get<CashSaleI[]>('/assets/datadumps/cash_sale.json').subscribe(value => {
      // const writeBatch = this.firestore.firestore.batch();
      value.forEach(value1 => {
        const documentReference = this.firestore.collection('sales').ref.doc();
        value1.id = documentReference.id;
        documentReference.set(value1).then(value2 => {
          console.log('Done insert ' + value1.product);
        }).catch(reason => {
          console.log(reason);
        });
      });
    }, error1 => {
      console.log(error1);
    });
  }

  async insertPurchase() {
    await this.httpClient.get<PurchaseI[]>('/assets/datadumps/credit_purchase.json').subscribe(value => {
      // const writeBatch = this.firestore.firestore.batch();
      value.forEach(value1 => {
        const documentReference = this.firestore.collection('purchases').ref.doc();
        value1.id = documentReference.id;
        documentReference.set(value1).then(value2 => {
          console.log('Done insert ' + value1.product);
        }).catch(reason => {
          console.log(reason);
        });
      });
    }, error1 => {
      console.log(error1);
    });
  }

}
