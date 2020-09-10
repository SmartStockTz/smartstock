import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {OrderModel} from '../models/order.model';

@Component({
  selector: 'smartstock-orders-show-items',
  template: `
    <div style="padding: 16px 0 24px 0;">
      <div>
        <h3>Order Items</h3>
      </div>
      <mat-divider></mat-divider>
      <mat-list>
        <mat-list-item *ngFor="let cart of data.order.carts">
          <h1 matLine>{{cart.product.product}}</h1>
          <mat-card-subtitle matLine>Quantity : {{cart.quantity}}</mat-card-subtitle>
        </mat-list-item>
      </mat-list>
      <mat-divider></mat-divider>
      <div style="padding: 8px 0 16px 0">
        <h3>{{data.order.total | currency:'TZS '}}</h3>
      </div>
    </div>
  `
})
export class OrdersTableShowItemsComponent implements OnInit {
  constructor(private readonly bottomSheetRef: MatBottomSheetRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) readonly data: { order: OrderModel }) {
  }

  ngOnInit(): void {
  }
}
