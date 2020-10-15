import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {BillingApiService} from '../services/billing-api.service';
import {LogService} from '@smartstock/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MobilePayDetailsComponent} from '../components/mobile-pay-details.component';
import {DeviceInfoUtil} from '@smartstock/core-libs';

@Component({
  selector: 'smartstock-billing',
  template: `
      <mat-sidenav-container class="match-parent">
          <mat-sidenav class="match-parent-side"
                       [fixedInViewport]="true"
                       #sidenav
                       [mode]="enoughWidth()?'side':'over'"
                       [opened]="!isMobile">
              <smartstock-drawer></smartstock-drawer>
          </mat-sidenav>

          <mat-sidenav-content>
              <smartstock-toolbar [heading]="'Bills'"
                                  [sidenav]="sidenav"
                                  [showProgress]="false"
                                  [backLink]="'/account'"
                                  [hasBackRoute]="isMobile">
              </smartstock-toolbar>

              <div [ngClass]="isMobile?'container-fluid':'container my-billing-wrapper'">

                  <div [ngClass]="isMobile?'col-12':'col-12 col-lg-10 col-xl-10 offset-xl-1 offset-lg-1 offset-md-0 offset-sm-0'">

                      <div>
                          <p style="padding: 10px 0">
                              Billing
                          </p>
                      </div>

                      <div class="row" style="margin-bottom: 16px">
                          <div style="margin-bottom: 8px" class="col-12 col-md-6 col-xl-6 col-sm-12 col-lg-6">
                              <smartstock-dash-card [content]="dueBalance" [title]="'Balance'"
                                                    [height]="250"
                                                    [description]="'If bill is negative means you have un paid invoices'">
                                  <ng-template #dueBalance>
                                      <div style="display: flex; height: 100%; justify-content: center; align-items: center">
                  <span *ngIf="!getDueBalanceFlag" style="font-size: 30px; text-space: 2px">
                    {{dueBill | currency:'TZS '}}
                  </span>
                                          <smartstock-data-not-ready *ngIf="getDueBalanceFlag || dueBill===undefined"
                                                                     [isLoading]="getDueBalanceFlag"
                                                                     [height]="100"
                                                                     [width]="100"></smartstock-data-not-ready>
                                      </div>
                                  </ng-template>
                              </smartstock-dash-card>
                          </div>
                          <div style="margin-bottom: 8px" class="col-12 col-md-6 col-xl-6 col-sm-12 col-lg-6">
                              <smartstock-dash-card [content]="unInvoiced" [title]="'Un Invoiced'"
                                                    [height]="250"
                                                    [description]="'Your usage cost before billed, ' +
                            'this is approximation actual cost will be billed end of the month'">
                                  <ng-template #unInvoiced>
                                      <div style="display: flex; height: 100%; justify-content: center; align-items: center">
                  <span *ngIf="!getUnInvoicedBalanceFlag" style="font-size: 30px; text-space: 2px">
                    {{unInvoicedBalance | currency:'TZS '}}
                  </span>
                                          <smartstock-data-not-ready *ngIf="getUnInvoicedBalanceFlag || !unInvoicedBalance"
                                                                     [isLoading]="getUnInvoicedBalanceFlag"
                                                                     [height]="100"
                                                                     [width]="100"></smartstock-data-not-ready>
                                      </div>
                                  </ng-template>
                              </smartstock-dash-card>
                          </div>
                      </div>

                      <div *ngIf="dueBill!==undefined">
                          <div>
                              <p style="padding: 10px 0">
                                  Payments
                              </p>
                          </div>

                          <div style="margin-bottom: 16px" class="row">
                              <button (click)="mobilePay()" mat-flat-button class="ft-button" color="primary">
                                  Mobile Pay
                              </button>
                          </div>
                      </div>

                      <div class="row" style="margin-bottom: 16px">
                          <mat-tab-group style="width: 100%">
                              <mat-tab label="Invoices">
                                  <smartstock-billing-invoices></smartstock-billing-invoices>
                              </mat-tab>
                              <mat-tab label="Receipts">
                                  <smartstock-billing-receipts></smartstock-billing-receipts>
                              </mat-tab>
                          </mat-tab-group>
                      </div>
                  </div>

              </div>

          </mat-sidenav-content>

      </mat-sidenav-container>
  `,
  styleUrls: ['../style/billing.style.css']
})
export class BillingPage extends DeviceInfoUtil implements OnInit {
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
              private readonly bottomSheet: MatBottomSheet,
              private readonly logger: LogService) {
    super();
  }

  ngOnInit() {
    this.getDueBalance();
    this.getUnInvoicedBalance();
    this.getPaymentReference();
    // document.getElementsByClassName('mat-tab-body-wrapper').item(0).classList.add('mat-elevation-z2');
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
    this.bottomSheet.open(MobilePayDetailsComponent, {
      autoFocus: true,
      closeOnNavigation: false,
      data: {
        ref: this.referenceNumber,
        amount: this.dueBill
      }
    }).afterDismissed().subscribe(value => {
      if (value === true) {
        this.getDueBalance();
        this.getUnInvoicedBalance();
      }
    });
  }
}
