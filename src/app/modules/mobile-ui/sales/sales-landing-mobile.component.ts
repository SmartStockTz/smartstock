import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';

@Component({
  selector: 'app-sales-landing',
  templateUrl: './sales-landing-mobile.component.html',
  styleUrls: ['./sales-landing-mobile.component.css']
})
export class SalesLandingMobileComponent extends DeviceInfo implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
