import {Component, OnInit, ViewChild} from '@angular/core';
import {json2csv} from '../services/json2csv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CartModel} from '../models/cart.model';
/****** move to common **********/
import {toSqlDate} from '../../common-lib/utils/date';
/****** move to common **********/
import {FormControl, Validators} from '@angular/forms';
import {ReportService} from '../services/report.service';

@Component({
  selector: 'app-cart-report',
  template: `
    <div class="col-12" style="margin-top: 1em">
      <div>
        <mat-card class="mat-elevation-z3">

          <div style="display: flex; flex-flow: row; align-items: center">
            <h6 class="col-8">Cart Report</h6>
            <span style="flex-grow: 1"></span>
            <button [mat-menu-trigger-for]="exportMenu" mat-icon-button>
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
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


          <div style="display: flex; justify-content: center">
            <mat-spinner *ngIf="isLoading"></mat-spinner>
          </div>

          <app-data-not-ready *ngIf="noDataRetrieved  && !isLoading"></app-data-not-ready>
          <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="carts" matSort>

            <ng-container matColumnDef="receipt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Cart Receipt</th>
              <td mat-cell *matCellDef="let element">{{element._id}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="total_amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Amount</th>
              <td mat-cell *matCellDef="let element">{{element.amount}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="total_items">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Items</th>
              <td mat-cell *matCellDef="let element">{{element.quantity}}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="seller">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Seller</th>
              <td mat-cell *matCellDef="let element">{{element.seller }}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date Sold</th>
              <td mat-cell *matCellDef="let element">{{element.date }}</td>
              <td mat-footer-cell *matFooterCellDef></td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cartColumns"></tr>
            <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                *matRowDef="let row; columns: cartColumns;"></tr>
            <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="cartColumns"></tr>

          </table>
          <mat-paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      </div>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()"> Export</button>
    </mat-menu>
  `,
  styleUrls: ['../styles/cart.component.css'],
  providers: [
    ReportService
  ]
})
export class CartComponent implements OnInit {

  constructor(private readonly report: ReportService, private readonly snack: MatSnackBar) {
  }

  startDate;
  endDate;
  channel = 'retail';
  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  carts: MatTableDataSource<CartModel>;
  cartColumns = ['receipt', 'total_amount', 'total_items', 'seller', 'date'];

  startDateFormControl = new FormControl('', [Validators.nullValidator]);
  endDateFormControl = new FormControl('', [Validators.nullValidator]);
  channelFormControl = new FormControl('', [Validators.nullValidator]);
  filterFormControl = new FormControl('', [Validators.nullValidator]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.channelFormControl.setValue('retail');
    this.startDate = toSqlDate(new Date());
    this.endDate = toSqlDate(new Date());

    this.getSoldCarts(this.startDate, this.endDate, this.channel);
    this._dateRangeListener();

    this.filterFormControl.valueChanges.subscribe(filterValue => {
      this.carts.filter = filterValue.trim().toLowerCase();
    });
  }

  getSoldCarts(channel: string, from: string, to: string) {
    this.isLoading = true;
    this.report.getSoldCarts(from, to, channel).then(data => {
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
    json2csv(this.cartColumns, this.carts.filteredData).then(console.log);
  }

  private _dateRangeListener() {
    this.startDateFormControl.valueChanges.subscribe(value => {
      this.startDate = toSqlDate(value);
      this.getSoldCarts(this.channel, this.startDate, this.endDate);
    });
    this.endDateFormControl.valueChanges.subscribe(value => {
      this.endDate = toSqlDate(value);
      this.getSoldCarts(this.channel, this.startDate, this.endDate);
    });
    this.channelFormControl.valueChanges.subscribe(value => {
      this.channel = value;
      this.getSoldCarts(this.channel, this.startDate, this.endDate);
    });
  }

}
