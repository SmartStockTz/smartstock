import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserDatabaseService} from '../../../services/user-database.service';
import {UserI} from '../../../model/UserI';

@Component({
  selector: 'app-profile-personal',
  templateUrl: './profile-personal.component.html',
  styleUrls: ['./profile-personal.component.css']
})
export class ProfilePersonalComponent implements OnInit {
  personalForm: FormGroup;
  currentUser: UserI;
  getUserProgress = false;
  updateUserProgress = false;
  usernameFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly _userApi: UserDatabaseService) {
  }

  ngOnInit() {
    this._getCurrentUser();
  }

  private _initializeForm(user: UserI) {
    this.usernameFormControl.setValue(user.username);
    this.personalForm = this._formBuilder.group({
      firstname: [user.firstname, [Validators.nullValidator, Validators.required]],
      lastname: [user.lastname, [Validators.nullValidator, Validators.required]],
      email: [user.email, [Validators.nullValidator, Validators.required]],
      mobile: [user.mobile, [Validators.nullValidator, Validators.required]],
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
      this._snack.open('Error when trying get your details', 'Ok', {
        duration: 3000
      });
    });
  }

  updatePersonalInformation() {
    if (this.personalForm.valid) {
      this.updateUserProgress = true;
      this._userApi.updateUser(this.currentUser, this.personalForm.value).then(async user => {
        this.updateUserProgress = false;
        this._snack.open('Your personal information is updated', 'Ok', {
          duration: 3000
        });
        await this._userApi.updateCurrentUser(user);
        this.personalForm.reset({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          mobile: user.mobile
        });
      }).catch(reason => {
        console.log(reason);
        this.updateUserProgress = false;
        this._snack.open('Fails to update your persona information try again later', 'Ok', {
          duration: 3000
        });
        this.personalForm.reset({
          firstname: this.currentUser.firstname,
          lastname: this.currentUser.lastname,
          email: this.currentUser.email,
          mobile: this.currentUser.mobile
        });
      });
    } else {
      this._snack.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }
}
