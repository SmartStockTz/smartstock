import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {CashSaleI} from '../../model/CashSale';
import {SellerDashboardService} from '../../services/seller-dashboard.service';
import {toSqlDate} from '../../utils/date';

@Component({
  selector: 'app-sale-reports-products',
  templateUrl: './sale-reports-products.component.html',
  styleUrls: ['./sale-reports-products.component.css']
})
export class SaleReportsProductsComponent implements OnInit {
  dateFormControl = new FormControl();
  getProductsProgress = false;
  columns = ['product', 'quantity', 'amount'];
  soldProductsDatasource: MatTableDataSource<CashSaleI>;
  soldProductsArray: CashSaleI[] = [];

  @ViewChild('soldProductPaginator', {static: true}) soldProductPaginator: MatPaginator;

  constructor(private readonly _report: SellerDashboardService,
              private readonly _snack: MatSnackBar) {
  }

  ngOnInit() {
    this._getSoldProduct();
  }

  private _getSoldProduct() {
    const initDate = toSqlDate(new Date());
    this.dateFormControl.setValue(initDate);
    this.getProductsProgress = true;
    this._report.getSoldProductsByDate(initDate).then(value => {
      // console.log(value);
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
