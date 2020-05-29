import { Component, OnInit } from '@angular/core';
import { DeviceInfo } from 'src/app/shared-components/DeviceInfo';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html',
  styleUrls: ['./stock-reports.component.css']
})
export class StockReportsComponent extends DeviceInfo implements OnInit {

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

}
