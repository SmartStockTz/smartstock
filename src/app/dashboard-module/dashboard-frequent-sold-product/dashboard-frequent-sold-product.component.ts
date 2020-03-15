import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {CashSaleI} from '../../model/CashSale';
import {toSqlDate} from '../../utils/date';
import {AdminDashboardService} from '../../services/admin-dashboard.service';

@Component({
  selector: 'app-dashboard-frequent-sold-product',
  templateUrl: './dashboard-frequent-sold-product.component.html',
  styleUrls: ['./dashboard-frequent-sold-product.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class DashboardFrequentSoldProductComponent implements OnInit {
  dateFormControl = new FormControl();
  getProductsProgress = false;
  columns = ['product', 'quantity', 'amount'];
  soldProductsDatasource: MatTableDataSource<CashSaleI>;
  soldProductsArray: CashSaleI[] = [];

  @ViewChild('soldProductPaginator', {static: true}) soldProductPaginator: MatPaginator;

  constructor(private readonly _report: AdminDashboardService,
              private readonly _snack: MatSnackBar) {
  }

  ngOnInit() {
    this._getSoldProduct();
  }

  private _getSoldProduct() {
    const initDate = toSqlDate(new Date());
    this.dateFormControl.setValue(initDate);
    this.getProductsProgress = true;
    this._report.getFrequentlySoldProductsByDate(initDate).then(value => {
      console.log(value);
      this.soldProductsArray = value;
      this.soldProductsDatasource = new MatTableDataSource<CashSaleI>(this.soldProductsArray);
      this.soldProductsDatasource.paginator = this.soldProductPaginator;
      this.getProductsProgress = false;
    }).catch(reason => {
      console.log(reason);
      this.soldProductsDatasource = new MatTableDataSource<CashSaleI>(this.soldProductsArray);
      this.getProductsProgress = false;
    });
  }

}
