import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserI} from '../../model/UserI';
import {MatSnackBar} from '@angular/material';
import {UserDatabaseService} from '../../services/user-database.service';

@Component({
  selector: 'app-profile-authentication',
  templateUrl: './profile-authentication.component.html',
  styleUrls: ['./profile-authentication.component.css']
})
export class ProfileAuthenticationComponent implements OnInit {
  authForm: FormGroup;
  currentUser: UserI;
  getUserProgress = false;
  updateUserProgress = false;
  showLastPassword = false;
  showPassword = false;

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly _userApi: UserDatabaseService) {
  }

  ngOnInit() {
    this._getCurrentUser();
  }

  private _initializeForm(user: UserI) {
    this.authForm = this._formBuilder.group({
      lastPassword: [''],
      password: [''],
    });
  }

  private _getCurrentUser() {
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
