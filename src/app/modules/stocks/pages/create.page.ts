import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {StockModel} from '../models/stock.model';
import {StockState} from '../states/stock.state';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';
import {ImageCropComponent} from '../../lib/components/image-crop.component';

@Component({
  selector: 'smartstock-stock-new',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-admin-drawer></smartstock-admin-drawer>
      </mat-sidenav>

      <mat-sidenav-content>

        <smartstock-toolbar [heading]="isUpdateMode?'Update StockModel':'Create StockModel'"
                            [sidenav]="sidenav"
                            [hasBackRoute]="isMobile"
                            backLink="/stock/products"
                            [showProgress]="false">
        </smartstock-toolbar>

        <div class="container stock-new-wrapper">

          <div style="padding: 16px" class="row d-flex flex-column justify-content-center align-items-center">

            <h5 style="padding: 0" class="col-12 col-xl-9 col-lg-9">
              Image
            </h5>

            <mat-card matRipple (click)="imageInput.click()"
                      class="col-12 col-xl-9 col-lg-9 d-flex flex-column justify-content-center align-items-center"
                      style="width: 100%; min-height: 100px; border-radius: 4px; background-color: #f5f5f5">
              <img matCardImageLarge style="width: 100%; height: auto; margin-top: 4px" [src]="croppedImage" alt=""/>
              <button *ngIf="!croppedImage" mat-button color="primary">Upload Image</button>
            </mat-card>

            <div *ngIf="croppedImage" style="padding: 0"
                 class="col-12 col-xl-9 col-lg-9 d-flex justify-content-center align-items-center">
              <button color="warn" (click)="removeImage(imageInput)" mat-button>Remove Image</button>
            </div>
            <input (change)="fileChangeEvent($event)" #imageInput style="display: none" type="file">

          </div>

          <form [formGroup]="productForm" #formElement="ngForm"
                (ngSubmit)="isUpdateMode?updateProduct(formElement):addProduct(formElement)">

            <div class="row d-flex justify-content-center align-items-center">

              <div style="margin-bottom: 16px" class="col-12 col-xl-9 col-lg-9">

                <smartstock-product-short-detail-form
                  [isUpdateMode]="isUpdateMode"
                  [initialStock]="initialStock"
                  [downloadAble]="getDownloadAbleFormControl().value===true"
                  [saleable]="getSaleableFormControl().value === true"
                  [downloadsFormControl]="getDownloadAbleFormControl()"
                  [formGroup]="productForm">
                </smartstock-product-short-detail-form>

                <mat-expansion-panel style="margin-top: 8px">
                  <mat-expansion-panel-header>
                    Advance Details
                  </mat-expansion-panel-header>
                  <h5>
                    Status
                  </h5>
                  <mat-card class="card-wrapper mat-elevation-z0">
                    <mat-list>
                      <mat-list-item>
                        <p matLine>Can be sold</p>
                        <mat-checkbox formControlName="saleable" matSuffix></mat-checkbox>
                      </mat-list-item>
                      <mat-list-item>
                        <p matLine>Can be stocked</p>
                        <mat-checkbox formControlName="stockable" matSuffix></mat-checkbox>
                      </mat-list-item>
                      <mat-list-item>
                        <p matLine>Can be purchased</p>
                        <mat-checkbox formControlName="purchasable" matSuffix></mat-checkbox>
                      </mat-list-item>
                    </mat-list>
                  </mat-card>

                  <h5>
                    Inventory
                  </h5>
                  <mat-card class="card-wrapper mat-elevation-z0">
                    <mat-card-content class="card-content">
                      <mat-form-field *ngIf="getPurchasableFormControl().value === true" appearance="fill" class="my-input">
                        <mat-label>Purchase Price / Unit</mat-label>
                        <span matSuffix>TZS</span>
                        <input min="0" matInput type="number" required formControlName="purchase">
                        <mat-error>Purchase price required</mat-error>
                      </mat-form-field>

                      <mat-form-field *ngIf="getSaleableFormControl().value === true" appearance="fill" class="my-input">
                        <mat-label>Wholesale Price / Unit</mat-label>
                        <span matSuffix>TZS</span>
                        <input min="0" matInput type="number" required formControlName="wholesalePrice">
                        <mat-error>Wholesale price required</mat-error>
                      </mat-form-field>

                      <!--                    <mat-form-field *ngIf="getSaleableFormControl().value === true" appearance="fill" class="my-input"-->
                      <!--                                    matTooltip="Quantity for this product to be sold as a whole or in bulk">-->
                      <!--                      <mat-label>Wholesale Quantity</mat-label>-->
                      <!--                      <input min="0" matInput-->
                      <!--                             type="number"-->
                      <!--                             required formControlName="wholesaleQuantity">-->
                      <!--                      <mat-error>Wholesale Quantity required</mat-error>-->
                      <!--                    </mat-form-field>-->

                      <mat-form-field *ngIf="getStockableFormControl().value === true" appearance="fill" class="my-input"
                                      matTooltip="Total initial unit quantity available">
                        <mat-label>Initial Stock Quantity</mat-label>
                        <input min="0" matInput type="number" required
                               formControlName="quantity">
                        <mat-error>Initial Stock Quantity required</mat-error>
                      </mat-form-field>

                      <mat-form-field *ngIf="getStockableFormControl().value === true" appearance="fill" class="my-input">
                        <mat-label>Reorder Level</mat-label>
                        <input min="0" matInput type="number" required formControlName="reorder">
                        <mat-error>Reorder field required</mat-error>
                      </mat-form-field>

                      <smartstock-category-form-field [formGroup]="productForm"></smartstock-category-form-field>
                      <smartstock-suppliers-form-field [formGroup]="productForm"
                                                       [purchasable]="getPurchasableFormControl().value===true">
                      </smartstock-suppliers-form-field>
                      <smartstock-units-form-field [stockable]="getStockableFormControl().value === true"
                                                   [formGroup]="productForm">
                      </smartstock-units-form-field>

                      <mat-checkbox matTooltip="Select if a product can expire" labelPosition="after"
                                    class="my-input"
                                    formControlName="canExpire">
                        Can Expire?
                      </mat-checkbox>

                      <mat-form-field *ngIf="getCanExpireFormControl().value === true" appearance="outline" class="my-input">
                        <mat-label>Expire Date</mat-label>
                        <input matInput [matDatepicker]="picker" formControlName="expire">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker [touchUi]="true" #picker></mat-datepicker>
                      </mat-form-field>

                    </mat-card-content>
                  </mat-card>
                </mat-expansion-panel>

              </div>

              <div class="col-12 col-xl-9 col-lg-9" style="margin-bottom: 16px">

                <div>
                  <button class="btn-block ft-button" color="primary" mat-raised-button
                          [disabled]="mainProgress">
                    {{isUpdateMode ? 'Update Product' : 'Create Product'}}
                    <mat-progress-spinner style="display: inline-block" *ngIf="mainProgress" diameter="30"
                                          mode="indeterminate"></mat-progress-spinner>
                  </button>
                  <div style="padding: 16px 0">
                    <button class="btn-block ft-button" routerLink="/stock" color="primary" mat-button>
                      Cancel
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </form>
        </div>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/create.style.css']
})
export class CreatePageComponent extends DeviceInfoUtil implements OnInit {

