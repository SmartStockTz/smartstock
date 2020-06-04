import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormControl} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent extends DeviceInfo implements OnInit {
  isMobilePay = true;
  amountFormControl = new FormControl(0);

  isMobile = environment.android;
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
