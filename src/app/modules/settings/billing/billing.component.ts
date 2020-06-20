import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormControl} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {BillingApiService} from '../../../services/billing-api.service';
import {LogService} from '../../../services/log.service';

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
  getUnInvoicedBalanceFlag = false;
  getDueBalanceFlag = false;
  dueBill: number;
  unInvoicedBalance: number;

  constructor(private readonly billingApi: BillingApiService,
              private readonly logger: LogService) {
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
      this.logger.i(_);
    });
  }

  getDueBalance() {
    this.getDueBalanceFlag = true;
    this.billingApi.getDueBalance('TZS').then(value => {
      this.getDueBalanceFlag = false;
      const CR = value.CR;
      const DR = value.DR.map(due => due.total).reduce((a, b) => a + b, 0);
      this.dueBill = CR - DR;
    }).catch(_ => {
      this.getDueBalanceFlag = false;
      this.logger.i(_);
    });
  }

  getUnInvoicedBalance() {
    this.getUnInvoicedBalanceFlag = true;
    this.billingApi.getUnInvoicesBalance('TZS').then(value => {
      this.getUnInvoicedBalanceFlag = false;
      this.unInvoicedBalance = value.map(v => v.total).reduce((a, b) => a + b, 0);
    }).catch(_ => {
      this.getUnInvoicedBalanceFlag = false;
      this.logger.i(_);
    });
  }

  mobilePay() {

  }
}
