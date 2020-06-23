import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminDashboardService} from '../../../../services/admin-dashboard.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {Stock} from '../../../../model/stock';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2Csv} from '../../../../utils/json2csv';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-products-about-to-expire',
  templateUrl: './products-about-to-expire.component.html',
  styleUrls: ['./products-about-to-expire.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class ProductsAboutToExpireComponent implements OnInit {

  constructor(private readonly report: AdminDashboardService,
              private readonly snack: MatSnackBar) {
  }

  isLoading = false;
  noDataRetrieved = true;
  stocks = []
  expiredProducts: MatTableDataSource<Stock>;
  stockColumns = ['product', 'expire', 'quantity'];

  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.isLoading = true;
    this.report.getProductsAboutToExpire().then(data => {
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.expiredProducts = new MatTableDataSource(data);
        this.expiredProducts.paginator = this.paginator;
        this.stocks = data;
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

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.expiredProducts.filter = filterValue.trim().toLowerCase();
    });
  }

  exportReport() {
    // console.log(this.stocks);
    json2Csv(this.stockColumns, this.expiredProducts.filteredData).then(console.log);
  }

}
