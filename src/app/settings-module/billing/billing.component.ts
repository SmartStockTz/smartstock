import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {FormControl} from '@angular/forms';
import {MatRadioChange} from '@angular/material';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent extends DeviceInfo implements OnInit {
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
