import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserI} from '../../model/UserI';
import {MatSnackBar} from '@angular/material';
import {UserDatabaseService} from '../../services/user-database.service';

@Component({
  selector: 'app-profile-address',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.css']
})
export class ProfileAddressComponent implements OnInit {
  businessForm: FormGroup;
  currentUser: UserI;
  getBusinessProgress = false;
  updateBusinessProgress = false;
  businessFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly _userApi: UserDatabaseService) {
  }

  ngOnInit() {
    this._getCurrentBusiness();
  }

  private _initializeForm(user: UserI) {
    this.businessFormControl.setValue(user.businessName);
    this.businessForm = this._formBuilder.group({
      country: [user.country, [Validators.nullValidator, Validators.required]],
      street: [user.street, [Validators.nullValidator, Validators.required]],
      region: [user.region, [Validators.nullValidator, Validators.required]],
    });
  }

  private _getCurrentBusiness() {
    this.getBusinessProgress = true;
    this._userApi.currentUser().then(user => {
      this.currentUser = user;
      this._initializeForm(this.currentUser);
      this.getBusinessProgress = false;
    }).catch(reason => {
      console.log(reason);
      this.getBusinessProgress = false;
      this._snack.open('Error when trying to get shop details', 'Ok', {
        duration: 3000
      });
    });
  }

  updatePersonalInformation() {
    if (this.businessForm.valid) {
      this.updateBusinessProgress = true;
      this._userApi.updateUser(this.currentUser, this.businessForm.value).then(async user => {
        this.updateBusinessProgress = false;
        this._snack.open('Your shop information is updated', 'Ok', {
          duration: 3000
        });
        await this._userApi.updateCurrentUser(user);
        this.businessForm.reset({
          country: user.country,
          region: user.region,
          street: user.street
        });
      }).catch(reason => {
        console.log(reason);
        this.updateBusinessProgress = false;
        this._snack.open('Fails to update your shop information try again later', 'Ok', {
          duration: 3000
        });
        this.businessForm.reset({
          country: this.currentUser.country,
          region: this.currentUser.region,
          street: this.currentUser.street
        });
      });
    } else {
      this._snack.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }
}
