import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {RegisterDialogComponent} from './rdialog.component';
import {UserDatabaseService} from '../../services/user-database.service';
import {UserI} from '../../model/UserI';
import {LogService} from '../../services/log.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
      const user: UserI = {};

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
            this.router.navigateByUrl('/login').catch(reason => console.log(reason));
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
