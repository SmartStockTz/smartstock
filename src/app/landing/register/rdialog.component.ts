import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  templateUrl: './rdialog.component.html',
  styleUrls: ['./register.component.css'],
  selector: 'app-register-dialog'
})
export class RegisterDialogComponent {
  constructor(public readonly dialogRef: MatDialogRef<RegisterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public readonly data: {
                goLogin: boolean;
                message: string
              }) {
  }
}
