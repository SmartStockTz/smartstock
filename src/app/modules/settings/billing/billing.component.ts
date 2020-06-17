import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormControl} from '@angular/forms';
import {MatRadioChange} from '@angular/material/radio';
import {environment} from '../../../../environments/environment';
import {BillingApiService} from '../../../services/billing-api.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent extends DeviceInfo implements OnInit {
  isMobilePay = true;
  amountFormControl = new FormControl(0);
  isMobile = environment.android;

  constructor(private readonly billingApi: BillingApiService) {
    super();
  }

  ngOnInit() {
    this.getDueBalance();
    this.getUnInvoicedBalance();
  }

  getDueBalance() {
    this.billingApi.getDueBalance('TZS').then(value => {
      console.log(value);
    }).catch(reason => {
      console.log(reason);
    });
  }

  getUnInvoicedBalance() {
    this.billingApi.getUnInvoicesBalance('TZS').then(value => {
      console.log(value);
    }).catch(reason => {
      console.log(reason);
    });
  }

  togglePay($event: MatRadioChange) {
    console.log($event.source.name);
    console.log($event.value);
  }
}
