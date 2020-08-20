import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-no-stock-dialog',
  template: `
    <div>
      <h5>Hello!</h5>
      <mat-card-subtitle mat-dialog-content>
        StockModel is not available yet, add product or refresh your stock
      </mat-card-subtitle>
      <div mat-dialog-actions>
        <button (click)="dialogRef.close()" routerLink="/stock" mat-flat-button color="primary">Go To StockModel</button>
        <button (click)="dialogRef.close()" mat-flat-button color="warn">Close</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/no-stock-dialog.style.css']
})
export class NoStockDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoStockDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
