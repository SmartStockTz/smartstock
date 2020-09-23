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
import {FileLibraryService} from '../../lib/services/file-library.service';
import {StorageService} from '../../lib/services/storage.service';

@Component({
  selector: 'smartstock-stock-new',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content>

        <smartstock-toolbar [heading]="isUpdateMode?'Update Product':'Create Product'"
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
            <input (change)="fileChangeEvent($event)" #imageInput style="display: none" accept="image/*" type="file">

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
                      <mat-form-field *ngIf="getPurchasableFormControl().value === true" appearance="fill"
                                      class="my-input">
                        <mat-label>Purchase Price / Unit</mat-label>
                        <span matSuffix>TZS</span>
                        <input min="0" matInput type="number" required formControlName="purchase">
                        <mat-error>Purchase price required</mat-error>
                      </mat-form-field>

                      <mat-form-field *ngIf="getSaleableFormControl().value === true" appearance="fill"
                                      class="my-input">
                        <mat-label>Wholesale Price / Unit</mat-label>
                        <span matSuffix>TZS</span>
                        <input min="0" matInput type="number" required formControlName="wholesalePrice">
                        <mat-error>Wholesale price required</mat-error>
                      </mat-form-field>

                      <mat-form-field *ngIf="getSaleableFormControl().value === true" appearance="fill" class="my-input"
                                      matTooltip="Quantity for this product to be sold as a whole or in bulk">
                        <mat-label>Wholesale Quantity</mat-label>
                        <input min="0" matInput
                               type="number"
                               required formControlName="wholesaleQuantity">
                        <mat-error>Wholesale Quantity required</mat-error>
                      </mat-form-field>

                      <mat-form-field *ngIf="getStockableFormControl().value === true" appearance="fill"
                                      class="my-input"
                                      matTooltip="Total initial unit quantity available">
                        <mat-label>Initial Stock Quantity</mat-label>
                        <input min="0" matInput type="number" required
                               formControlName="quantity">
                        <mat-error>Initial Stock Quantity required</mat-error>
                      </mat-form-field>

                      <mat-form-field *ngIf="getStockableFormControl().value === true" appearance="fill"
                                      class="my-input">
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

                      <mat-form-field *ngIf="getCanExpireFormControl().value === true" appearance="outline"
                                      class="my-input">
                        <mat-label>Expire Date</mat-label>
                        <input matInput [matDatepicker]="picker" formControlName="expire">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker [touchUi]="true" #picker></mat-datepicker>
                      </mat-form-field>

                    </mat-card-content>
                  </mat-card>
                </mat-expansion-panel>

              </div>

              <div class="col-12 col-xl-9 col-lg-9" style="margin-bottom: 100px">

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
                <smartstock-upload-file-progress [uploadPercentage]="uploadPercentage"
                                                 [onUploadFlag]="isUploadingFile"
                                                 [name]="uploadTag">
                </smartstock-upload-file-progress>

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
  private thumbnail: File;
  uploadPercentage = 0;
  isUploadingFile = false;
  uploadTag = '';

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly dialog: MatDialog,
              private readonly router: Router,
              private readonly storageService: StorageService,
              private readonly fileLibraryService: FileLibraryService,
              private readonly stockState: StockState) {
    super();
  }

  ngOnInit() {
    this.initializeForm(this.initialStock);
    this.metas = of([]);
  }

  fileChangeEvent(event: Event): void {
    if (event) {
      // @ts-ignore
      this.thumbnail = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        this.croppedImage = ev.target.result;
      };
      // @ts-ignore
      reader.readAsDataURL(event.target.files[0]);
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
      unit: [stock && stock.unit ? stock.unit : 'general', [Validators.nullValidator, Validators.required]],
      canExpire: [stock && stock.canExpire !== undefined ? stock.canExpire : false],
      expire: [stock && stock.expire ? stock.expire : null],
      category: [stock && stock.category ? stock.category : 'general', [Validators.required, Validators.nullValidator]],
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

  addProduct(formElement: FormGroupDirective, inUpdateMode = false) {
    this.productForm.markAsTouched();
    if (!this.productForm.valid) {
      this.snack.open('Fill all required fields', 'Ok', {
        duration: 3000
      });
      return;
    }

    if (this.getPurchasableFormControl().value === true
      && ((this.productForm.value.purchase >= this.productForm.value.retailPrice)
        || (this.productForm.value.purchase >= this.productForm.value.wholesalePrice))) {
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
    this.fileLibraryService.saveFile(this.thumbnail, percentage => {
      this.isUploadingFile = true;
      this.uploadTag = 'Upload product image...';
      this.uploadPercentage = percentage;
    }).then(async imageUrl => {
      if (imageUrl) {
        this.productForm.value.image = imageUrl;
      }
      if (inUpdateMode) {
        this.productForm.value.id = this.initialStock.id;
      }
      return this.stockState.addStock(this.productForm.value, (percentage, name) => {
        this.isUploadingFile = true;
        this.uploadTag = `Upload ${name}...`;
        this.uploadPercentage = percentage;
      }, inUpdateMode);
    }).then(_ => {
      this.storageService.getStocks().then(value => {
        if (inUpdateMode) {
          value.map(value1 => {
            if (value1.id === _.id) {
              return Object.assign(value1, _);
            } else {
              return value1;
            }
          });
        } else {
          value.unshift(_);
        }
        return this.storageService.saveStocks(value);
      }).finally(() => {
        this.mainProgress = false;
        this.snack.open('Product added', 'Ok', {
          duration: 3000
        });
        this.croppedImage = null;
        this.productForm.reset();
        formElement.resetForm();
        this.router.navigateByUrl('/stock/products').catch(console.log);
      });
    }).catch(reason => {
      // console.log(reason);
      this.mainProgress = false;
      this.snack.open(reason.message ? reason.message : 'Unknown', 'Ok', {
        duration: 3000
      });
    }).finally(() => {
      this.isUploadingFile = false;
      this.uploadPercentage = 0;
    });
  }

  updateProduct(formElement: FormGroupDirective) {
    this.addProduct(formElement, true);
  }

  removeImage(imageInput: HTMLInputElement) {
    imageInput.value = '';
    this.croppedImage = null;
  }
}
