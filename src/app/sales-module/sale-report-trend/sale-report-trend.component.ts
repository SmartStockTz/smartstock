import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SellerDashboardService} from '../../services/seller-dashboard.service';
import {toSqlDate} from '../../utils/date';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-sale-report-trend',
  templateUrl: './sale-report-trend.component.html',
  styleUrls: ['./sale-report-trend.component.css'],
  providers: [
    SellerDashboardService
  ]
})
export class SaleReportTrendComponent implements OnInit {
  salesTrendDayFromDateFormControl = new FormControl();
  salesTrendDayToDateFormControl = new FormControl();
  trendChart: Highcharts.Chart = undefined;

  salesByDayTrendProgress = false;

  constructor(private readonly _report: SellerDashboardService) {
  }

  ngOnInit() {
    const date = new Date();
    const fromDate = new Date(new Date().setDate(date.getDate() - 7));
    this.salesTrendDayFromDateFormControl.setValue(fromDate);
    this.salesTrendDayToDateFormControl.setValue(date);
    this._getSalesTrend(toSqlDate(fromDate), toSqlDate(date));
    this.salesTrendDayFromDateFormControl.valueChanges.subscribe(_ => {
      this.refreshTrendReport();
    });
    this.salesTrendDayToDateFormControl.valueChanges.subscribe(_ => {
      this.refreshTrendReport();
    });
  }

  private _getSalesTrend(from: string, to: string) {
    this.salesByDayTrendProgress = true;
    this._report.getSalesTrendByUserAndDates(from, to).then(value => {
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
            radius: 2,
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
        data: totalSales,
        color: '#0b2e13'
      }]
    });
  }

  refreshTrendReport() {
    this._getSalesTrend(toSqlDate(new Date(this.salesTrendDayFromDateFormControl.value)),
      toSqlDate(new Date(this.salesTrendDayToDateFormControl.value)));
  }
}
