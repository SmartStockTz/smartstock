import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopI } from './../../../../model/ShopI';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Stock } from './../../../../model/stock';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject} from '@angular/core';
import { UserDatabaseService } from 'src/app/services/user-database.service';
import { StorageService } from './../../../../services/storage.service';


@Component({
    selector: 'app-transfer-dialog',
    template: `
        <div style="width: 95%">
            <h1 mat-dialog-title>Transfer Stocks</h1>

            <ng-container *ngIf=" this.shops.length > 1; else elseTemplate">
            <div mat-dialog-content>
                <div>
                    <mat-card-subtitle>Tranfer to which shop ( s )</mat-card-subtitle>
         <mat-form-field appearance="fill" style="width: 100%"s>
            <mat-label> Select Shop </mat-label>
            <mat-select [formControl]="shop" multiple>
                 <mat-option *ngFor="let shop of shops" [value]="shop">{{ shop.businessName }}</mat-option>
            </mat-select>
        </mat-form-field>
                </div>
                <div>
                    <form [formGroup]="transferStockGroup" (ngSubmit)="transaferStocks()">
                        <div *ngFor="let item of data.items">
                            <div style="display: flex;">
                                <mat-form-field style="width: 100%">
                                    <mat-label>Quantity of {{item.product}}</mat-label>
                                    <input matInput type="number" required formGroupName="{{item.product}}">
                                    <mat-error>{{item.product}} field required and must be atleast 1 item</mat-error>
                                </mat-form-field>
                            </div>
                        </div>
                        <div style="height: 20px;"></div>
                        <button mat-button color="primary" mat-flat-button>Transfer</button>
                    </form>
                </div>
            </div>
                </ng-container>
                <ng-template #elseTemplate>
                    <p> You have no extra shop to transfer stock to</p>
                </ng-template>
        </div>
    `,
})
export class TransferDialogComponent {

    shop = new FormControl();
    activeshop: ShopI;
    shops: ShopI[] = [];
    transferStockGroup: FormGroup;

    constructor(private readonly shopsApi: UserDatabaseService,
        private activeshopapi: StorageService,
        private readonly dialogRef: MatDialogRef<TransferDialogComponent>,
        private readonly snack: MatSnackBar,
        private readonly formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {items: Stock[]}) {

    }

    transaferStocks() {
        if (this.transferStockGroup.valid) {
            console.log(this.transferStockGroup.value);
        } else {
            this.snack.open('Please fix all errors', 'Ok', {duration: 2000});
        }
    }

    ngOnInit() {
        this.activeshopapi.getActiveShop().then( activeshop => {
            this.activeshop = activeshop;
            this.shopsApi.getShops().then( shops => {
                this.shops = shops.filter(shop => shop.projectId !== this.activeshop.projectId);
             });
        });
        const group = {};
        if (this.data.items && Array.isArray(this.data.items)) {
            this.data.items.forEach(item => {
                group[item.product] = [0, [Validators.required, Validators.min(1), Validators.nullValidator]];
            });
        }
        this.transferStockGroup = this.formBuilder.group(group);
    }

}
