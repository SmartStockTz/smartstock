import {Component, Input, OnInit} from '@angular/core';
import {AdminDashboardService} from '../../../services/admin-dashboard.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css'],
})
export class TotalSalesComponent implements OnInit {
  totalSale = 0;
  totalSaleProgress = false;
  @Input() dateRange: Observable<{ begin: Date, end: Date }>;
  @Input() initialDataRange: { begin: Date, end: Date };

  constructor(private readonly dashboardApi: AdminDashboardService) {
  }

  ngOnInit(): void {
    if (this.initialDataRange) {
      this.getTotalSale(this.initialDataRange);
    }
    this.dateRange.subscribe(value => {
      this.totalSale = undefined;
      this.getTotalSale(value);
    });
  }

  private getTotalSale(dateRange: { begin: Date, end: Date }) {
    this.totalSaleProgress = true;
    this.dashboardApi.getTotalSale(dateRange.begin, dateRange.end).then(value => {
      this.totalSaleProgress = false;
      this.totalSale = value;
    }).catch(_ => {
      this.totalSaleProgress = false;
    });
  }

}
