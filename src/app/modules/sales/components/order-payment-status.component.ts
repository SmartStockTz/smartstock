import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from '../services/order.service';
import {OrderModel} from '../models/order.model';
import {LogService} from '../../lib/services/log.service';

@Component({
  selector: 'smartstock-oder-paid-status',
  template: `
    <mat-chip [disableRipple]="true" style="width: 80px" *ngIf="!isPaid && !getPaidProgress">NOT PAID</mat-chip>
    <mat-chip [disableRipple]="true" *ngIf="isPaid && !getPaidProgress">PAID</mat-chip>
    <mat-progress-spinner *ngIf="getPaidProgress" mode="indeterminate" diameter="30" color="primary"></mat-progress-spinner>
  `
})
export class OrderPaymentStatusComponent implements OnInit {
  getPaidProgress = false;
  isPaid = false;
  @Input() order: OrderModel;

  constructor(private readonly orderService: OrderService,
              private readonly logger: LogService) {
  }

  ngOnInit(): void {
    this.getPaidProgress = true;
    this.checkOrderStatus();
  }

  checkOrderStatus() {
    this.getPaidProgress = true;
    this.orderService.checkOrderIsPaid(this.order.id.split('-')[1]).then(value => {
      this.getPaidProgress = false;
      this.isPaid = value >= this.order.total;
    }).catch(reason => {
      this.getPaidProgress = false;
      this.logger.i(reason);
    });
  }

}
