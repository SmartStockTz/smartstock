import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {ShopModel} from '../models/shop.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../lib/services/storage.service';
import {UserDatabaseService} from '../services/user-database.service';
import {LogService} from '../../lib/services/log.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'smartstock-new-user',
  template: `
    <div style="min-width: 300px">
      <div mat-dialog-title>Create User</div>
      <div mat-dialog-content>
        <form class="d-flex flex-column" [formGroup]="newUserForm" (ngSubmit)="createUser()">

          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput type="text" formControlName="username" required>
            <mat-error>Username required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input autocomplete="false" matInput type="text" formControlName="password" required>
            <mat-error>Password required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Roles</mat-label>
            <mat-select formControlName="role">
              <mat-option value="manager">MANAGER</mat-option>
              <mat-option value="user">SELLER</mat-option>
            </mat-select>
            <mat-error>Role required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Shop ( s )</mat-label>
            <mat-select [multiple]="true" formControlName="shops">
              <mat-option *ngFor="let shop of shops | async" [value]="shop">{{shop.businessName}}</mat-option>
            </mat-select>
            <mat-error>Shop ( s ) required</mat-error>
          </mat-form-field>

          <button color="primary" [disabled]="createUserProgress" mat-flat-button class="ft-button">
            Save
            <mat-progress-spinner style="display: inline-block" *ngIf="createUserProgress" [diameter]="20"
                                  mode="indeterminate"></mat-progress-spinner>
          </button>
          <span style="margin-bottom: 8px"></span>
          <button color="warn" mat-button (click)="cancel($event)">
            Close
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../style/users.style.css'],
})
export class UserCreateDialogComponent implements OnInit {
  newUserForm: FormGroup;
  createUserProgress = false;
  shops: Observable<ShopModel[]>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly storage: StorageService,
    private readonly userDatabase: UserDatabaseService,
    private readonly logger: LogService,
    public dialogRef: MatDialogRef<UserCreateDialogComponent>) {
  }

  ngOnInit(): void {
    this._getShops();
    this.initiateForm();
  }

  initiateForm() {
    this.newUserForm = this.formBuilder.group({
      username: ['', [Validators.nullValidator, Validators.required]],
      password: ['', [Validators.nullValidator, Validators.required]],
      shops: [[], [Validators.nullValidator, Validators.required]],
      role: ['user', [Validators.nullValidator, Validators.required]],
    });
  }

  createUser() {
    if (!this.newUserForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.createUserProgress = true;
    this.newUserForm.value.username.trim();
    this.newUserForm.value.password.trim();
    this.userDatabase.addUser(this.newUserForm.value).then(value => {
      this.createUserProgress = false;
      value.username = this.newUserForm.value.username;
      value.role = this.newUserForm.value.role;
      this.dialogRef.close(value);
      this.snack.open('User created', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      this.logger.i(reason);
      this.createUserProgress = false;
      this.snack.open(reason && reason.error && reason.error.message ?
        reason.error.message : 'User not created, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }

  private _getShops() {
    this.userDatabase.getShops().then(value => {
      this.shops = of(value);
    }).catch(reason => {
      this.logger.e(reason, 'DialogUserNewComponent:203');
      this.shops = of([]);
    });
  }
}
