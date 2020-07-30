import {Component, OnInit, ViewChild} from '@angular/core';
import {DeviceInfo} from '../../../shared/DeviceInfo';
import {FormControl, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {StorageService} from '../../../../services/storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService} from '../../../../services/log.service';
import {AdminDashboardService} from '../../../../services/admin-dashboard.service';
import {Observable, of} from 'rxjs';
import {UnitsI} from '../../../../model/UnitsI';
import {MatTableDataSource} from '@angular/material/table';
import {toSqlDate} from '../../../../utils/date';
import {ProductPerformanceI} from '../product-performance-report/product-performance-report.component';

@Component({
  selector: 'app-profit-by-category',
  templateUrl: './profit-by-category.component.html',
  styleUrls: ['./profit-by-category.component.css']
})
export class ProfitByCategoryComponent extends DeviceInfo implements OnInit {
  private productPerformanceFetchProgress = false;
  startDateFormControl = new FormControl(Date.now().toString(), [Validators.nullValidator]);
  endDateFormControl = new FormControl(Date.now().toString(), [Validators.nullValidator]);
  channelFormControl = new FormControl('retail', [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  startDate;
  endDate;
  channel = 'retail';
  productPerformanceReport: any;
  isLoading = false;
  noDataRetrieved = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private readonly router: Router,
              private readonly storageService: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logService: LogService,
              private readonly adminDashboardService: AdminDashboardService,
  ) {
    super();
  }

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsI[]>;
  productPerformanceDatasource: MatTableDataSource<ProductPerformanceI> = new MatTableDataSource<ProductPerformanceI>([]);
  stockColumns = ['category', 'sales', 'quantitySold', 'firstSold', 'lastSold'];


  ngOnInit() {
    this.productPerformanceDatasource.sort = this.sort;
    this.channelFormControl.setValue('retail');
    this.startDate = toSqlDate(new Date());
    this.endDate = toSqlDate(new Date());

    this._getProductReport(this.channel, this.startDate, this.endDate);
    this._dateRangeListener();

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.productPerformanceDatasource.filter = filterValue.trim().toLowerCase();
    });
  }


  private _getProductReport(channel: string, from: string, to: string) {
    this.isLoading = true; // begin fetching data
    this.productPerformanceFetchProgress = true;
    // console.log('from: ' + from + ' to: ' + to);
    this.adminDashboardService.getSalesByCategory(channel, from, to).then(data => {
      this.isLoading = false;
      this.noDataRetrieved = false; // loading is done and some data is received
      this.productPerformanceReport = data.length > 0 ? data[0].total : 0;
      this.productPerformanceDatasource.data = data;
      this.productPerformanceDatasource.paginator = this.paginator;
      this.productPerformanceDatasource.sort = this.sort;
      this.productPerformanceFetchProgress = false;
    }).catch(reason => {
      this.isLoading = false;
      this.noDataRetrieved = true;
      this.productPerformanceReport = 0;
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
