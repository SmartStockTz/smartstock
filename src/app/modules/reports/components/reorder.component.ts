import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StorageService} from 'src/app/modules/lib/services/storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService} from 'src/app/modules/lib/services/log.service';
import {Observable, of} from 'rxjs';
import {UnitsModel} from 'src/app/modules/stocks/models/units.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AdminDashboardService} from 'src/app/modules/dashboard/services/admin-dashboard.service';
import {json2csv} from '../services/json2csv.service';
import {StockModel} from '../../stocks/models/stock.model';
import {ReportService} from '../services/report.service';


@Component({
  selector: 'smartstock-stock-reorder-report',
  template: `
    <div>
      <mat-card class="mat-elevation-z3">

        <div style="display: flex; flex-flow: row; align-items: center">
          <h6>StockModel Reorder</h6>
          <span style="flex-grow: 1"></span>
          <mat-form-field>
            <mat-label>Filter</mat-label>
            <input matInput [formControl]="filterFormControl" placeholder="Eg. Piriton">
          </mat-form-field>
          <button [mat-menu-trigger-for]="exportMenu" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>

        <!--      <div style="display: flex; justify-content: center">-->
        <!--        <mat-spinner *ngIf="isLoading"></mat-spinner>-->
        <!--      </div>-->

        <smartstock-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved || isLoading"></smartstock-data-not-ready>

        <div *ngIf="!noDataRetrieved  && !isLoading">
          <table mat-table [dataSource]="stockReorderDatasource" matSort>

            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
              <td mat-cell *matCellDef="let element">{{element.product}}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
              <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
            </ng-container>

            <ng-container matColumnDef="reorder">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Reorder level</th>
              <td mat-cell *matCellDef="let element">{{element.reorder | number}}</td>
            </ng-container>

            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Supplier</th>
              <td matRipple mat-cell *matCellDef="let element">{{element.supplier}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
            <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: stockColumns;"></tr>

          </table>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 20, 100]" showFirstLastButtons></mat-paginator>

      </mat-card>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()"> Export</button>
    </mat-menu>
  `,
  styleUrls: ['../styles/reorder.style.css'],
  providers: [
    AdminDashboardService
  ]
})
export class ReorderComponent implements OnInit {

  private stockFetchProgress = false;
  startDateFormControl = new FormControl('', [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  startDate;
  endDate;
  stockReportGetProgress = false;
  stockReport;
  isLoading = false;
  noDataRetrieved = true;

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly reportService: ReportService) {
  }

  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsModel[]>;
  stockReorderDatasource: MatTableDataSource<StockModel>;
  stockColumns = ['product', 'quantity', 'reorder', 'supplier'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this._getStockReport();

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.stockReorderDatasource.filter = filterValue.trim().toLowerCase();
    });
  }

  private _getStockReport() {
    this.isLoading = true;
    this.stockReportGetProgress = true;
    this.reportService.getStockReorderReportReport(0, 1000).then(data => {
      this.stockReport = data.length > 0 ? data[0].total : 0;
      this.isLoading = false;
      if (data && Array.isArray(data) && data.length > 0) {
        this.stockReorderDatasource = new MatTableDataSource(data);
        this.stockReorderDatasource.paginator = this.paginator;
        this.stockReorderDatasource.sort = this.sort;
        this.stockReportGetProgress = false;
        this.noDataRetrieved = false;
      } else {
        this.noDataRetrieved = true;
      }

    }).catch(reason => {
      this.isLoading = false;
      this.stockReport = 0;
      console.log(reason);
      this.snack.open('Fails to get total sales', 'Ok', {
        duration: 3000
      });
      this.stockReportGetProgress = false;
    });
  }

  exportReport() {
    // console.log(this.stocks);
    json2csv(this.stockColumns, this.stockReorderDatasource.filteredData).catch();
  }

  // dateRange() {
  //   if(this.startDateFormControl.value !== '' && this.endDateFormControl.value !== '') {
  //     this.stockDatasource.data = this.stockDatasource.data.filter(value=>Date.parse(value.expire)
  //     >= this.startDate && Date.parse(value.expire) <= this.endDate);

  //   } else if(this.startDateFormControl.value !== '') {
  //     this.stockDatasource.data = this.stockDatasource.data.filter(value=>Date.parse(value.expire) >= this.startDate) ;
  //   } else if(this.endDateFormControl.value !== '') {
  //     this.stockDatasource.data = this.stockDatasource.data.filter(value=>Date.parse(value.expire) <= this.endDate) ;
  //   }
  // }

}
