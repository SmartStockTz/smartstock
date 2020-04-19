import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {CashSaleI} from '../../model/CashSale';
import {toSqlDate} from '../../utils/date';
import {AdminDashboardService} from '../../services/admin-dashboard.service';
import {LogService} from '../../services/log.service';

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
  columns = ['product', 'date', 'quantity', 'amount'];
  soldProductsDatasource: MatTableDataSource<CashSaleI>;
  soldProductsArray: CashSaleI[] = [];
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

  _getSoldProduct() {
    const initDate = toSqlDate(new Date());
    this.dateFormControl.setValue(initDate);
    this.getProductsProgress = true;
    this._report.getFrequentlySoldProductsByDate(initDate).then(value => {
      this._logger.i(value, 'DashboardFrequentSoldProductComponent:42');
      this.soldProductsArray = value;
      this.soldProductsDatasource = new MatTableDataSource<CashSaleI>(this.soldProductsArray);
      this.soldProductsDatasource.paginator = this.soldProductPaginator;
      this.getProductsProgress = false;
    }).catch(reason => {
      this._logger.e(reason, 'DashboardFrequentSoldProductComponent:47');
      this.soldProductsDatasource = new MatTableDataSource<CashSaleI>(this.soldProductsArray);
      this.getProductsProgress = false;
    });
  }
}
