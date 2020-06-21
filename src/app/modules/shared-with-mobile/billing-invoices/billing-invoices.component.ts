import {Component, OnInit} from '@angular/core';
import {BillingApiService} from '../../../services/billing-api.service';
import {LogService} from '../../../services/log.service';
import {InvoiceModel} from '../../../model/payment';


@Component({
  selector: 'app-billing-invoices',
  templateUrl: './billing-invoices.component.html',
  styleUrls: ['./billing-invoices.component.css']
})
export class BillingInvoicesComponent implements OnInit {
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
      //     objectId: receipt.objectId,
      //     receipt: receipt.receipt
      //   };
      // });
    }).catch(reason => {
      this.invoiceProgressFlag = false;
      this.logger.i(reason);
    });
  }

}
