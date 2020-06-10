import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AdminDashboardService} from '../../../services/admin-dashboard.service';

@Component({
  selector: 'app-total-gross-sale',
  templateUrl: './total-gross-sale.component.html',
  styleUrls: ['./total-gross-sale.component.css']
})
export class TotalGrossSaleComponent implements OnInit {
  totalGrossSale = 0;
  totalGrossSaleProgress = false;
  @Input() dateRange: Observable<{ begin: Date, end: Date }>;
  @Input() initialDataRange: { begin: Date, end: Date };

  constructor(private readonly dashboardApi: AdminDashboardService) {
  }

  ngOnInit(): void {
    if (this.initialDataRange) {
      this.getTotalGrossSale(this.initialDataRange);
    }
    this.dateRange.subscribe(value => {
      this.totalGrossSale = undefined;
      this.getTotalGrossSale(value);
    });
  }

  private getTotalGrossSale(dateRange: { begin: Date, end: Date }) {
    this.totalGrossSaleProgress = true;
    this.dashboardApi.getTotalGrossSale(dateRange.begin, dateRange.end).then(value => {
      this.totalGrossSaleProgress = false;
      this.totalGrossSale = value;
    }).catch(_ => {
      this.totalGrossSaleProgress = false;
    });
  }

}
