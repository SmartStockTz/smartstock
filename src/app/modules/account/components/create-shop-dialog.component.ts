import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '@smartstock/core-libs';
import {ShopDatabaseService} from '../services/shop-database.service';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
}

@Component({
  template: `
    <div>
      <form [formGroup]="createShopForm" (ngSubmit)="createShop()" class="create-shop-form-container">
        <mat-form-field appearance="">
          <mat-label>Shop Name</mat-label>
          <input matInput formControlName="businessName" placeholder="Shop Name">
          <mat-error>Shop name required</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Shop Category</mat-label>
          <mat-select formControlName="category" class="" required="">
            <mat-option value="atrists_photographers_creative">Artists, Photographers &amp; Creative Types</mat-option>
            <mat-option value="consultants_professionals">Consultants &amp; Professionals</mat-option>
            <mat-option value="finance_insurance">Financial Services</mat-option>
            <mat-option value="product_provider">General: I make or sell a PRODUCT</mat-option>
            <mat-option value="service_provider">General: I provide a SERVICE</mat-option>
            <mat-option value="hair_spa_aesthetics">Hair, Spa &amp; Aesthetics</mat-option>
            <mat-option value="medical_dental_health_service">Medical, Dental, Health</mat-option>
            <mat-option value="nonprofit_associations_groups">Non-profits, Associations &amp; Groups</mat-option>
            <mat-option value="realestate_home">Real Estate, Construction &amp; Home Improvement</mat-option>
            <mat-option value="retailers_and_resellers">Retailers, Resellers &amp; Sales</mat-option>
            <mat-option value="web_media_freelancer">Web, Tech &amp; Media</mat-option>
          </mat-select>
          <mat-error>Choose category</mat-error>
        </mat-form-field>

        <mat-form-field appearance="">
          <mat-label>Country</mat-label>
          <input matInput formControlName="country" placeholder="Country">
          <mat-error>Country required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="">
          <mat-label>Region</mat-label>
          <input matInput formControlName="region" placeholder="Region">
          <mat-error>Region required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="">
          <mat-label>Street</mat-label>
          <input matInput formControlName="street" placeholder="Street/ Location">
          <mat-error>Street required</mat-error>
        </mat-form-field>

        <div class="">
          <button [disabled]="createShopProgress" class="ft-button btn-block" color="primary" mat-raised-button>
            Create Shop
            <mat-progress-spinner style="display: inline-block" *ngIf="createShopProgress" mode="indeterminate"
                                  color="primary" [diameter]="20"></mat-progress-spinner>
          </button>
        </div>
      </form>
    </div>

    <div style="margin-top: 6px">
      <button class="btn-block" mat-button color="primary" (click)="closeDialog($event)">
        Close
      </button>
    </div>
  `,
  styleUrls: ['../style/create-shop-dialog.style.css'],
  providers: [
    ShopDatabaseService
  ]
})
export class CreateShopDialogComponent implements OnInit {

  createShopForm: FormGroup;
  createShopProgress = false;

  constructor(public dialogRef: MatDialogRef<CreateShopDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private readonly snack: MatSnackBar,
              private readonly _storage: StorageService,
              private readonly _shopApi: ShopDatabaseService,
              private readonly formBuilder: FormBuilder) {
  }

  createShop() {
    if (this.createShopForm.valid) {
      this.createShopProgress = true;
      this._shopApi.createShop(this.createShopForm.value).then(async value => {
        try {
          const user = await this._storage.getActiveUser();
          user.shops.push(value);
          await this._storage.saveActiveUser(user);
          this.dialogRef.close(value);
          this.snack.open('Shop created successful', 'Ok', {
            duration: 3000
          });
          this.createShopProgress = false;
        } catch (e) {

        }
      }).catch(reason => {
        // console.log(reason);
        this.snack.open(reason.message, 'Ok', {duration: 3000});
        this.createShopProgress = false;
      });
    } else {
      this.snack.open('Please fill all required fields', 'Ok', {
        duration: 3000
      });
    }
  }

  ngOnInit() {
    this.createShopForm = this.formBuilder.group({
      businessName: ['', [Validators.nullValidator, Validators.required]],
      country: ['', [Validators.nullValidator, Validators.required]],
      category: ['product_provider', [Validators.nullValidator, Validators.required]],
      region: ['', [Validators.nullValidator, Validators.required]],
      street: ['', [Validators.nullValidator, Validators.required]],
    });
  }

  closeDialog($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}
