import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {RegisterDialogComponent} from '../components/register-dialog.component';
import {UserService} from '../services/user.service';
import {UserModel} from '../models/user.model';
import {LogService} from '@smartstocktz/core-libs';
import {MessageService} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-register',
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z2">
      <button routerLink="/" mat-icon-button>
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span routerLink="/">SmartStock - Register</span>
      <span style="flex: 1 1 auto"></span>
    </mat-toolbar>
    <div class="main-container container">
      <div class="register-form col-xl-9 col-lg-9 col-sm-12 col-md-10 col-12 container-fluid">
        <mat-vertical-stepper [linear]="true" #stepper>
          <mat-step [stepControl]="personalFormGroup">
            <ng-template matStepLabel>Fill personal details</ng-template>
            <smartstock-personal-details-form [personalFormGroup]="personalFormGroup">
            </smartstock-personal-details-form>
          </mat-step>
          <mat-step [stepControl]="businessFormGroup">
            <ng-template matStepLabel>Fill your business details</ng-template>
            <smartstock-business-details-form [businessFormGroup]="businessFormGroup">
            </smartstock-business-details-form>
          </mat-step>
          <mat-step [stepControl]="loginFormGroup">
            <ng-template matStepLabel>Login Information</ng-template>
            <smartstock-login-details-form [loginFormGroup]="loginFormGroup">
            </smartstock-login-details-form>
            <div>
              <button mat-button
                      [disabled]="registerProgress"
                      class="stepper-btn"
                      matStepperPrevious>Back
              </button>
              <button *ngIf="!registerProgress"
                      mat-button (click)="openAccount()"
                      class="stepper-btn">
                Create Account
              </button>
              <mat-progress-spinner style="display: inline-block"
                                    *ngIf="registerProgress"
                                    [matTooltip]="'create account in progress'"
                                    [diameter]="30"
                                    mode="indeterminate"
                                    color="primary">
              </mat-progress-spinner>
            </div>
          </mat-step>
        </mat-vertical-stepper>
      </div>
    </div>
  `,
  styleUrls: ['../style/register.style.css']
})
export class RegisterPage implements OnInit {
  personalFormGroup: FormGroup;
  businessFormGroup: FormGroup;
  loginFormGroup: FormGroup;
  registerProgress = false;

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly userDatabase: UserService,
              private readonly messageService: MessageService) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.personalFormGroup = this._formBuilder.group({
      firstname: ['', [Validators.required, Validators.nullValidator]],
      lastname: ['', [Validators.required, Validators.nullValidator]],
      email: ['', [Validators.required, Validators.nullValidator, Validators.email]],
      mobile: ['', [Validators.required, Validators.nullValidator]]
    });
    this.businessFormGroup = this._formBuilder.group({
      businessName: ['', [Validators.required, Validators.nullValidator]],
      category: ['', [Validators.required, Validators.nullValidator]],
      country: ['', [Validators.required, Validators.nullValidator]],
      region: ['', [Validators.required, Validators.nullValidator]],
      street: ['', [Validators.required, Validators.nullValidator]]
    });
    this.loginFormGroup = this._formBuilder.group({
      username: ['', [Validators.required, Validators.nullValidator, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.nullValidator,
        // Validators.pattern(new RegExp('^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$')),
        Validators.minLength(8)
      ]],
    });

    this.personalFormGroup.get('email').valueChanges.subscribe(value => {
      if (value) {
        this.loginFormGroup.get('username').setValue(value);
      }
    });
  }

  openAccount() {
    const valid = this.businessFormGroup.valid
      && this.personalFormGroup.valid
      && this.loginFormGroup.valid;
    if (valid) {
      // @ts-ignore
      const user: UserModel = {};
      Object.assign(user, this.personalFormGroup.value);
      Object.assign(user, this.businessFormGroup.value);
      Object.assign(user, this.loginFormGroup.value);
      // @ts-ignore
      delete user.confPassword;
      this.registerProgress = true;
      this.userDatabase.register(user)
        .then(value => {
          this.registerProgress = false;
          this.logger.i(value);
          this.dialog.open(RegisterDialogComponent, {
            closeOnNavigation: true,
            disableClose: true,
            maxWidth: '500px',
            data: {
              message: `Account verification email sent to this email: ${user.email}. Verify your account to be able to login`
            }
          }).afterClosed().subscribe(_ => {
            this.router.navigateByUrl('/account/login').catch(reason => console.log(reason));
          });
        })
        .catch(reason => {
          this.logger.e(reason);
          this.registerProgress = false;
          this.dialog.open(RegisterDialogComponent, {
            closeOnNavigation: true,
            disableClose: true,
            data: {
              message: (reason && reason.message)
                ? reason.message
                : 'Your request was not successful, try again'
            }
          });
        });
    } else {
      this.messageService.showMobileInfoMessage('Enter all required information');
    }
  }
}
