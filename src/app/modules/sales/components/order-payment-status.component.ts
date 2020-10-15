import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from '../services/order.service';
import {OrderModel} from '../models/order.model';
import {LogService} from '@smartstock/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MobilePayDetailsComponent} from '../../account/components/mobile-pay-details.component';

@Component({
  selector: 'smartstock-oder-paid-status',
  template: `
    <button (click)="makePayment()" mat-button color="primary" *ngIf="!isPaid && !getPaidProgress">
      PAY NOW
    </button>
    <mat-chip [disableRipple]="true" *ngIf="isPaid && !getPaidProgress">
      PAID
    </mat-chip>
    <mat-progress-spinner *ngIf="getPaidProgress" mode="indeterminate" diameter="30" color="primary"></mat-progress-spinner>
  `
})
export class OrderPaymentStatusComponent implements OnInit {
  getPaidProgress = false;
  isPaid = false;
  @Input() order: OrderModel;

  constructor(private readonly orderService: OrderService,
              private readonly bottomSheet: MatBottomSheet,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    this.checkOrderStatus();
  }

  checkOrderStatus() {
   // console.log(this.order.paid);
    if (this.order.paid === false) {
      this.getPaidProgress = true;
      this.orderService.checkOrderIsPaid(this.order.id.split('-')[1]).then(value => {
        this.getPaidProgress = false;
        this.isPaid = value >= this.order.total;
        this.orderService.markOrderIsPaid(this.order.id).catch(_ => {
         // console.log(_);
        });
      }).catch(reason => {
        this.getPaidProgress = false;
        this.logger.i(reason);
      });
    }
  }

  makePayment() {
    this.bottomSheet.open(MobilePayDetailsComponent, {
      data: {
        ref: this.order.id.split('-')[1],
        amount: this.order.total
      },
      closeOnNavigation: false
    }).afterDismissed().subscribe(value => {
      if (value === true) {
        this.checkOrderStatus();
      }
    });
  }
}
