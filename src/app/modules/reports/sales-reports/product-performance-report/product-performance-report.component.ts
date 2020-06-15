import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {StorageService} from 'src/app/services/storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LogService} from 'src/app/services/log.service';
import {Observable, of} from 'rxjs';
import {UnitsI} from 'src/app/model/UnitsI';
import {FormControl, Validators} from '@angular/forms';
import {AdminDashboardService} from 'src/app/services/admin-dashboard.service';
import {toSqlDate} from 'src/app/utils/date';
import {DeviceInfo} from '../../../shared/DeviceInfo';


export interface ProductPerformanceI {
  _id: string;
  quantitySold: number;
  purchase: any;
  firstSold: any;
  lastSold: any;
  sales: number;
  costOfGoodsSold: number;
  grossProfit: number;
}

@Component({
  selector: 'app-product-performance-report',
  templateUrl: './product-performance-report.component.html',
  styleUrls: ['./product-performance-report.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class ProductPerformanceReportComponent extends DeviceInfo implements OnInit {
  private productPerformanceFetchProgress = false;
  startDateFormControl = new FormControl('', [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  channelFormControl = new FormControl('', [Validators.nullValidator]);
  startDate;
  endDate;
  channel = 'retail';
  productPerformanceReport: any;

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly _report: AdminDashboardService,
  ) {
    super();
  }

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsI[]>;
  productPerformanceDatasource: MatTableDataSource<ProductPerformanceI>;
  stockColumns = ['product', 'quantitySold', 'firstSold', 'lastSold', 'costOfGoodSold', 'grossProfit'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  ngOnInit() {
    this.channelFormControl.setValue('retail');
    this._getProductReport(this.channel, this.startDate, this.endDate);
    this._dateRangeListener();
  }


  private _getProductReport(channel: string, from: string, to: string) {
    this.productPerformanceFetchProgress = true;
    this._report.getProductPerformanceReport(channel, from, to).then(data => {
      this.productPerformanceReport = data.length > 0 ? data[0].total : 0;
      // console.log(data);
      this.productPerformanceDatasource = new MatTableDataSource(data);
      this.productPerformanceDatasource.paginator = this.paginator;
      this.productPerformanceFetchProgress = false;
    }).catch(reason => {
      this.productPerformanceReport = 0;
      // console.log(reason);
      this.snack.open('Fails to get product performance report', 'Ok', {
        duration: 3000
      });
      this.productPerformanceFetchProgress = false;
    });
  }

  private _dateRangeListener() {
    this.startDateFormControl.valueChanges.subscribe(value => {
      this.startDate = toSqlDate(value);
      this._getProductReport(this.channel, this.startDate, this.endDate);
    });
    this.endDateFormControl.valueChanges.subscribe(value => {
      this.endDate = toSqlDate(value);
      this._getProductReport(this.channel, this.startDate, this.endDate);
    });
    this.channelFormControl.valueChanges.subscribe(value => {
      this.channel = value;
      this._getProductReport(this.channel, this.startDate, this.endDate);
    });
  }

}
