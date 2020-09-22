import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {UserService} from 'src/app/modules/account/services/user.service';
import {ShopModel} from '../../account/models/shop.model';
import {StorageService} from '../../lib/services/storage.service';
import {StockModel} from '../models/stock.model';


@Component({
  selector: 'smartstock-transfer-dialog',
  template: `
    <div style="width: 95%">
      <h1 mat-dialog-title>Transfer Stocks</h1>

      <ng-container *ngIf="this.shops.length > 1; else elseTemplate">
        <div mat-dialog-content>
          <div>
            <mat-card-subtitle>Transfer to which shop ( s )</mat-card-subtitle>
            <mat-form-field appearance="fill" style="width: 100%">
              <mat-label>Select Shop</mat-label>
              <mat-select [formControl]="shop" multiple>
                <mat-option *ngFor="let shop of shops" [value]="shop">{{ shop.businessName }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div>
            <form [formGroup]="transferStockGroup" (ngSubmit)="transferStocks()">
              <div *ngFor="let item of data.items">
                <div style="display: flex;">
                  <mat-form-field style="width: 100%">
                    <mat-label>Quantity of {{item.product}}</mat-label>
                    <input min="0" matInput type="number" required formGroupName="{{item.id}}">
                    <mat-error>{{item.product}} field required</mat-error>
                  </mat-form-field>
                </div>
              </div>
              <mat-form-field style="width: 100%">
                <mat-label>Transfer Notes</mat-label>
                <textarea rows="3" matInput formControlName="notes"></textarea>
              </mat-form-field>
              <div style="height: 20px;"></div>
              <div>
                <button mat-button color="primary" mat-flat-button>Transfer</button>
                <span style="flex: 1 1 auto"></span>
                <button mat-button color="warn" (click)="closeDialog($event)">Close</button>
              </div>
            </form>
          </div>
        </div>
      </ng-container>
      <ng-template #elseTemplate>
        <p> You have no extra shop ( s ) to transfer stock to</p>
      </ng-template>
    </div>
  `,
})
export class TransferDialogComponent {

  shop = new FormControl();
  activeShop: ShopModel;
  shops: ShopModel[] = [];
  transferStockGroup: FormGroup;

  constructor(private readonly shopsApi: UserService,
              private activeShopApi: StorageService,
              private readonly dialogRef: MatDialogRef<TransferDialogComponent>,
              private readonly snack: MatSnackBar,
              private readonly formBuilder: FormBuilder,
              private readonly changeDetectorRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: { items: StockModel[] }) {

  }

  transferStocks() {
    this.transferStockGroup.markAsTouched();
    this.changeDetectorRef.detectChanges();
    console.log(this.transferStockGroup.value);
    if (this.transferStockGroup.valid) {
      console.log(this.transferStockGroup.value);
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
    this.transferStockGroup = this.formBuilder.group(group);
  }

  closeDialog($event: MouseEvent) {
    $event.preventDefault();
    this.dialogRef.close();
  }
}
