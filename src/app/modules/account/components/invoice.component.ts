import {Component, OnInit} from '@angular/core';
import {BillingApiService} from '../services/billing-api.service';
import {InvoiceModel} from '../models/payment.model';
import {LogService} from '@smartstock/core-libs';

@Component({
  selector: 'smartstock-billing-invoices',
  template: `
    <mat-card class="mat-elevation-z0">
      <mat-list *ngIf="!invoiceProgressFlag">
        <mat-list-item *ngFor="let invoice of invoices">
          <h1 matLine>{{invoice.name}}</h1>
          <p matLine>{{invoice.amount | currency: 'TZS '}}</p>
          <p matSuffix>{{invoice.date | date}}</p>
        </mat-list-item>
      </mat-list>
      <smartstock-data-not-ready style="padding: 16px" *ngIf="invoiceProgressFlag"
                          [isLoading]="invoiceProgressFlag"></smartstock-data-not-ready>
    </mat-card>
  `,
})
export class InvoicesComponent implements OnInit {
  invoices: InvoiceModel[] = [];
  invoiceProgressFlag = false;

  constructor(private readonly billingApi: BillingApiService,
              private readonly logger: LogService) {
  }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.invoiceProgressFlag = true;
    this.billingApi.getInvoices().then(value => {
      this.invoiceProgressFlag = false;
      value.forEach(invoice => {
        invoice.invoice.forEach(value1 => {
          this.invoices.push({
            amount: value1.amount,
            date: value1._id,
            name: invoice.businessName
          });
        });
      });
      // this.invoices = value.payments.map<PaymentModel>(receipt => {
      //   return {
      //     amount: receipt.amount,
      //     date: receipt.date.iso ? receipt.date.iso : receipt.date,
      //     id: receipt.id,
      //     receipt: receipt.receipt
      //   };
      // });
    }).catch(reason => {
      this.invoiceProgressFlag = false;
      this.logger.i(reason);
    });
  }

}
