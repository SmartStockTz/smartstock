import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../models/user.model';
import {ShopModel} from '../models/shop.model';
import {UserService} from '../services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../lib/services/storage.service';

@Component({
  selector: 'smartstock-profile-address',
  template: `
    <div class="profile-business-wrapper">
      <mat-card class="mat-elevation-z0">
        <form *ngIf="!getBusinessProgress && businessForm" [formGroup]="businessForm"
              (ngSubmit)="updatePersonalInformation()">
          <div class="row">
            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">

              <mat-form-field appearance="outline" class="btn-block" matTooltip="read only field">
                <mat-label>Principal Shop</mat-label>
                <input style="color: gray" matInput [formControl]="businessFormControl" type="text" [readonly]="true">
              </mat-form-field>

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>Country</mat-label>
                <input matInput formControlName="country" type="text">
                <mat-error>country field required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>Region</mat-label>
                <input matInput formControlName="region" type="text">
                <mat-error>last name field required</mat-error>
              </mat-form-field>

            </div>

            <div class="col-12 col-sm-12 col-md-6 col-xl-6 col-lg-6">

              <mat-form-field appearance="outline" class="btn-block">
                <mat-label>street</mat-label>
                <textarea [rows]="3" matInput formControlName="street" type="text"></textarea>
                <mat-error>street field required</mat-error>
              </mat-form-field>

            </div>
          </div>
          <div class="row">
            <button [disabled]="updateBusinessProgress" class="ft-button" mat-flat-button color="primary">
              SAVE
              <mat-progress-spinner *ngIf="updateBusinessProgress"
                                    style="display: inline-block" [diameter]="30"
                                    mode="indeterminate"
                                    color="primary"></mat-progress-spinner>
            </button>
          </div>
        </form>

        <mat-progress-spinner *ngIf="getBusinessProgress" mode="indeterminate" color="primary"
                              [diameter]="25"></mat-progress-spinner>

        <div *ngIf="!getBusinessProgress && !businessForm">
          <mat-card-subtitle>
            Failure when try to fetch your business information, try to refresh
          </mat-card-subtitle>
          <button (click)="getCurrentBusiness()" mat-icon-button>
            <mat-icon color="primary">
              refresh
            </mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['../style/profile.style.css']
})
export class AddressComponent implements OnInit {
  businessForm: FormGroup;
  currentUser: UserModel;
  currentShop: ShopModel;
  getBusinessProgress = false;
  updateBusinessProgress = false;
  businessFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);

  constructor(private readonly _formBuilder: FormBuilder,
              private readonly _snack: MatSnackBar,
              private readonly _storage: StorageService,
              private readonly _userApi: UserService) {
  }

  ngOnInit() {
    this.getCurrentBusiness();
  }

  private _initializeForm(user: UserModel) {
    this.businessFormControl.setValue(user.businessName);
    this.businessForm = this._formBuilder.group({
      country: [user.country, [Validators.nullValidator, Validators.required]],
      street: [user.street, [Validators.nullValidator, Validators.required]],
      region: [user.region, [Validators.nullValidator, Validators.required]],
    });
  }

  getCurrentBusiness() {
    this.getBusinessProgress = true;
    this._storage.getActiveUser().then(user => {
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
