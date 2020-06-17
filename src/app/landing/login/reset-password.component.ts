import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  styleUrls: ['login.component.css'],
  templateUrl: 'reset-password.component.html'
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
