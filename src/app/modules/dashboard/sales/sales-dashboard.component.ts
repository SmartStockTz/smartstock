import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {DateRangeSelectorComponent} from '../date-range-selector/date-range-selector.component';

@Component({
  selector: 'app-dashboard-sales',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent extends DeviceInfo implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  rangesFooter = DateRangeSelectorComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
