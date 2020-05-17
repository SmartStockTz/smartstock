import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-verify-email-dialog',
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./login.component.css']
})
export class VerifyEMailDialogComponent {
  constructor(public readonly dialogRef: MatDialogRef<VerifyEMailDialogComponent>) {
  }
}
