import {Component, OnInit} from '@angular/core';
import {BillingApiService} from '../../../services/billing-api.service';
import {LogService} from '../../../services/log.service';
import {PaymentModel} from '../../../model/payment';

@Component({
  selector: 'app-billing-receipts',
  templateUrl: './billing-receipts.component.html',
  styleUrls: ['./billing-receipts.component.css']
})
export class BillingReceiptsComponent implements OnInit {

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
          objectId: receipt.objectId,
          receipt: receipt.receipt
        };
      });
    }).catch(reason => {
      this.receiptProgressFlag = false;
      this.logger.i(reason);
    });
  }

}
