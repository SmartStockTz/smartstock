import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminDashboardService} from '../../../../services/admin-dashboard.service';
import {MatTableDataSource} from '@angular/material/table';
import {Stock} from '../../../../model/stock';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from '@angular/material/snack-bar';
import {json2Csv} from '../../../../utils/json2csv';

@Component({
  selector: 'app-expired-products-report',
  templateUrl: './expired-products-report.component.html',
  styleUrls: ['./expired-products-report.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class ExpiredProductsReportComponent implements OnInit {
  constructor(private readonly report: AdminDashboardService,
              private readonly snack: MatSnackBar) {
  }

  isLoading = false;
  noDataRetrieved = true;
  expiredProducts: MatTableDataSource<Stock>;
  stockColumns = ['product', 'expire'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.isLoading = true;
    this.report.getExpiredProducts(new Date(), 0, 1000).then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.expiredProducts = new MatTableDataSource(data);
        this.expiredProducts.paginator = this.paginator;
        this.expiredProducts.sort = this.sort;
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
    json2Csv(this.stockColumns, this.expiredProducts.data).then(console.log);
  }

}
