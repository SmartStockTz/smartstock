import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {StorageService} from 'src/app/modules/lib/services/storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LogService} from 'src/app/modules/lib/services/log.service';
import {Observable, of} from 'rxjs';
import {UnitsModel} from 'src/app/modules/stocks/models/units.model';
import {FormControl, Validators} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ReportService} from '../services/report.service';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';
import { toSqlDate } from '../../lib/utils/date.util';


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
  selector: 'smartstock-product-performance-report',
  template: `
    <div class="col-12">
      <div>
        <mat-card class="mat-elevation-z3">
          <h6>Product Performance Report</h6>

          <mat-card-header>
            <mat-form-field style="margin: 0 4px;">
              <mat-label>From date</mat-label>
              <input matInput (click)="startDatePicker.open()" [matDatepicker]="startDatePicker"
                     [formControl]="startDateFormControl">
              <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #startDatePicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field style="margin: 0 4px;">
              <mat-label>To date</mat-label>
              <input matInput (click)="endDatePicker.open()" [matDatepicker]="endDatePicker"
                     [formControl]="endDateFormControl">
              <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #endDatePicker></mat-datepicker>
            </mat-form-field>
            <span style="flex-grow: 1;"></span>
            <mat-form-field>
              <mat-label>Filter</mat-label>
              <input matInput [formControl]="filterFormControl" placeholder="Eg. Piriton">
            </mat-form-field>
            <!--<mat-form-field>-->
            <!--<mat-label>Sales type</mat-label>-->
            <!--<mat-select [formControl]="channelFormControl">-->
            <!--<mat-option value="retail">Retail</mat-option>-->
            <!--<mat-option value="whole">Whole sale</mat-option>-->
            <!--</mat-select>-->
            <!--</mat-form-field>-->
          </mat-card-header>

          <smartstock-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved || isLoading"></smartstock-data-not-ready>

          <div *ngIf="!noDataRetrieved  && !isLoading">
            <table mat-table [dataSource]="productPerformanceDatasource" matSort>

              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
                <td mat-cell *matCellDef="let element">{{element._id}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
                <td mat-cell *matCellDef="let element">{{element.category}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="quantitySold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity sold</th>
                <td mat-cell *matCellDef="let element">{{element.quantitySold | number}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="firstSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>First sold</th>
                <td mat-cell *matCellDef="let element">{{element.firstSold}}</td>
                <td mat-footer-cell *matFooterCellDef>
                </td>
              </ng-container>

              <ng-container matColumnDef="lastSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Last sold</th>
                <td matRipple mat-cell *matCellDef="let element">{{element.lastSold}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="costOfGoodSold">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost of goods sold</th>
                <td mat-cell
                    *matCellDef="let element">{{element.costOfGoodsSold | currency: ' TZS'}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>

              <ng-container matColumnDef="grossProfit">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Gross profit</th>
                <td mat-cell *matCellDef="let element">{{element.sales - element.costOfGoodsSold | currency: ' TZS'}}</td>
                <td mat-footer-cell *matFooterCellDef></td>
              </ng-container>


              <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
              <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                  *matRowDef="let row; columns: stockColumns;"></tr>
              <!--          <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="stockColumns"></tr>-->

            </table>
          </div>

          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['../styles/product-performance.style.css'],
  providers: [
    ReportService
  ]
})
export class ProductPerformanceComponent extends DeviceInfoUtil implements OnInit {
  private productPerformanceFetchProgress = false;
  startDateFormControl = new FormControl('', [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  channelFormControl = new FormControl('', [Validators.nullValidator]);
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
              private readonly indexDb: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly _report: ReportService,
  ) {
    super();
  }

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsModel[]>;
  productPerformanceDatasource: MatTableDataSource<ProductPerformanceI>;
  stockColumns = ['product', 'category', 'quantitySold', 'firstSold', 'lastSold', 'costOfGoodSold', 'grossProfit'];


  ngOnInit() {
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
    this._report.getProductPerformanceReport(channel, from, to).then(data => {
      this.isLoading = false;
      this.noDataRetrieved = false; // loading is done and some data is received
      this.productPerformanceReport = data.length > 0 ? data[0].total : 0;
      this.productPerformanceDatasource = new MatTableDataSource(data);
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
