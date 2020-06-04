import { Component, OnInit } from '@angular/core';
import {DeviceInfo} from '../../../shared/DeviceInfo';
import {FormControl} from '@angular/forms';
import {MatRadioChange} from '@angular/material/radio';

@Component({
  selector: 'app-billing-mobile',
  templateUrl: './billing-mobile.component.html',
  styleUrls: ['./billing-mobile.component.css']
})
export class BillingMobileComponent extends DeviceInfo implements OnInit  {

  isMobilePay = true;
  amountFormControl = new FormControl(0);

  constructor() {
    super();
  }

  ngOnInit() {
  }

  togglePay($event: MatRadioChange) {
    console.log($event.source.name);
    console.log($event.value);
  }
}
