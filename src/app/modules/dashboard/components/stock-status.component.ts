import {Component, OnInit} from '@angular/core';
import {AdminDashboardService} from '../services/admin-dashboard.service';
import {LogService} from '../../lib/services/log.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'smartstock-stock-status',
  template: `
    <div style="height: 100%" class="d-flex justify-content-center align-items-center">
      <div style="width: 100%; height: 100%" id="stockStatusDiv"></div>
      <smartstock-data-not-ready style="position: absolute" [width]="100" height="100" [isLoading]="stockStatusProgress"
                          *ngIf="stockStatusProgress  || (!stockStatus)"></smartstock-data-not-ready>
    </div>
  `,
  styleUrls: ['../styles/stock-status.style.css']
})
export class StockStatusComponent implements OnInit {
  stockStatusProgress = false;
  stockStatus: { x: string, y: number }[];
  stockStatusChart: Highcharts.Chart = undefined;

  constructor(private readonly adminDashboardService: AdminDashboardService,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    this.getStockStatus();
  }

  private getStockStatus() {
    this.stockStatusProgress = true;
    this.adminDashboardService.getStockStatus().then(status => {
      this.stockStatusProgress = false;
      this.stockStatus = status;
      this.initiateGraph(this.stockStatus);
    }).catch(reason => {
      this.stockStatusProgress = false;
      console.log(reason);
      // this.logger.i(reason, 'StockStatusComponent:26');
    });
  }

  private initiateGraph(data: { x: string, y: number }[]) {
    const x: string[] = data.map(value => value.x);
    const y: any[] = data.map(value => value.y);
    // Object.keys(data).forEach(key => {
    //   x.push(data[key].x);
    //   y.push(data[key].total);
    // });
    this.stockStatusChart = Highcharts.chart(
      'stockStatusDiv',
      {
        chart: {
          type: 'histogram',
          // height: 400,
          // width: 200
        },
        title: {
          text: null
        },
        // @ts-ignore
        xAxis: {
          // allowDecimals: false,
          categories: x,
          title: {
            text: null
          },
          labels: {
            enabled: false,
            formatter: function () {
              return this.value;
            }
          }
        },
        // @ts-ignore
        yAxis: {
          title: {
            text: null
          },
          // lineColor: '#1b5e20',
          labels: {
            enabled: false,
            formatter: function () {
              return this.value;
            }
          }
        },
        tooltip: {
          // pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
        },
        plotOptions: {

          // histogram: {
          //   // pointStart: saleDays[0],
          //   // marker: {
          //   //   enabled: false,
          //   //   symbol: 'circle',
          //   //   radius: 4,
          //   //   states: {
          //   //     hover: {
          //   //       enabled: true
          //   //     }
          //   //   }
          //   // }
          // }
        },
        legend: {
          enabled: false
        },
        series: [{
          type: 'column',
          color: '#0b2e13',
          data: y,
        }]
      },
      chart => {
        // console.log(chart);
      }
    );
  }

}
