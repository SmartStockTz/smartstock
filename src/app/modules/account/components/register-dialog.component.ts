import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  template: `
    <div>
      <div mat-dialog-title>
        Hello
      </div>
      <p mat-dialog-content>
        {{data.message}}
      </p>
      <div mat-dialog-actions>
        <button (click)="dialogRef.close(data.goLogin)" mat-button>Close</button>
      </div>
    </div>
  `,
  styleUrls: ['../style/register.style.css']
})
export class RegisterDialogComponent {
  constructor(public readonly dialogRef: MatDialogRef<RegisterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: {
                goLogin: boolean;
                message: string
              }) {
  }
}
