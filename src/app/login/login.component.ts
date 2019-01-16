import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {UserDatabaseService} from '../services/user-database.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {NgForage} from 'ngforage';

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
    UserDatabaseService.currentUser(value => {
      if (value === null) {
        console.log('user is null');
      } else {
        console.log('user is ---> ' + value);
      }
    });

    // this.indexDb.getItem<UserI>('user').then(value => {
    //   if (value === null) {
    //     this.isLogin = false;
    //   } else {
    //     this.showMainUi(value.role);
    //   }
    // });
  }

  goHome() {
    console.log('back is clicked');
    this.routes.navigateByUrl('').catch(reason => {
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
      }, value => {
        if (value === null) {
          this.showProgress = false;
          this.snack.open('Username of password is wrong or check your' +
            ' internet connection, enter the details correctly and try again', 'Ok');
        } else {
          if (value.role === 'admin') {
            this.stopProgressAndCleanForm();
            this.showMainUi('admin');
          } else {
            this.stopProgressAndCleanForm();
            this.showMainUi('cashier');
          }
        }
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
      this.snack.open('Please enter your email to reset the password', 'Ok', {duration: 30000});
    } else {
      this.showProgress = true;
      this.userDatabase.resetPassword({
        username: '',
        password: '',
        role: '',
        meta: {
          email: this.usernameControlInput.value,
          address: '',
          fullname: '',
          number: '',
        }
      }, value => {
        if (value === null) {
          this.showProgress = false;
          this.snack.open('Error cant send reset instruction,' +
            ' make sure you have internet if problem proceed contact support', 'Ok');
        } else {
          this.showProgress = false;
          this.usernameControlInput.setValue('');
          this.snack.open('Reset instruction is sent to your email, Log to your email and reset the password', 'Ok');
        }
      });
    }
  }
}
