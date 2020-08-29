import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';

@Component({
  selector: 'smartstock-stock-details',
  template: `
    <div>
      <img style="max-width: 400px; height: auto" [src]="data.image" alt="">
    </div>
    <div *ngFor="let stockKey of getStocks()">
      <h5
        *ngIf="stockKey!=='image' && stockKey !=='id' && stockKey!=='createdAt' && stockKey!=='updatedAt' && stockKey!=='idOld' ">
        {{stockKey}}
      </h5>
      <span
        *ngIf="stockKey!=='image' && stockKey !=='id' && stockKey!=='createdAt' && stockKey!=='updatedAt' && stockKey!=='idOld'">
    {{data[stockKey]}}
  </span>
      <mat-divider
        *ngIf="stockKey!=='image' && stockKey !=='id' && stockKey!=='createdAt' && stockKey!=='updatedAt' && stockKey!=='idOld'"
        style="margin-bottom: 8px">
      </mat-divider>
    </div>
  `
})
export class StockDetailsComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<StockDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: StockModel) {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getStocks() {
    return Object.keys(this.data);
  }
}

@Component({
  selector: 'smartstock-dialog-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete :  <b>{{' '+ data.product}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button color="primary"  mat-button (click)="delete(data)">Delete</button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class DialogDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockModel) {
  }

  delete(stock: StockModel) {
    this.dialogRef.close(stock);
  }

  cancel() {
    this.dialogRef.close('no');
  }
}
