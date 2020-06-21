import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {FormControl, Validators} from '@angular/forms';
import {BillingApiService} from '../../../services/billing-api.service';
import {LogService} from '../../../services/log.service';

@Component({
  selector: 'app-mobile-pay-details',
  templateUrl: './mobile-pay-details.component.html',
  styleUrls: ['./mobile-pay-details.component.css']
})
export class MobilePayDetailsComponent implements OnInit {
  confirmPaymentFlag = false;
  amountToPay: number;
  reference: string;
  amountControl = new FormControl(this.amountToPay, [Validators.nullValidator, Validators.required, Validators.min(1)]);

  constructor(public bottomSheet: MatBottomSheetRef<MobilePayDetailsComponent>,
              private readonly billApi: BillingApiService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly logger: LogService,
              @Inject(MAT_BOTTOM_SHEET_DATA) public payData: { ref: string, amount: number }) {
  }

  ngOnInit(): void {
    this.reference = this.payData.ref;
    if (!this.reference) {
      this.getPaymentReference();
    }
    this.amountToPay = Math.round(Math.abs(this.payData.amount));
    this.amountControl.setValue(this.amountToPay === 0 ? 10000 : this.amountToPay);
    this.getPaymentReference();
  }

  getPaymentReference() {
    this.billApi.getPaymentReference().then(value => {
      this.reference = value;
      this.changeDetectorRef.detectChanges();
    }).catch(_ => {
      this.reference = '';
      this.logger.i(_);
      this.changeDetectorRef.detectChanges();
    });
  }

  getAmountToPay() {
    return this.amountControl.value;
  }
}
