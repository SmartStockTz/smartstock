import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {UserDatabaseService} from '../services/user-database.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {NgForage} from 'ngforage';
import {UserI} from '../model/UserI';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showProgress = false;
  isLogin = true;
  usernameControlInput = new FormControl();
  passwordControlInput = new FormControl();

  constructor(public routes: Router,
              private http: HttpClient,
              private snack: MatSnackBar,
              private indexDb: NgForage,
              private userDatabase: UserDatabaseService) {
  }

  ngOnInit() {
    this.indexDb.getItem<UserI>('user').then(value => {
      if (value === null) {
        this.isLogin = false;
      } else {
        this.showMainUi(value.role);
      }
    });
  }

  goHome() {
    console.log('back is clicked');
    this.routes.navigateByUrl('/').catch(reason => {
      console.log(reason.toString());
    });
  }

  login() {
    if (this.usernameControlInput.value === null) {
      this.snack.open('Enter user name please', 'Ok', {duration: 3000});
    } else if (this.passwordControlInput.value === null) {
      this.snack.open('Please enter password', 'Ok', {duration: 3000});
    } else {
      this.showProgress = true;
      this.userDatabase.login({
        username: this.usernameControlInput.value,
        password: this.passwordControlInput.value,
      }).then(value => {
        // get user role
        this.indexDb.getItem<UserI>('user').then(value1 => {

          if (value1 === null) {
            this.showProgress = false;
            this.snack.open('User role is not available', 'Ok');
          } else {
            if (value1.role === 'admin') {
              this.stopProgressAndCleanForm();
              this.showMainUi('admin');
            } else {
              this.stopProgressAndCleanForm();
              this.showMainUi('cashier');
            }
          }
        }).catch(reason => {
          this.showProgress = false;
          this.snack.open(reason, 'Ok');
        });
      }).catch(reason => {
        this.showProgress = false;
        this.snack.open(reason, 'Ok');
      });
    }

  }

  private stopProgressAndCleanForm() {
    this.showProgress = false;
    this.usernameControlInput.setValue('');
    this.passwordControlInput.setValue('');
  }

  private showMainUi(role: string) {
    if (role === 'admin') {
      this.routes.navigateByUrl('admin').catch(reason => console.log(reason));
    } else {
      this.routes.navigateByUrl('sale').catch(reason => console.log(reason));
    }
  }

  reset() {
    if (this.usernameControlInput.value === null) {
      this.snack.open('Please enter your username to reset the password', 'Ok', {duration: 30000});
    } else {
      this.showProgress = true;
      this.userDatabase.resetPassword({
        username: this.usernameControlInput.value,
        password: ''
      }).then(value => {
        this.showProgress = false;
        this.snack.open('Reset instruction is sent to your email, Log to your email and reset the password', 'Ok');
      }).catch(reason => {
        this.showProgress = false;
        this.snack.open(reason, 'Ok');
      });
    }
  }
}
