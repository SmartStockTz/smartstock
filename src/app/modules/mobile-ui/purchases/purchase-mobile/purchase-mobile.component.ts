import { Component, OnInit } from '@angular/core';
import {DeviceInfo} from '../../../shared/DeviceInfo';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {Observable, of} from 'rxjs';

import {PurchaseI} from '../../../../model/PurchaseI';
import {PurchaseDatabaseService} from '../../../../services/purchase-database.service';
import {StockDetailsComponent} from '../../../stocks/stock/stock.component';
import {InfoMessageService} from '../../../../services/info-message.service';
import {PurchaseDetailsComponent} from '../../../purchase/purchase/purchase.component';

@Component({
  selector: 'app-purchase-mobile',
  templateUrl: './purchase-mobile.component.html',
  styleUrls: ['./purchase-mobile.component.css'],
  providers: [
    PurchaseDatabaseService
  ]
})
export class PurchaseMobileComponent extends DeviceInfo implements OnInit {
  getPurchaseProgress = false;
  loadMoreProgress = false;
  size: 100;
  skip: 0;
  purchasesArray: PurchaseI[];
  purchases: Observable<PurchaseI[]>;

  constructor(private readonly purchaseDatabase: PurchaseDatabaseService,
              private readonly bottomSheet: MatBottomSheet,
              private readonly snack: InfoMessageService) {
    super();
  }

  ngOnInit() {
    this._getAllPurchases();
  }

  handleSearch(query: string) {
    if (query) {
      // this.purchasesDatasource.filter = query.toLowerCase();
    } else {
      // this.purchasesDatasource.filter = '';
    }
  }

  _getAllPurchases() {
    this.getPurchaseProgress = true;
    this.purchaseDatabase.getAllPurchase({}).then(value => {
      this.purchasesArray = value;
      this.purchases = of(this.purchasesArray);
      this.getPurchaseProgress = false;
    }).catch(reason => {
      this.getPurchaseProgress = false;
      this.snack.showMobileInfoMessage('Fails to get purchases, try again');
      console.log(reason);
    });
  }

  reload() {
    this._getAllPurchases();
  }

  loadMore() {
    this.loadMoreProgress = true;
    this.purchaseDatabase.getAllPurchase({skip: this.purchasesArray.length}).then(value => {
      if (value.length > 0) {
        const oldData = this.purchasesArray;
        value.forEach(value1 => {
          oldData.push(value1);
        });
        this.purchases = of(this.purchasesArray);
      } else {
        this.snack.showMobileInfoMessage('No more data');
      }
      this.loadMoreProgress = false;
    }).catch(reason => {
      this.loadMoreProgress = false;
      this.snack.showMobileInfoMessage('Fails to load more purchases');
      console.log(reason);
    });
  }

  showPurchaseDetails(purchase: PurchaseI) {
    this.bottomSheet.open(PurchaseDetailsComponent, {
      data: purchase,
      closeOnNavigation: true,
    });
  }

  recordPayment(purchase: PurchaseI) {
    this.snack.showMobileInfoMessage('Start update payment records...');
    this.purchaseDatabase.recordPayment(purchase.objectId).then(value => {
      this.snack.showMobileInfoMessage('Payments recorded');
      const oldIndex = this.purchasesArray.indexOf(purchase);
      if (oldIndex !== -1) {
        const oldPurchase: PurchaseI = this.purchasesArray[oldIndex];
        oldPurchase.paid = true;
        this.purchasesArray[oldIndex] = oldPurchase;
      }
    }).catch(reason => {
      console.log(reason);
      this.snack.showMobileInfoMessage('Fails to record payments');
    });
  }

  deletePurchase(purchase: PurchaseI) {
    this.snack.showMobileInfoMessage('Start delete process...', 5000);
    this.purchaseDatabase.deletePurchase(purchase).then(_ => {
      // console.log(value);
      this.purchasesArray = this.purchasesArray.filter(value1 => value1.objectId !== purchase.objectId);
      this.purchases = of(this.purchasesArray);
      this.snack.showMobileInfoMessage('Purchase deleted');
    }).catch(reason => {
      console.log(reason);
      this.snack.showMobileInfoMessage('Purchase not deleted, try again', 5000);
    });
  }


}
