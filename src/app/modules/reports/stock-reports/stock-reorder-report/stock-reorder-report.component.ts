import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from 'src/app/services/log.service';
import { StockDatabaseService } from 'src/app/services/stock-database.service';
import { Observable, of } from 'rxjs';
import { UnitsI } from 'src/app/model/UnitsI';
import { Stock } from 'src/app/model/stock';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminDashboardService } from 'src/app/services/admin-dashboard.service';


@Component({
  selector: 'app-stock-reorder-report',
  templateUrl: './stock-reorder-report.component.html',
  styleUrls: ['./stock-reorder-report.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class StockReorderReportComponent implements OnInit {

  private stockFetchProgress = false;
  startDateFormControl = new FormControl('', [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  startDate;
  endDate;
  stockReportGetProgress = false;
  stockReport;

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly _report: AdminDashboardService,
              private readonly stockDatabase: StockDatabaseService) {
  }

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsI[]>;
  stockReorderDatasource: MatTableDataSource<Stock>;
  stockColumns = ['product', 'quantity', 'reorder', 'supplier'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
     this._getStockReport();
  }

  private _getStockReport() {
    this.stockReportGetProgress = true;
    this._report.getStockReorderReportReport().then(data => {
      this.stockReport = data.length > 0 ? data[0].total : 0;
      this.stockReorderDatasource = new MatTableDataSource(data);
      this.stockReorderDatasource.paginator = this.paginator;
      this.stockReorderDatasource.sort = this.sort;
      this.stockReportGetProgress = false;
    }).catch(reason => {
      this.stockReport = 0;
      console.log(reason);
      this.snack.open('Fails to get total landing', 'Ok', {
        duration: 3000
      });
      this.stockReportGetProgress = false;
    });
  }


  // dateRange() {
  //   if(this.startDateFormControl.value !== '' && this.endDateFormControl.value !== '') {
  //     this.stockDatasource.data = this.stockDatasource.data.filter(value=>Date.parse(value.expire) >= this.startDate && Date.parse(value.expire) <= this.endDate);

  //   } else if(this.startDateFormControl.value !== '') {
  //     this.stockDatasource.data = this.stockDatasource.data.filter(value=>Date.parse(value.expire) >= this.startDate) ;
  //   } else if(this.endDateFormControl.value !== '') {
  //     this.stockDatasource.data = this.stockDatasource.data.filter(value=>Date.parse(value.expire) <= this.endDate) ;
  //   }
  // }

}
