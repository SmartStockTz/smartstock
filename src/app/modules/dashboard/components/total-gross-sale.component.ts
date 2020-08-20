import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AdminDashboardService} from '../services/admin-dashboard.service';

@Component({
  selector: 'app-total-gross-sale',
  template: `
    <div style="height: 100%" class="d-flex justify-content-center align-items-center">
      <span *ngIf="!totalGrossSaleProgress" style="font-size: 30px">{{totalGrossSale | currency: 'TZS '}}</span>
      <app-data-not-ready [width]="100" height="100" [isLoading]="totalGrossSaleProgress"
                          *ngIf="totalGrossSaleProgress || (!totalGrossSale && totalGrossSale!==0)"></app-data-not-ready>
    </div>
  `,
  styleUrls: ['../styles/total-gross-sale.style.css']
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
