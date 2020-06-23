import {Component, OnInit, ViewChild} from '@angular/core';
import {json2Csv} from '../../../../utils/json2csv';
import {AdminDashboardService} from '../../../../services/admin-dashboard.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CartModel} from '../../../../model/cart';
import {toSqlDate} from '../../../../utils/date';
import {FormControl, Validators} from '@angular/forms';

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
    json2Csv(this.cartColumns, this.carts.filteredData).then(console.log);
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
