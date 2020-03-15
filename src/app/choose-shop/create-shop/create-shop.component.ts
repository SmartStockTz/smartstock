import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {DialogData} from 'src/app/sales-module/whole-sale/whole-sale.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShopDatabaseService} from '../../services/shop-database.service';
import {LocalStorageService} from '../../services/local-storage.service';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
}

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css'],
  providers: [
    ShopDatabaseService
  ]
})
export class CreateShopComponent implements OnInit {

  createShopForm: FormGroup;
  createShopProgress = false;

  constructor(public dialogRef: MatDialogRef<CreateShopComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private readonly snack: MatSnackBar,
              private readonly _storage: LocalStorageService,
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
        console.log(reason);
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
