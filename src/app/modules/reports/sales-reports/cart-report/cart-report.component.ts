import {Component, OnInit, ViewChild} from '@angular/core';
import {json2Csv} from '../../../../utils/json2csv';
import {AdminDashboardService} from '../../../../services/admin-dashboard.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CartModel} from '../../../../model/cart';

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
  cartColumns = ['receipt', 'total_amount', 'total_items', 'seller'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.isLoading = true;
    this.report.getSoldCarts(new Date()).then(data => {
      console.log(data);
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
      console.log(reason);
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
