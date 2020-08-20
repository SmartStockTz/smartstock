import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UserDatabaseService} from '../../services/user-database.service';
import {LogService} from '../../modules/lib/services/log.service';
import {environment} from '../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {ResetPasswordDialogComponent} from './reset-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
        this.snack.open((reason && reason.error && reason.error.error)
          ? reason.error.error : 'Your request was not successful try again', 'Ok', {
          duration: 7000
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
