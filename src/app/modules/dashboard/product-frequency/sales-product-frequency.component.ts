import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {AdminDashboardService} from '../../../services/admin-dashboard.service';
import {SalesModel} from '../../../model/CashSale';
import {LogService} from '../../../services/log.service';
import {toSqlDate} from '../../../utils/date';

@Component({
  selector: 'app-dashboard-sales-product-frequency',
  templateUrl: './sales-product-frequency.component.html',
  styleUrls: ['./sales-product-frequency.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class SalesProductFrequencyComponent implements OnInit {
  dateFormControl = new FormControl();
  getProductsProgress = false;
  columns = ['product', 'date', 'quantity', 'amount'];
  soldProductsDatasource: MatTableDataSource<SalesModel>;
  soldProductsArray: SalesModel[] = [];
  @ViewChild('soldProductPaginator', {static: true}) soldProductPaginator: MatPaginator;
  productFilterControl = new FormControl('');

  constructor(private readonly _report: AdminDashboardService,
              private readonly _logger: LogService,
              private readonly _snack: MatSnackBar) {
  }

  ngOnInit() {
    this.productFilterControl.valueChanges.subscribe(value => {
      if (value) {
        this.soldProductsDatasource.filter = value.toString().toLocaleLowerCase();
      }
    });
    this._getSoldProduct();
  }

  reloadProducts() {
    this.getProductsProgress = true;
    const initDate = toSqlDate(new Date(this.dateFormControl.value));
    this._report.getFrequentlySoldProductsByDate(initDate).then(value => {
      this._logger.i(value, 'SalesProductFrequencyComponent:42');
      this.soldProductsArray = value;
      this.soldProductsDatasource = new MatTableDataSource<SalesModel>(this.soldProductsArray);
      this.soldProductsDatasource.paginator = this.soldProductPaginator;
      this.getProductsProgress = false;
    }).catch(reason => {
      this._logger.e(reason, 'SalesProductFrequencyComponent:47');
      this.soldProductsDatasource = new MatTableDataSource<SalesModel>(this.soldProductsArray);
      this.getProductsProgress = false;
    });
  }

  _getSoldProduct() {
    const initDate = toSqlDate(new Date());
    this.dateFormControl.setValue(initDate);
    this.getProductsProgress = true;
    this._report.getFrequentlySoldProductsByDate(initDate).then(value => {
      this._logger.i(value, 'SalesProductFrequencyComponent:42');
      this.soldProductsArray = value;
      this.soldProductsDatasource = new MatTableDataSource<SalesModel>(this.soldProductsArray);
      this.soldProductsDatasource.paginator = this.soldProductPaginator;
      this.getProductsProgress = false;
    }).catch(reason => {
      this._logger.e(reason, 'SalesProductFrequencyComponent:47');
      this.soldProductsDatasource = new MatTableDataSource<SalesModel>(this.soldProductsArray);
      this.getProductsProgress = false;
    });
  }
}
