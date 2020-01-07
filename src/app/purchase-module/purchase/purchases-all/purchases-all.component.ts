import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {PurchaseI} from '../../../model/PurchaseI';
import {PurchaseDatabaseService} from '../../../services/purchase-database.service';

@Component({
  selector: 'app-purchases-all',
  templateUrl: './purchases-all.component.html',
  styleUrls: ['./purchases-all.component.css']
})
export class PurchasesAllComponent implements OnInit {
  purchasesDatasource: MatTableDataSource<PurchaseI>;
  purchaseTableColumns = ['refNumber', 'channel', 'amount', 'status', 'actions'];
  getPurchaseProgress = false;
  loadMoreProgress = false;
  size: 100;
  skip: 0;

  constructor(private readonly purchaseDatabase: PurchaseDatabaseService,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this._getAllPurchases();
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
}
