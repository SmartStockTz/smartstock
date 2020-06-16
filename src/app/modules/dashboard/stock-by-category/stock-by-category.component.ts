import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {AdminDashboardService} from '../../../services/admin-dashboard.service';
import {LogService} from '../../../services/log.service';

@Component({
  selector: 'app-stock-by-category',
  templateUrl: './stock-by-category.component.html',
  styleUrls: ['./stock-by-category.component.css']
})
export class StockByCategoryComponent implements OnInit {
  stockStatusProgress = false;
  stockByCategoryStatus: { x: string, y: number }[];
  stockByCategoryChart: Highcharts.Chart = undefined;

  constructor(private readonly adminDashboardService: AdminDashboardService,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    this.getStockStatus();
  }

  private getStockStatus() {
    this.stockStatusProgress = true;
    this.adminDashboardService.getStockStatusByCategory().then(status => {
      this.stockStatusProgress = false;
      this.stockByCategoryStatus = status;
      this.initiateGraph(this.stockByCategoryStatus);
    }).catch(reason => {
      this.stockStatusProgress = false;
      console.log(reason);
      // this.logger.i(reason, 'StockStatusComponent:26');
    });
  }

  private initiateGraph(data: { x: string, y: number }[]) {
    const x: string[] = data.map(value => value.x);
    const y: any[] = data.map(value => {
      return {
        y: value.y,
        name: value.x
      };
    });
    this.stockByCategoryChart = Highcharts.chart(
      'stockByCategory',
      {
        chart: {
          // type: 'histogram',
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
          type: 'pie',
          color: '#0b2e13',
          data: y,
        }],
      },
      chart => {
        // console.log(chart);
      }
    );
  }

}
