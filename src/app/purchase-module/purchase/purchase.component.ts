import {Component, Inject, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {PurchaseI} from '../../model/PurchaseI';
import {PurchaseDatabaseService} from '../../services/purchase-database.service';
import {StockDetailsComponent} from '../../stock-module/stock/stock.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent extends DeviceInfo implements OnInit {
  purchasesDatasource: MatTableDataSource<PurchaseI>;
  purchaseTableColumns = ['refNumber', 'channel', 'amount', 'status', 'actions'];
  getPurchaseProgress = false;
  loadMoreProgress = false;
  size: 100;
  skip: 0;

  constructor(private readonly purchaseDatabase: PurchaseDatabaseService,
              private readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this._getAllPurchases();
  }

  handleSearch(query: string) {
    if (query) {
      this.purchasesDatasource.filter = query.toLowerCase();
    } else {
      this.purchasesDatasource.filter = '';
    }
  }

  private _getAllPurchases() {
    this.getPurchaseProgress = true;
    this.purchaseDatabase.getAllPurchase({}).then(value => {
      this.purchasesDatasource = new MatTableDataSource<PurchaseI>(value);
      this.getPurchaseProgress = false;
    }).catch(reason => {
      this.getPurchaseProgress = false;
      this.snack.open('Fails to get purchases, try again', 'Ok', {
        duration: 3000
      });
      console.log(reason);
    });
  }

  reload() {
    this._getAllPurchases();
  }

  loadMore() {
    this.loadMoreProgress = true;
    this.purchaseDatabase.getAllPurchase({skip: this.purchasesDatasource.data.length}).then(value => {
      if (value.length > 0) {
        const oldData = this.purchasesDatasource.data;
        value.forEach(value1 => {
          oldData.push(value1);
        });
        this.purchasesDatasource = new MatTableDataSource<PurchaseI>(oldData);
      } else {
        this.snack.open('No more purchases, you have all', 'Ok', {
          duration: 3000
        });
      }
      this.loadMoreProgress = false;
    }).catch(reason => {
      this.loadMoreProgress = false;
      this.snack.open('Fails to load more purchases', 'Ok', {
        duration: 3000
      });
      console.log(reason);
    });
  }

  showPurchaseDetails(purchase: PurchaseI) {
    this.bottomSheet.open(PurchaseDetailsComponent, {
      data: purchase,
      closeOnNavigation: true,
    });
  }
}

@Component({
  selector: 'app-purchase-details',
  templateUrl: 'purchase-details.html'
})
export class PurchaseDetailsComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<StockDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: PurchaseI) {
  }

  getDate(date: any) {
    if (date && date.iso) {
      return date.iso;
    } else {
      return date;
    }
  }
}
