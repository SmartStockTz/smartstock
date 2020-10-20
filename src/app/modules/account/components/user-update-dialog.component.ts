import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService} from '@smartstocktz/core-libs';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';

@Component({
  selector: 'smartstock-user-update-password',
  template: `
    <div style="min-width: 300px">
      <h4 mat-dialog-title>Password Update for : {{data.username}}</h4>
      <form [formGroup]="updatePasswordFormGroup" (ngSubmit)="updatePassword()">

        <mat-form-field appearance="outline" class="btn-block">
          <mat-label>Password</mat-label>
          <input autocomplete="false" type="text" formControlName="password" matInput>
          <mat-error>Password required</mat-error>
        </mat-form-field>

        <button [disabled]="updateProgress" class="btn-block" mat-flat-button color="primary">
          Update
          <mat-progress-spinner *ngIf="updateProgress" style="display: inline-block" [diameter]="20" mode="indeterminate"
                                color="primary">
          </mat-progress-spinner>
        </button>
      </form>
    </div>
  `,
  styleUrls: ['../style/users.style.css']
})
export class UserUpdateDialogComponent implements OnInit {
  updatePasswordFormGroup: FormGroup;
  updateProgress = false;

  constructor(public dialogRef: MatDialogRef<UserUpdateDialogComponent>,
              private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly _userApi: UserService,
              @Inject(MAT_DIALOG_DATA) public data: UserModel) {
  }

  ngOnInit(): void {
    this.updatePasswordFormGroup = this._formBuilder.group({
      password: ['', [Validators.required, Validators.nullValidator]]
    });
  }


  updatePassword() {
    if (this.updatePasswordFormGroup.valid) {
      this.updateProgress = true;
      this._userApi.updatePassword(this.data, this.updatePasswordFormGroup.value.password).then(value => {
        this._snack.open('Password updated successful', 'Ok', {
          duration: 3000
        });
        this.updateProgress = false;
        this.dialogRef.close();
      }).catch(reason => {
        this.logger.i(reason);
        this._snack.open('Failure when try to update password, try again', 'Ok', {
          duration: 3000
        });
        this.updateProgress = false;
      });
    } else {
      this._snack.open('Please enter new password', 'Ok', {
        duration: 3000
      });
    }
  }
}
