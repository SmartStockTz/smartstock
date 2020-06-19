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
  referenceNumber: string;
  getReferenceNumberFlag = false;
  dueBill: number;

  constructor(private readonly billingApi: BillingApiService) {
    super();
  }

  ngOnInit() {
    this.getDueBalance();
    this.getUnInvoicedBalance();
    this.getPaymentReference();
  }

  getPaymentReference() {
    this.getReferenceNumberFlag = true;
    this.billingApi.getPaymentReference().then(value => {
      this.getReferenceNumberFlag = false;
      this.referenceNumber = value;
    }).catch(_ => {
      this.getReferenceNumberFlag = false;
    });
  }

  getDueBalance() {
    this.billingApi.getDueBalance('TZS').then(value => {
      const CR = value.CR;
      const DR = value.DR.map(due => due.total).reduce((a, b) => a + b, 0);
      this.dueBill = DR - CR;
    }).catch(_ => {
    });
  }

  getUnInvoicedBalance() {
    this.billingApi.getUnInvoicesBalance('TZS').then(value => {
      console.log('unInvoiced balance', value);
    }).catch(reason => {
      console.log(reason);
    });
  }

  togglePay($event: MatRadioChange) {
    console.log($event.source.name);
    console.log($event.value);
  }
}
