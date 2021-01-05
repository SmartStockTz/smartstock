import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  template: `
    <div>
      <div mat-dialog-title>Payment</div>
      <div mat-dialog-content>
        <p>Please make payment to continue using the system</p>
      </div>
      <div mat-dialog-actions>
        <button color="primary" mat-button (click)="dialogRef.close()">Close</button>
      </div>
    </div>
  `
})

export class PaymentDialogComponent {
  constructor(public readonly dialogRef: MatDialogRef<PaymentDialogComponent>) {
  }

}
