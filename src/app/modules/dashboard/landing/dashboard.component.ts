import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-dashboard-sales',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends DeviceInfo implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  isMobile = environment.android;
  dateRange = new Subject<{ begin: Date; end: Date }>();
  initialRange: { begin: Date; end: Date };

  constructor() {
    super();
  }

  ngOnInit() {
  }

  dateSelected(dateRange: { begin: Date; end: Date }) {
    this.initialRange = dateRange;
    this.dateRange.next(dateRange);
  }
}
