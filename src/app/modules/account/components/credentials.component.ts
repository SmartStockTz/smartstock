import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserDatabaseService} from '../services/user-database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserModel} from '../models/user.model';

@Component({
  selector: 'smartstock-profile-authentication',
  template: `
    <div class="profile-auth-wrapper">
      <mat-card class="mat-elevation-z0">
        <form *ngIf="!getUserProgress && authForm" [formGroup]="authForm"
              (ngSubmit)="changePassword()">
          <div class="row">

            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>Last Password</mat-label>
                <input matInput formControlName="lastPassword" [type]="showLastPassword?'text':'password'">
                <button (click)="toggleLastPasswordVisibility()" mat-icon-button matSuffix>
                  <mat-icon *ngIf="showLastPassword">visibility_on</mat-icon>
                  <mat-icon *ngIf="!showLastPassword">visibility_off</mat-icon>
                </button>
                <mat-error>last password required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>New Password</mat-label>
                <input matInput formControlName="password" type="text" [type]="showPassword?'text':'password'">
                <button (click)="togglePasswordVisibility()" mat-icon-button matSuffix>
                  <mat-icon *ngIf="showPassword">visibility_on</mat-icon>
                  <mat-icon *ngIf="!showPassword">visibility_off</mat-icon>
                </button>
                <mat-error>new password required, and must be at least 6 characters</mat-error>
              </mat-form-field>

            </div>

          </div>

          <div class="row">
            <button [disabled]="updateUserProgress" class="ft-button btn-block" mat-flat-button color="primary">
              CHANGE
              <mat-progress-spinner *ngIf="updateUserProgress"
                                    style="display: inline-block" [diameter]="30"
                                    mode="indeterminate"
                                    color="primary"></mat-progress-spinner>
            </button>
          </div>

        </form>

        <mat-progress-spinner *ngIf="getUserProgress" mode="indeterminate" color="primary"
                              [diameter]="25"></mat-progress-spinner>

        <div *ngIf="!getUserProgress && !authForm">
          <mat-card-subtitle>
            Failure when try to fetch your personal information, try to refresh
          </mat-card-subtitle>
          <button (click)="getCurrentUser()" mat-icon-button>
            <mat-icon color="primary">
              refresh
            </mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../style/profile.style.css']
})
export class AuthenticationComponent implements OnInit {
  authForm: FormGroup;
  currentUser: UserModel;
  getUserProgress = false;
  updateUserProgress = false;
  showLastPassword = false;
  showPassword = false;

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly _userApi: UserDatabaseService) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  private _initializeForm(user: UserModel) {
    this.authForm = this._formBuilder.group({
      lastPassword: [''],
      password: [''],
    });
  }

  getCurrentUser() {
    this.getUserProgress = true;
    this._userApi.currentUser().then(user => {
      this.currentUser = user;
      this._initializeForm(this.currentUser);
      this.getUserProgress = false;
    }).catch(reason => {
      console.log(reason);
      this.getUserProgress = false;
      this._snack.open('Error when trying to get user details', 'Ok', {
        duration: 3000
      });
    });
  }

  changePassword() {
    if (this.authForm.valid) {
      this.updateUserProgress = true;
      this._userApi.changePasswordFromOld({
        lastPassword: this.authForm.value.lastPassword,
        password: this.authForm.value.password,
        user: this.currentUser
      }).then(async user => {
        this.updateUserProgress = false;
        this._snack.open('Your password changed successful', 'Ok', {
          duration: 3000
        });
        await this._userApi.updateCurrentUser(user);
        this._resetForm(true);
      }).catch(reason => {
        console.log(reason);
        this.updateUserProgress = false;
        this._snack.open('Fails to change password, try again or contact support', 'Ok', {
          duration: 3000
        });
        this._resetForm(true);
      });
    } else {
      this._snack.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  private _resetForm(reset: boolean) {
    if (reset) {
      this.authForm.reset({
        lastPassword: '',
        password: ''
      });
    }
    Object.keys(this.authForm.controls).forEach(key => {
      this.authForm.get(key).markAsUntouched();
    });
  }

  toggleLastPasswordVisibility() {
    this.showLastPassword = !this.showLastPassword;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
