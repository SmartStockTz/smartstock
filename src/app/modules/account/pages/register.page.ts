import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {RegisterDialogComponent} from '../components/register-dialog.component';
import {UserDatabaseService} from '../services/user-database.service';
import {UserModel} from '../models/user.model';
import {LogService} from '../../lib/services/log.service';

@Component({
  selector: 'smartstock-register',
  template: `
    <div class="main-container container">
      <mat-toolbar class="row">
        <!--    <button mat-icon-button>-->
        <!--      <mat-icon>arrow_back</mat-icon>-->
        <!--    </button>-->
        <a routerLink="/" class="h4">SmartStock</a>
        <span style="flex: 1 1 auto"></span>
        <a routerLink="/" class="h4">
          <mat-icon>close</mat-icon>
        </a>
      </mat-toolbar>

      <div class="register-form">
        <mat-vertical-stepper [linear]="true" #stepper>
          <mat-step [stepControl]="personalFormGroup">
            <form [formGroup]="personalFormGroup">
              <ng-template matStepLabel>Fill personal details</ng-template>
              <div class="stepper-inputs">
                <mat-form-field appearance="fill">
                  <mat-label>FirstName</mat-label>
                  <mat-icon matSuffix>face</mat-icon>
                  <input matInput class="inputs" type="text" formControlName="firstname" required>
                  <mat-error>FirstName required</mat-error>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>LastName</mat-label>
                  <mat-icon matSuffix>face</mat-icon>
                  <input matInput class="inputs" type="text" formControlName="lastname" required>
                  <mat-error>LastName required</mat-error>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Email</mat-label>
                  <mat-icon matSuffix>email</mat-icon>
                  <input matInput class="inputs" type="email" formControlName="email" required>
                  <mat-error>Email required</mat-error>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Mobile number</mat-label>
                  <span matPrefix>+</span>
                  <mat-icon matSuffix>phone</mat-icon>
                  <input matInput class="inputs" type="number" formControlName="mobile" required>
                  <mat-error>Mobile number required</mat-error>
                </mat-form-field>

              </div>
              <div>
                <button mat-button class="stepper-btn" matStepperNext>Next</button>
              </div>
            </form>
          </mat-step>
          <mat-step [stepControl]="businessFormGroup">
            <form [formGroup]="businessFormGroup">
              <ng-template matStepLabel>Fill your business details</ng-template>
              <div class="stepper-inputs">
                <mat-form-field appearance="fill">
                  <mat-label>Business Name</mat-label>
                  <mat-icon matSuffix>business</mat-icon>
                  <input matInput class="inputs" type="text" formControlName="businessName"
                         required>
                  <mat-error>Business name required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Shop Category</mat-label>
                  <mat-icon matSuffix>category</mat-icon>
                  <mat-select formControlName="category" class="" required="">
                    <mat-option value="atrists_photographers_creative">Artists, Photographers &amp; Creative Types
                    </mat-option>
                    <mat-option value="consultants_professionals">Consultants &amp; Professionals</mat-option>
                    <mat-option value="finance_insurance">Financial Services</mat-option>
                    <mat-option value="product_provider">General: I make or sell a PRODUCT</mat-option>
                    <mat-option value="service_provider">General: I provide a SERVICE</mat-option>
                    <mat-option value="hair_spa_aesthetics">Hair, Spa &amp; Aesthetics</mat-option>
                    <mat-option value="medical_dental_health_service">Medical, Dental, Health</mat-option>
                    <mat-option value="nonprofit_associations_groups">Non-profits, Associations &amp; Groups</mat-option>
                    <mat-option value="realestate_home">Real Estate, Construction &amp; Home Improvement</mat-option>
                    <mat-option value="retailers_and_resellers">Retailers, Resellers &amp; Sales</mat-option>
                    <mat-option value="web_media_freelancer">Web, Tech &amp; Media</mat-option>
                  </mat-select>
                  <mat-error>Choose category</mat-error>
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Country</mat-label>
                  <mat-icon matSuffix>person_pin</mat-icon>
                  <input matInput class="inputs" type="text" formControlName="country" required>
                  <mat-error>Country required</mat-error>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Region</mat-label>
                  <mat-icon matSuffix>person_pin</mat-icon>
                  <input matInput class="inputs" type="text" formControlName="region" required>
                  <mat-error>Region required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="fill">
                  <mat-label>Street / Business location</mat-label>
                  <mat-icon matSuffix>person_pin</mat-icon>
                  <textarea matInput class="inputs" formControlName="street"
                            required></textarea>
                  <mat-error>Street required</mat-error>
                </mat-form-field>

              </div>
              <div>
                <button mat-button class="stepper-btn" matStepperPrevious>Back</button>
                <button mat-button class="stepper-btn" matStepperNext>Next</button>
              </div>
            </form>
          </mat-step>
          <mat-step [stepControl]="loginFormGroup">
            <form [formGroup]="loginFormGroup">
              <ng-template matStepLabel>Login Information</ng-template>
              <div class="stepper-inputs">
                <mat-form-field appearance="fill">
                  <mat-label>Username</mat-label>
                  <mat-icon matSuffix>face</mat-icon>
                  <input matInput class="inputs" type="text"
                         formControlName="username" required>
                  <mat-error>Username required, and must be at least 6 character long</mat-error>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Password</mat-label>
                  <input matInput class="inputs" [type]="showPasswordFlag?'text':'password'"
                         formControlName="password" placeholder="Password" required>
                  <mat-error>Password required, and must be at least 8 character long</mat-error>
                  <button matSuffix (click)="showPassword($event)" mat-icon-button>
                    <mat-icon *ngIf="showPasswordFlag">visibility_on</mat-icon>
                    <mat-icon *ngIf="!showPasswordFlag">visibility_off</mat-icon>
                  </button>
                </mat-form-field>

              </div>
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
                                      [diameter]="20"
                                      mode="indeterminate"
                                      color="primary">
                </mat-progress-spinner>
              </div>
            </form>
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
  showPasswordFlag = false;

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly userDatabase: UserDatabaseService,
              private readonly snack: MatSnackBar) {
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
      username: ['', [Validators.required, Validators.nullValidator, Validators.minLength(6)]],
      password: ['', [
        Validators.required,
        Validators.nullValidator,
        // Validators.pattern(new RegExp('^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$')),
        Validators.minLength(8)
      ]],
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
            data: {
              message: `Account verification email sent to this email: ${user.email}. Go and verify your account to be able to login`
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
              message: (reason && reason.error && reason.error.message && reason)
                ? (typeof reason.error.message === 'object' && reason.error.message.error)
                  ? reason.error.message.error : 'Your request was not successful, try again'
                : 'Your request was not successful, try again'
            }
          });
        });
    } else {
      this.snack.open('Enter all required information', 'Ok', {
        duration: 3000
      });
    }
  }

  showPassword($event: MouseEvent) {
    $event.preventDefault();
    this.showPasswordFlag = !this.showPasswordFlag;
  }
}
