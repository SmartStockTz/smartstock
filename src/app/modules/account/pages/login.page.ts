import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../services/user-database.service';
import {LogService} from '../../lib/services/log.service';
import {environment} from '../../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {ResetPasswordDialogComponent} from '../components/reset-password.component';

@Component({
  selector: 'smartstock-login',
  template: `
    <div class="login-wrapper">

      <div class="container login-sec">

        <div class="login-title text-center">
          Login
        </div>
        <div class="col-sm-12 col-12 col-md-6 col-xl-4 col-lg-6 offset-xl-4 offset-lg-3 offset-md-3">

          <mat-progress-bar *ngIf="showProgress"
                            class="full-width rounded-top"
                            mode="indeterminate">
          </mat-progress-bar>

          <form [formGroup]="loginForm" #formElement="ngForm" (ngSubmit)="login(formElement)">
            <mat-card>
              <mat-card-content>
                <mat-form-field class="full-width" appearance="outline">
                  <mat-label>Username</mat-label>
                  <input matInput formControlName="username" type="text" required>
                  <mat-error>Username required</mat-error>
                </mat-form-field>
                <mat-form-field class="full-width" appearance="outline">
                  <mat-label>Password</mat-label>
                  <input (keypress)="handleEnterKey($event, formElement)" matInput
                         [type]="showPasswordFlag?'text':'password'" formControlName="password" required>
                  <button matSuffix (click)="showPassword($event)" mat-icon-button>
                    <mat-icon *ngIf="showPasswordFlag">visibility_on</mat-icon>
                    <mat-icon *ngIf="!showPasswordFlag">visibility_off</mat-icon>
                  </button>
                  <mat-error>Password required</mat-error>
                </mat-form-field>
              </mat-card-content>
              <mat-card-actions *ngIf="!showProgress">
                <button mat-raised-button
                        color="primary"
                        class="btn-block ft-button">
                  Login
                </button>
              </mat-card-actions>
              <mat-card-actions *ngIf="!showProgress">
                <button routerLink="/account/register"
                        (click)="$event.preventDefault()"
                        mat-raised-button
                        color="primary"
                        class="btn-block ft-button">
                  Open Account For Free
                </button>
              </mat-card-actions>
            </mat-card>
          </form>

        </div>

      </div>

      <footer>
        <!--      <div class="social">-->
        <!--        <a target="_blank" href="https://www.instagram.com/smartstockmanager/">-->
        <!--          <i class="icon ion-social-instagram"></i>-->
        <!--        </a>-->
        <!--        <a target="_blank" href="https://twitter.com/smartstockmanag">-->
        <!--          <i class="icon ion-social-twitter"></i>-->
        <!--        </a>-->
        <!--        <a target="_blank" href="https://fb.me/smartstockmanager">-->
        <!--          <i class="icon ion-social-facebook"></i>-->
        <!--        </a>-->
        <!--      </div>-->
        <div style="display: flex; flex-direction: row; padding: 8px; align-items: center;">
          <a *ngIf="isBrowser" style="color: white; padding: 8px" routerLink="/">
            Go Back Home
          </a>
          <a style="color: white; padding: 8px" href="#" (click)="reset($event)">
            Reset Password
          </a>
          <!--      <a style="color: white; padding: 8px" (click)="$event.preventDefault()" routerLink="/account/register">-->
          <!--        Register-->
          <!--      </a>-->
        </div>
        <p class="text-center" style="color: white; margin-top: 8px">FahamuTech © 2020</p>
      </footer>
    </div>
  `,
  styleUrls: ['../style/login.style.css']
})
export class LoginPage implements OnInit {
  showProgress = false;
  loginForm: FormGroup;
  showPasswordFlag = false;
  isBrowser = environment.browser;

  constructor(private readonly snack: MatSnackBar,
              private readonly routes: Router,
              private readonly dialog: MatDialog,
              private readonly log: LogService,
              private readonly formBuilder: FormBuilder,
              private readonly userDatabase: UserDatabaseService) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.nullValidator]],
      password: ['', [Validators.required, Validators.nullValidator]],
    });
  }

  login(formElement: FormGroupDirective) {
    if (!this.loginForm.valid) {
      this.snack.open('Enter all required field', 'Ok', {duration: 3000});
    } else {
      this.showProgress = true;
      this.loginForm.value.username.trim();
      this.loginForm.value.password.trim();
      this.userDatabase.login(this.loginForm.value).then(user => {
        if (user.role === 'admin') {
          this.stopProgressAndCleanForm(formElement);
          this.showMainUi('admin', formElement);
        } else {
          this.stopProgressAndCleanForm(formElement);
          this.showMainUi('cashier', formElement);
        }
      }).catch(reason => {
        this.log.i(reason);
        this.showProgress = false;
        this.snack.open((reason && reason.message)
          ? reason.message : reason, 'Ok', {
          duration: 5000
        });
      });
    }
  }

  private stopProgressAndCleanForm(formElement: FormGroupDirective) {
    this.showProgress = false;
    this.loginForm.reset();
    formElement.resetForm();
  }

  private showMainUi(role: string, formElement: FormGroupDirective) {
    if (role === 'admin') {
      this.routes.navigateByUrl('/dashboard').catch(reason => this.log.i(reason)).then(() => {
        this.loginForm.reset();
        formElement.resetForm();
      });
    } else {
      this.routes.navigateByUrl('/sale').catch(reason => this.log.i(reason)).then(() => {
        this.loginForm.reset();
        formElement.resetForm();
      });
    }
  }

  reset($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.loginForm.value.username) {
      this.showProgress = true;
      this.userDatabase.resetPassword(this.loginForm.value.username).then(value => {
        this.showProgress = false;
        this.dialog.open(ResetPasswordDialogComponent, {
          data: {
            message: value && value.message ? value.message : null
          },
          closeOnNavigation: true
        });
      }).catch(reason => {
        this.showProgress = false;
        this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
          duration: 3000
        });
      });
    } else {
      this.dialog.open(ResetPasswordDialogComponent, {
        closeOnNavigation: true,
      });
    }
  }

  showPassword($event: MouseEvent) {
    $event.preventDefault();
    this.showPasswordFlag = !this.showPasswordFlag;
  }

  handleEnterKey($event: KeyboardEvent, formElement) {
    const keyCode = $event.code;
    if (keyCode === 'Enter') {
      this.login(formElement);
    }
  }
}
