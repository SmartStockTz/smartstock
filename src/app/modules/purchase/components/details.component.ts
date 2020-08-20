import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
/** must be removed to common module **/
import {StockDetailsComponent} from '../../stocks/components/stock.component';
/** must be removed to common module **/
import {PurchaseModel} from '../models/purchase.model';

@Component({
  selector: 'app-purchase-details',
  template: `
    <!--<div *ngFor="let stockKey of getPurchases()">-->
    <!--  <h5>{{stockKey}}</h5>-->
    <!--  <span>{{data[stockKey] | json}}</span>-->
    <!--  <mat-divider style="margin-bottom: 8px"></mat-divider>-->
    <!--</div>-->


    <div class="container" style="min-width: 300px">
      <div mat-card-title>{{'Invoice #' + data.refNumber + ' Details'}}</div>
      <!--  <app-no-data *ngIf="!invoice" [isLoading]="fetchInvoiceProgress" (refreshCallback)="getInvoice()"></app-no-data>-->
      <!--  -->
      <div class="row d-flex flex-column">
        <mat-card-subtitle>Purchase date</mat-card-subtitle>
        <h5>{{getDate(data.date) | date}}</h5>
        <mat-divider></mat-divider>
        <mat-card-subtitle>Due date</mat-card-subtitle>
        <h5>{{getDate(data.due) | date}}</h5>
        <mat-divider></mat-divider>
        <mat-card-subtitle>Amount</mat-card-subtitle>
        <h5>{{data.amount | currency: 'TZS '}}</h5>
        <mat-divider></mat-divider>
        <mat-card-subtitle>Supplier</mat-card-subtitle>
        <h5>{{data.supplier.name}}</h5>
        <mat-divider></mat-divider>
        <mat-expansion-panel class="mat-elevation-z0" *ngFor="let item of data.items">
          <mat-expansion-panel-header>
            {{item.product.product}}
          </mat-expansion-panel-header>
          <div class="d-flex  flex-row flex-wrap">
            <mat-form-field class="my-input" style="margin: 5px" appearance="fill">
              <mat-label>Purchase</mat-label>
              <input matInput [readonly]="true" [value]="item.purchase">
            </mat-form-field>
            <mat-form-field class="my-input" style="margin: 5px" appearance="fill">
              <mat-label>Quantity</mat-label>
              <input matInput [readonly]="true" [value]="item.quantity">
            </mat-form-field>
            <mat-form-field class="my-input" style="margin: 5px" appearance="fill">
              <mat-label>Amount</mat-label>
              <input matInput [readonly]="true" [value]="item.amount">
            </mat-form-field>
          </div>
        </mat-expansion-panel>
        <span style="margin-bottom: 24px"></span>
      </div>
      <!--  <mat-card-actions>-->
      <!--    <button (click)="closeDialog()" *ngIf="invoice" mat-button color="accent">-->
      <!--      Close-->
      <!--    </button>-->
      <!--  </mat-card-actions>-->
    </div>

  `
})
export class PurchaseDetailsComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<StockDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: PurchaseModel) {
  }

  getDate(date: any) {
    if (date && date.iso) {
      return date.iso;
    } else {
      return date;
    }
  }
}
