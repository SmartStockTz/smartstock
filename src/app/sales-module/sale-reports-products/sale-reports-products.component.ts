import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {CashSaleI} from '../../model/CashSale';
import {SellerDashboardService} from '../../services/seller-dashboard.service';
import {toSqlDate} from '../../utils/date';

@Component({
  selector: 'app-sale-reports-products',
  templateUrl: './sale-reports-products.component.html',
  styleUrls: ['./sale-reports-products.component.css'],
  providers: [
    SellerDashboardService
  ]
})
export class SaleReportsProductsComponent implements OnInit {
  dateFormControl = new FormControl();
  getProductsProgress = false;
  columns = ['product', 'quantity', 'amount'];
  soldProductsDatasource: MatTableDataSource<CashSaleI>;
  soldProductsArray: CashSaleI[] = [];

  @ViewChild(MatPaginator, {static: true}) soldProductPaginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private readonly _report: SellerDashboardService,
              private readonly _snack: MatSnackBar) {
  }

  ngOnInit() {
    this.dateFormControl.setValue(toSqlDate(new Date()));
    this._getSoldProduct(toSqlDate(new Date()));
    this.dateFormControl.valueChanges.subscribe(value => {
      this.refreshProducts();
    });
  }

  private _getSoldProduct(date: string) {
    this.getProductsProgress = true;
    this._report.getSoldProductsByDate(date).then(value => {
      this.soldProductsArray = value;
      this.soldProductsDatasource = new MatTableDataSource<CashSaleI>(this.soldProductsArray);
      this.soldProductsDatasource.paginator = this.soldProductPaginator;
      this.soldProductsDatasource.sort = this.sort;
      this.getProductsProgress = false;
    }).catch(reason => {
      console.log(reason);
      this.soldProductsDatasource = new MatTableDataSource<CashSaleI>(this.soldProductsArray);
      this.getProductsProgress = false;
    });
  }

  refreshProducts() {
    this._getSoldProduct(toSqlDate(new Date(this.dateFormControl.value)));
  }
}
