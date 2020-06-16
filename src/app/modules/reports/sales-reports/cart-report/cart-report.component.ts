import {Component, OnInit, ViewChild} from '@angular/core';
import {json2Csv} from '../../../../utils/json2csv';
import {AdminDashboardService} from '../../../../services/admin-dashboard.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CartModel} from '../../../../model/cart';
import {toSqlDate} from '../../../../utils/date';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-cart-report',
  templateUrl: './cart-report.component.html',
  styleUrls: ['./cart-report.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class CartReportComponent implements OnInit {

  constructor(private readonly report: AdminDashboardService, private readonly snack: MatSnackBar) {
  }

  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  carts: MatTableDataSource<CartModel>;
  cartColumns = ['receipt', 'total_amount', 'total_items', 'seller', 'date'];

  startDateFormControl = new FormControl('', [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  channelFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.getSoldCarts();
  }

  getSoldCarts() {
    this.isLoading = true;
    this.report.getSoldCarts(toSqlDate(new Date()), toSqlDate(new Date()), 'retail').then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.carts = new MatTableDataSource(data);
        this.carts.paginator = this.paginator;
        this.stocks = data;
        this.carts.sort = this.sort;
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }
    }).catch(reason => {
      this.isLoading = false;
      this.snack.open('Fails to get total expired products', 'Ok', {
        duration: 3000
      });
    });
  }

  exportReport() {
    // console.log(this.stocks);
    json2Csv(this.cartColumns, this.carts.data).then(console.log);
  }
}
