import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {FormControl, Validators} from '@angular/forms';
import {BillingApiService} from '../services/billing-api.service';
import {LogService} from '../../lib/services/log.service';

@Component({
  selector: 'smartstock-mobile-pay-details',
  template: `
    <div>
      <div style="display: flex;justify-content: center; align-items: center">
        <p>Payments</p>
      </div>
      <mat-divider></mat-divider>
      <div>

        <div style="padding: 16px;">
          <div>
            <mat-form-field style="width: 100%" appearance="outline">
              <mat-label>Amount To Pay</mat-label>
              <input min="1" [formControl]="amountControl" matInput type="number">
            </mat-form-field>
            <span>Your reference number</span>
            <p *ngIf="reference" style="font-size: 26px; word-spacing: 4px; padding: 8px 0">{{reference}}</p>
            <mat-progress-spinner *ngIf="!reference" mode="indeterminate" [diameter]="30"
                                  color="primary"></mat-progress-spinner>
            <button [disabled]="confirmPaymentFlag" style="width: 100%"
                    class="ft-button" (click)="bottomSheet.dismiss(true)" mat-flat-button color="primary">
              Confirm Payment
              <mat-progress-spinner color="primary" mode="indeterminate" [diameter]="30"
                                    style="display: inline-block"
                                    *ngIf="confirmPaymentFlag">
              </mat-progress-spinner>
            </button>
          </div>

        </div>

        <div style="padding: 8px 0">
          <mat-card-subtitle>How To Pay</mat-card-subtitle>
          <p>
            <mat-accordion>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  M-PESA
                </mat-expansion-panel-header>
                <div>
            <span style="">
              1. Piga <b>*150*00#</b><br><br>
              2. Chagua namba <b>4</b><br><br>
              3. Changua namba <b>4</b><br><br>
              4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>
              5. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>
              6. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>
              7. Weka namba yako ya siri<br><br>
              8. Jina la kampuni litatokea MLIPA, kama kila kitu kipo sawa thibitisha kwa kujibu <b>1</b><br><br>
            </span>
                </div>
              </mat-expansion-panel>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  TIGOPESA
                </mat-expansion-panel-header>
                <div>
            <span style="">
              1. Piga <b>*150*01#</b><br><br>
              2. Chagua namba <b>4</b><br><br>
              3. Changua namba <b>3</b><br><br>
              4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>
              5. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>
              6. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>
              7. Weka namba yako ya siri<br><br>
            </span>
                </div>
              </mat-expansion-panel>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  HALOPESA
                </mat-expansion-panel-header>
                <div>
            <span style="">
              1. Piga <b>*150*88#</b><br><br>
              2. Chagua namba <b>4</b><br><br>
              3. Changua namba <b>3</b><br><br>
              4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>
              5. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>
              6. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>
              7. Weka namba yako ya siri<br><br>
              8. Kisha thibitisha malipo<br><br>
            </span>
                </div>
              </mat-expansion-panel>
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  AIRTEL MONEY
                </mat-expansion-panel-header>
                <div>
            <span style="">
              1. Piga <b>*150*60#</b><br><br>
              2. Chagua namba <b>5</b><br><br>
              3. Changua namba <b>4</b><br><br>
              4. Weka namba hii <b><u>400700</u></b> kama namba ya kampuni<br><br>
              5. Weka kiasi hiki <b>{{getAmountToPay()}}</b><br><br>
              6. Weka namba hii <b><u>{{payData.ref}}</u></b> kama namba ya kumbukumbu<br><br>
              7. Weka namba yako ya siri<br><br>
              8. Kisha thibitisha malipo<br><br>
            </span>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </p>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['../style/mobile-pay-details.style.css']
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
