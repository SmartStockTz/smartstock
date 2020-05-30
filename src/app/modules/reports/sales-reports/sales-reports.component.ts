import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceInfo} from '../../shared/DeviceInfo';

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.css']
})
export class SalesReportsComponent extends DeviceInfo implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
