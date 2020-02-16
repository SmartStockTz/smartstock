import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {toSqlDate} from '../../utils/date';
import {AdminDashboardService} from '../../services/admin-dashboard.service';

@Component({
  selector: 'app-dashboard-quick-report',
  templateUrl: './dashboard-quick-report.component.html',
  styleUrls: ['./dashboard-quick-report.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class DashboardQuickReportComponent implements OnInit {
  quickReportDateFormControl = new FormControl();
  totalSale = 0;
  totalCostOfGoodSold = 0;
  totalSaleGetProgress = false;
  costOfGoodSoldProgress = false;

  constructor(private readonly _report: AdminDashboardService,
              private readonly _snack: MatSnackBar) {
  }

  ngOnInit() {
    this.quickReportDateFormControl.setValue(toSqlDate(new Date()));
    this._getTotalSaleReport(toSqlDate(new Date()));
    this._getTotalCostOfGoodSold(toSqlDate(new Date()));

    this.quickReportDateFormControl.valueChanges.subscribe(value => {
      this.refreshQuickReport();
    });
  }

  refreshQuickReport() {
    this._getTotalSaleReport(toSqlDate(new Date(this.quickReportDateFormControl.value)));
    this._getTotalCostOfGoodSold(toSqlDate(new Date(this.quickReportDateFormControl.value)));
  }

  private _getTotalSaleReport(date: string) {
    this.totalSaleGetProgress = true;
    this._report.getTotalSaleByDate(date).then(data => {
      this.totalSale = data.length > 0 ? data[0].total : 0;
      this.totalSaleGetProgress = false;
    }).catch(reason => {
      this.totalSale = 0;
      console.log(reason);
      this._snack.open('Fails to get total sales', 'Ok', {
        duration: 3000
      });
      this.totalSaleGetProgress = false;
    });
  }

  private _getTotalCostOfGoodSold(date: string) {
    this.costOfGoodSoldProgress = true;
    this._report.getTotalCostOfGoodSoldByDate(date).then(data => {
      this.totalCostOfGoodSold = data.length > 0 ? data[0].total : 0;
      this.costOfGoodSoldProgress = false;
    }).catch(reason => {
      this.totalCostOfGoodSold = 0;
      console.log(reason);
      this._snack.open('Fails to get total cost of good sold', 'Ok', {
        duration: 3000
      });
      this.costOfGoodSoldProgress = false;
    });
  }

  _getProfit() {
    return this.totalSale - this.totalCostOfGoodSold;
  }

}