  @Input() isUpdateMode = false;
  @Input() initialStock: StockModel;

  croppedImage: any = '';
  productForm: FormGroup;
  metas: Observable<{
    type: string;
    label: string;
    controlName: string;
  }[]>;
  mainProgress = false;
  isMobile = environment.android;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly dialog: MatDialog,
              private readonly router: Router,
              private readonly stockDatabase: StockState) {
    super();
  }

  ngOnInit() {
    this.initializeForm(this.initialStock);
    this.metas = of([]);
  }

  fileChangeEvent(event: any): void {
    if (event) {
      this.dialog.open(ImageCropComponent, {
        data: {
          event: event
        }
      }).afterClosed().subscribe(value => {
        if (value) {
          this.croppedImage = value;
        }
      });
    }
  }

  initializeForm(stock?: StockModel) {
    if (stock && stock.image) {
      this.croppedImage = stock.image;
    }
    this.productForm = this.formBuilder.group({
      product: [stock && stock.product ? stock.product : '', [Validators.nullValidator, Validators.required]],
      saleable: [stock && stock.saleable !== undefined ? stock.saleable : true],
      downloadable: [stock && stock.downloadable !== undefined ? stock.downloadable : false],
      downloads: [stock && stock.downloads ? stock.downloads : []],
      stockable: [stock && stock.stockable !== undefined ? stock.stockable : false],
      purchasable: [stock && stock.purchasable !== undefined ? stock.purchasable : false],
      description: [stock && stock.description ? stock.description : ''],
      purchase: [stock && stock.purchase ? stock.purchase : 0, [Validators.nullValidator, Validators.required]],
      retailPrice: [stock && stock.retailPrice ? stock.retailPrice : 0, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [stock && stock.wholesalePrice ? stock.wholesalePrice : 0, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [stock && stock.wholesaleQuantity ? stock.wholesaleQuantity : 0, [Validators.nullValidator, Validators.required]],
      quantity: [stock && stock.quantity ? stock.quantity : 0, [Validators.nullValidator, Validators.required]],
      reorder: [stock && stock.reorder ? stock.reorder : 0, [Validators.nullValidator, Validators.required]],
      unit: [stock && stock.unit ? stock.unit : null, [Validators.nullValidator, Validators.required]],
      canExpire: [stock && stock.canExpire !== undefined ? stock.canExpire : false],
      expire: [stock && stock.expire ? stock.expire : null],
      category: [stock && stock.category ? stock.category : null, [Validators.required, Validators.nullValidator]],
      supplier: [stock && stock.supplier ? stock.supplier : 'general', [Validators.required, Validators.nullValidator]],
    });
  }

  getSaleableFormControl() {
    return this.productForm.get('saleable') as FormControl;
  }

  getPurchasableFormControl() {
    return this.productForm.get('purchasable') as FormControl;
  }

  getStockableFormControl() {
    return this.productForm.get('stockable') as FormControl;
  }

  getDownloadAbleFormControl() {
    return this.productForm.get('downloadable') as FormControl;
  }

  getDownloadsFormControl() {
    return this.productForm.get('downloads') as FormControl;
  }

  getCanExpireFormControl() {
    return this.productForm.get('canExpire') as FormControl;
  }

  addProduct(formElement: FormGroupDirective) {
    this.productForm.markAsTouched();
    if (!this.productForm.valid) {
      this.snack.open('Fill all required fields', 'Ok', {
        duration: 3000
      });
      return;
    }

    if ((this.productForm.value.purchase >= this.productForm.value.retailPrice)
      || (this.productForm.value.purchase >= this.productForm.value.wholesalePrice)) {
      this.snack.open('Purchase price must not be greater than retailPrice/wholesalePrice', 'Ok', {
        duration: 3000
      });
      return;
    }

    if (this.productForm.get('canExpire').value && !this.productForm.get('expire').value) {
      this.snack.open('Please enter expire date', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.mainProgress = true;
    if (this.croppedImage) {
      this.productForm.value.image = this.croppedImage;
    }
    this.stockDatabase.addStock(this.productForm.value, d => {
      // console.log(d);
    }).then(_ => {
      this.mainProgress = false;
      this.snack.open('Product added', 'Ok', {
        duration: 3000
      });
      this.croppedImage = null;
      this.productForm.reset();
      formElement.resetForm();
      this.router.navigateByUrl('/stock').catch(console.log);
    }).catch(reason => {
      // console.warn(reason);
      this.mainProgress = false;
      this.snack.open(reason.message ? reason.message : 'Unknown', 'Ok', {
        duration: 3000
      });
    });
  }

  updateProduct(formElement: FormGroupDirective) {
    if (this.productForm.invalid) {
      this.snack.open('Fill all required fields', 'Ok', {
        duration: 3000
      });
      return;
    }

    if (this.productForm.get('canExpire').value && !this.productForm.get('expire').value) {
      this.snack.open('Please enter expire date', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.mainProgress = true;
    const newStock = this.productForm.value;
    newStock.id = this.initialStock.id;
    newStock.image = this.croppedImage;
    this.stockDatabase.updateStock(newStock, d => {
      console.log(d);
    }).then(_ => {
      this.mainProgress = false;
      this.snack.open('Product updated', 'Ok', {
        duration: 3000
      });
      this.productForm.reset();
      formElement.resetForm();
      this.router.navigateByUrl('/stock').catch(reason => console.log(reason));
    }).catch(reason => {
      console.warn(reason);
      this.mainProgress = false;
      this.snack.open(reason.message ? reason.message : 'Unknown', 'Ok', {
        duration: 3000
      });
    });
  }

  removeImage(imageInput: HTMLInputElement) {
    imageInput.value = '';
    this.croppedImage = null;
  }
}
