import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import * as Highcharts from 'highcharts';
import {AdminDashboardService} from '../../../services/admin-dashboard.service';
import {toSqlDate} from '../../../utils/date';

@Component({
  selector: 'app-dashboard-sale-trends',
  templateUrl: './sales-trends.component.html',
  styleUrls: ['./sales-trends.component.css'],
  providers: [
    AdminDashboardService
  ]
})
export class SalesTrendsComponent implements OnInit {
  salesTrendDayFromDateFormControl = new FormControl();
  salesTrendDayToDateFormControl = new FormControl();
  salesByDayTrendProgress = false;
  trendChart: Highcharts.Chart = undefined;

  constructor(private readonly _report: AdminDashboardService) {
  }

  ngOnInit() {
    const date = new Date();
    const fromDate = new Date(new Date().setDate(date.getDate() - 7));
    this.salesTrendDayFromDateFormControl.setValue(fromDate);
    this.salesTrendDayToDateFormControl.setValue(date);
    this._getSalesTrend(toSqlDate(fromDate), toSqlDate(date));
    this._listenForDateChange();
  }

  private _listenForDateChange() {
    this.salesTrendDayFromDateFormControl.valueChanges.subscribe(value => {
      this.refreshTrendReport();
    });
    this.salesTrendDayToDateFormControl.valueChanges.subscribe(value => {
      this.refreshTrendReport();
    });
  }

  private _getSalesTrend(from: string, to: string) {
    this.salesByDayTrendProgress = true;
    this._report.getSalesTrendByDates(from, to).then(value => {
      this.initiateGraph(value);
      this.salesByDayTrendProgress = false;
    }).catch(reason => {
      console.log(reason);
      this.salesByDayTrendProgress = false;
    });
  }

  private initiateGraph(data: any) {
    const saleDays = [];
    const totalSales = [];
    Object.keys(data).forEach(key => {
      saleDays.push(data[key]._id);
      totalSales.push(data[key].total);
    });
    // @ts-ignore
    this.trendChart = Highcharts.chart('salesTrendByDay', {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: 'Sales By Date'
      },
      // @ts-ignore
      xAxis: {
        // allowDecimals: false,
        categories: saleDays,
        title: {
          text: 'Day'
        },
        labels: {
          formatter: function () {
            return this.value;
          }
        }
      },
      // @ts-ignore
      yAxis: {
        title: {
          text: 'Total Sales'
        },
        // lineColor: '#1b5e20',
        labels: {
          formatter: function () {
            return this.value;
          }
        }
      },
      tooltip: {
        // pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
      },
      plotOptions: {
        area: {
          // pointStart: saleDays[0],
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 4,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      // @ts-ignore
      series: [{
        name: 'Sales',
        color: '#0b2e13',
        data: totalSales
      }]
    });
  }

  refreshTrendReport() {
    this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
      toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)));
  }
}
