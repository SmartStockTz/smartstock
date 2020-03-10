import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDatabaseService} from '../services/user-database.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showProgress = false;
  isLogin = true;
  loginForm: FormGroup;

  constructor(private readonly snack: MatSnackBar,
              private readonly routes: Router,
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

  login() {
    if (!this.loginForm.valid) {
      this.snack.open('Enter all required field', 'Ok', {duration: 3000});
    } else {
      this.showProgress = true;
      this.loginForm.value.username.trim();
      this.loginForm.value.password.trim();
      this.userDatabase.login(this.loginForm.value).then(user => {
        if (user.role === 'admin') {
          this.stopProgressAndCleanForm();
          this.showMainUi('admin');
        } else {
          this.stopProgressAndCleanForm();
          this.showMainUi('cashier');
        }
      }).catch(reason => {
        console.log(reason);
        this.showProgress = false;
        this.snack.open('Username or password is wrong or check your' +
          ' internet connection, enter the details correctly and try again', 'Ok');
      });
    }
  }

  private stopProgressAndCleanForm() {
    this.showProgress = false;
    // this.loginForm.reset();
  }

  private showMainUi(role: string) {
    if (role === 'admin') {
      this.routes.navigateByUrl('/dashboard').catch(reason => console.log(reason)).then(() => this.loginForm.reset());
    } else {
      this.routes.navigateByUrl('/sale/report').catch(reason => console.log(reason)).then(() => this.loginForm.reset());
    }
  }

  reset($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.snack.open(
      'Please contact us @ +255764943055 to recover your password',
      'Ok',
    );
  }
}
