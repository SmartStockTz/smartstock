import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserDatabaseService} from '../services/user-database.service';
import {UserI} from '../model/UserI';
import {Router} from '@angular/router';

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

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly userDatabase: UserDatabaseService,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.personalFormGroup = this._formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required]
    });
    this.businessFormGroup = this._formBuilder.group({
      businessName: ['', Validators.required],
      category: ['', [Validators.required, Validators.nullValidator]],
      country: ['', Validators.required],
      region: ['', Validators.required],
      street: ['', Validators.required]
    });
    this.loginFormGroup = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confPassword: ['', Validators.required]
    });
  }

  openAccount() {
    const valid = this.businessFormGroup.valid
      && this.personalFormGroup.valid
      && this.loginFormGroup.valid;
    if (valid) {
      if (this.loginFormGroup.get('password').value
        !== this.loginFormGroup.get('confPassword').value) {
        this.snack.open('Password not match', 'Ok', {
          duration: 3000
        });
        return;
      }
      // @ts-ignore
      const user: UserI = {};

      Object.keys(this.personalFormGroup.value).forEach(key => {
        user[key] = this.personalFormGroup.value[key];
      });
      Object.keys(this.businessFormGroup.value).forEach(key => {
        user[key] = this.businessFormGroup.value[key];
      });
      Object.keys(this.loginFormGroup.value).forEach(key => {
        user[key] = this.loginFormGroup.value[key];
      });
      // @ts-ignore
      delete user.confPassword;
      // console.log(user);
      this.registerProgress = true;
      this.userDatabase.register(user).then(value => {
        this.registerProgress = false;
        // console.log(value);
        this.router.navigateByUrl('/dashboard').catch(reason => console.log(reason));
      }).catch(reason => {
        // console.log(reason);
        this.registerProgress = false;
      });
    } else {
      this.snack.open('Enter all required information', 'Ok', {
        duration: 3000
      });
    }
  }
}
