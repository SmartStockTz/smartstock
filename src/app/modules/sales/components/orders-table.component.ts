import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {OrderModel} from '../models/order.model';
import {OrderState} from '../states/order.state';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'smartstock-orders-table',
  template: `
    <mat-progress-bar mode="indeterminate" color="primary" *ngIf="(orderState.getOrderFlag | async)===true"></mat-progress-bar>
    <mat-card>
      <mat-card-header *ngIf="orderState.orders.value.length > 0">
        <smartstock-orders-table-actions></smartstock-orders-table-actions>
      </mat-card-header>
      <table *ngIf="orderState.orders.value.length > 0" mat-table [dataSource]="ordersDataTable">
        <ng-container matColumnDef="date">
          <th mat-header-cell *cdkHeaderCellDef>Date</th>
          <td mat-cell *cdkCellDef="let order">{{order.createdAt | date}}</td>
        </ng-container>
        <ng-container matColumnDef="customer">
          <th mat-header-cell *cdkHeaderCellDef>Customer</th>
          <td mat-cell *cdkCellDef="let order">{{order.displayName}}</td>
        </ng-container>
        <ng-container matColumnDef="amount">
          <th mat-header-cell *cdkHeaderCellDef>Amount</th>
          <td mat-cell *cdkCellDef="let order">{{order.total | currency:'TZS '}}</td>
        </ng-container>
        <ng-container matColumnDef="paid">
          <th mat-header-cell *cdkHeaderCellDef>Payment</th>
          <td mat-cell *cdkCellDef="let order">
            <smartstock-oder-paid-status [order]="order"></smartstock-oder-paid-status>
          </td>
        </ng-container>
        <ng-container matColumnDef="mobile">
          <th mat-header-cell *cdkHeaderCellDef>Mobile</th>
          <td mat-cell *cdkCellDef="let order">{{order.mobile}}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *cdkHeaderCellDef>Status</th>
          <td mat-cell *cdkCellDef="let order">{{order.status}}</td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th mat-header-cell *cdkHeaderCellDef>Action</th>
          <td mat-cell *cdkCellDef="let order">
            <button color="primary" (click)="viewItems(order)" mat-button>Items</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="ordersColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: ordersColumns;"></tr>
      </table>
      <div *ngIf="orderState.orders.value.length === 0" class="d-flex justify-content-center align-items-center" style="padding: 16px">
        <smartstock-data-not-ready></smartstock-data-not-ready>
      </div>
      <mat-paginator #paginator [pageSize]="10" [showFirstLastButtons]="true" [pageSizeOptions]="[10,20,50]"></mat-paginator>
    </mat-card>
  `
})
export class OrdersTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ordersDataTable: MatTableDataSource<OrderModel> = new MatTableDataSource<OrderModel>([]);
  ordersColumns = ['date', 'customer', 'amount', 'paid', 'mobile', 'status', 'action'];

  constructor(public readonly orderState: OrderState) {
    this.ordersDataTable.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.orderState.orders.subscribe(value => {
      this.ordersDataTable.data = value;
      if (!this.ordersDataTable.paginator) {
        this.ordersDataTable.paginator = this.paginator;
      }
    });
    if (this.ordersDataTable.data.length === 0) {
      this.orderState.getOrder();
    }
    this.handleTableFilter();
  }

  handleTableFilter(): void {
    this.orderState.orderFilterKeyword.subscribe(value => {
      this.ordersDataTable.filter = value.toLowerCase();
    });
  }

  viewItems(order: OrderModel) {

  }
}
