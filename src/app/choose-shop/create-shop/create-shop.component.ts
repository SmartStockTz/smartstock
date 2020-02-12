import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogData} from 'src/app/sales-module/whole-sale/whole-sale.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShopDatabaseService} from '../../services/shop-database.service';

export interface DialogData {
  customer?: string;
  name?: string;
  type: number;
}

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css'],
})
export class CreateShopComponent implements OnInit {

  createShopForm: FormGroup;
  createShopProgress = false;

  constructor(public dialogRef: MatDialogRef<CreateShopComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private readonly snack: MatSnackBar,
              private readonly _shopApi: ShopDatabaseService,
              private readonly formBuilder: FormBuilder) {
  }

  createShop() {
    if (this.createShopForm.valid) {
      this.createShopProgress = true;
      this._shopApi.createShop(this.createShopForm.value).then(value => {
        this.dialogRef.close(value);
        this.snack.open('Shop created successful', 'Ok', {
          duration: 3000
        });
        this.createShopProgress = false;
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
