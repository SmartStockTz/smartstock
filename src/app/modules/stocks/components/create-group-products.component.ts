import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {UserService} from 'src/app/modules/account/services/user.service';
import {ShopModel} from '../../account/models/shop.model';
import {StorageService} from '../../lib/services/storage.service';
import {StockModel} from '../models/stock.model';


@Component({
  selector: 'smartstock-create-group-product',
  template: `
    <div style="width: 95%">
      <h1 mat-dialog-title>Create Group Product</h1>
      <div mat-dialog-content>
        <div>
          <form [formGroup]="createGroupForm" (ngSubmit)="createGroupProduct()">
            <mat-form-field appearance="fill" style="width: 100%">
              <mat-label>Name</mat-label>
              <input matInput formControlName="product" type="text">
            </mat-form-field>
            <mat-form-field appearance="fill" style="width: 100%">
              <mat-label>Name</mat-label>
              <input matInput formControlName="retailPrice" type="text">
            </mat-form-field>
            <div *ngFor="let item of data.items">
              <div style="display: flex;">
                <mat-form-field style="width: 100%">
                  <mat-label>{{item.product}}</mat-label>
                  <input min="0" matInput type="number" required formGroupName="{{item.id}}">
                  <mat-error>{{item.product}} field required</mat-error>
                </mat-form-field>
              </div>
            </div>
            <div style="height: 20px;"></div>
            <div>
              <button mat-button color="primary" mat-flat-button>Create</button>
              <span style="flex: 1 1 auto"></span>
              <button mat-button color="warn" (click)="closeDialog($event)">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class CreateGroupProductsComponent {

  activeShop: ShopModel;
  shops: ShopModel[] = [];
  createGroupForm: FormGroup;

  constructor(private readonly shopsApi: UserService,
              private activeShopApi: StorageService,
              private readonly dialogRef: MatDialogRef<CreateGroupProductsComponent>,
              private readonly snack: MatSnackBar,
              private readonly formBuilder: FormBuilder,
              private readonly changeDetectorRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: { items: StockModel[] }) {

  }

  createGroupProduct() {
    this.createGroupForm.markAsTouched();
    this.changeDetectorRef.detectChanges();
    if (this.createGroupForm.valid) {
      console.log(this.createGroupForm.value);
    } else {
      this.snack.open('Please fix all errors', 'Ok', {duration: 2000});
    }
  }

  ngOnInit() {
    this.activeShopApi.getActiveShop().then(activeShop => {
      this.activeShop = activeShop;
      this.shopsApi.getShops().then(shops => {
        this.shops = shops.filter(shop => shop.projectId !== this.activeShop.projectId);
      });
    });
    const group = {
      notes: ['', []]
    };
    if (this.data.items && Array.isArray(this.data.items)) {
      this.data.items.forEach(item => {
        group[item.id] = [0, [Validators.required, Validators.min(0), Validators.nullValidator]];
      });
    }
    this.createGroupForm = this.formBuilder.group(group);
  }

  closeDialog($event: MouseEvent) {
    $event.preventDefault();
    this.dialogRef.close();
  }
}
