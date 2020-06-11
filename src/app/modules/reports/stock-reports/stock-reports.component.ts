import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html',
  styleUrls: ['./stock-reports.component.css']
})
export class StockReportsComponent extends DeviceInfo implements OnInit {
  isMobile = environment.android;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
