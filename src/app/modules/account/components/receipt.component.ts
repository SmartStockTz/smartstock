import {PaymentModel} from '../models/payment.model';
import {Component, OnInit} from '@angular/core';
import {BillingApiService} from '../services/billing-api.service';
import {LogService} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-billing-receipts',
  template: `
    <mat-card class="mat-elevation-z0">
      <mat-list *ngIf="!receiptProgressFlag">
        <mat-list-item *ngFor="let receipt of receipts">
          <h1 matLine>{{receipt.receipt}}</h1>
          <p matLine>{{receipt.amount | currency:'TZS '}}</p>
          <p matSuffix>{{receipt.date | date}}</p>
        </mat-list-item>
      </mat-list>
      <smartstock-data-not-ready style="padding: 16px" *ngIf="receiptProgressFlag"
                          [isLoading]="receiptProgressFlag"></smartstock-data-not-ready>
    </mat-card>
  `,
  styleUrls: ['../style/receipt.style.css']
})
export class ReceiptsComponent implements OnInit {

  receipts: PaymentModel[];
  receiptProgressFlag = false;

  constructor(private readonly billingApi: BillingApiService,
              private readonly logger: LogService) {
  }

  ngOnInit() {
    this.getReceipts();
  }

  getReceipts() {
    this.receiptProgressFlag = true;
    this.billingApi.getReceipt().then(value => {
      this.receiptProgressFlag = false;
      this.receipts = value.payments.map<PaymentModel>(receipt => {
        return {
          amount: receipt.amount,
          date: receipt.date.iso ? receipt.date.iso : receipt.date,
          id: receipt.id,
          receipt: receipt.receipt
        };
      });
    }).catch(reason => {
      this.receiptProgressFlag = false;
      this.logger.i(reason);
    });
  }

}
