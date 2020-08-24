import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  styleUrls: ['../style/login.style.css'],
  template: `
    <div>
      <h5 mat-dialog-title>Password Reset</h5>
      <p mat-dialog-content [innerHTML]="message">
      </p>
      <div mat-dialog-actions>
        <button mat-dialog-close mat-button>Close</button>
      </div>
    </div>
  `
})

export class ResetPasswordDialogComponent implements OnInit {

  message = `Please enter your <b>username</b> to reset your password`;

  constructor(private readonly dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: {
                message: string
              }) {
  }

  ngOnInit(): void {
    if (this.data && this.data.message) {
      this.message = this.data.message;
    }
  }

}
