import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {json2csv} from '../services/json2csv.service';
import {FormControl, Validators} from '@angular/forms';
import {StockModel} from '../../stocks/models/stock.model';
import {ReportService} from '../services/report.service';

@Component({
  selector: 'smartstock-products-about-to-expire',
  template: `
    <div>
      <mat-card class="mat-elevation-z3">
        <div style="display: flex; flex-wrap: wrap; flex-flow: row; align-items: center; margin-right: 100px;">
          <h6 class="col-8">Near to Expire</h6>
          <mat-form-field>
            <mat-label>Filter</mat-label>
            <input matInput [formControl]="filterFormControl" placeholder="Eg. Piriton">
          </mat-form-field>
          <button [mat-menu-trigger-for]="exportMenu" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>

        <smartstock-data-not-ready [isLoading]="isLoading" *ngIf="noDataRetrieved  || isLoading"></smartstock-data-not-ready>

        <table mat-table *ngIf="!noDataRetrieved  && !isLoading" [dataSource]="expiredProducts" matSort>

          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
            <td mat-cell *matCellDef="let element">{{element.product}}</td>
          </ng-container>

          <ng-container matColumnDef="expire">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Expiry Date</th>
            <td mat-cell *matCellDef="let element">{{element.expire | date}}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity Remaining</th>
            <td mat-cell *matCellDef="let element">{{element.quantity | number}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
          <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
              *matRowDef="let row; columns: stockColumns;"></tr>

        </table>

        <mat-paginator [pageSizeOptions]="[5, 20, 100]" showFirstLastButtons></mat-paginator>

      </mat-card>
    </div>

    <mat-menu #exportMenu>
      <button mat-menu-item (click)="exportReport()"> Export</button>
    </mat-menu>
  `,
  styleUrls: ['../styles/expireNear.style.css'],
  providers: [
    ReportService
  ]
})
export class ExpireNearComponent implements OnInit {

  constructor(private readonly report: ReportService,
              private readonly snack: MatSnackBar) {
  }

  isLoading = false;
  noDataRetrieved = true;
  stocks = [];
  expiredProducts: MatTableDataSource<StockModel>;
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
    json2csv(this.stockColumns, this.expiredProducts.filteredData).then(console.log);
  }

}
