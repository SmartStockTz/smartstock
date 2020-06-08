import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {DateRangeSelectorComponent} from '../date-range-selector/date-range-selector.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard-sales',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends DeviceInfo implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  isMobile = environment.android;

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
