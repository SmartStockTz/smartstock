import {Component, Input, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogImageCropComponent} from '../../shared/dialog-image-crop/dialog-image-crop.component';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {StockModel} from '../models/stock.model';
import {StockState} from '../states/stock.state';
import {DialogCategoryNewComponent} from '../components/categories.component';
import {DialogSupplierNewComponent} from '../components/suppliers.component';
import {DialogUnitNewComponent} from '../components/units.component';

@Component({
  selector: 'app-stock-new',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <app-admin-drawer></app-admin-drawer>
      </mat-sidenav>

      <mat-sidenav-content>

        <app-toolbar [heading]="isUpdateMode?'Update StockModel':'Create StockModel'"
                     [sidenav]="sidenav"
                     [hasBackRoute]="isMobile"
                     backLink="/stock/products"
                     [showProgress]="false">
        </app-toolbar>

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

                <h5>
                  Status
                </h5>
                <mat-card class="card-wrapper">
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
                      <p matLine>Can be downloaded</p>
                      <mat-checkbox formControlName="downloadable" matSuffix></mat-checkbox>
                    </mat-list-item>
                    <mat-list-item>
                      <p matLine>Can be purchased</p>
                      <mat-checkbox formControlName="purchasable" matSuffix></mat-checkbox>
                    </mat-list-item>
                  </mat-list>
                </mat-card>

                <h5 *ngIf="getDownloadAbleFormControl().value === true">
                  Files
                </h5>
                <div *ngIf="getDownloadAbleFormControl().value === true" class="card-wrapper">
                  <app-upload-files [files]="isUpdateMode?initialStock.downloads:[]"
                                    [uploadFileFormControl]="getDownloadsFormControl()"></app-upload-files>
                </div>

                <h5>
                  Product
                </h5>
                <mat-card class="card-wrapper">
                  <mat-card-content class="card-content">
                    <mat-form-field appearance="fill" class="my-input">
                      <mat-label>Product Name</mat-label>
                      <input matInput type="text" required formControlName="product">
                      <mat-error>Product name required</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="my-input">
                      <mat-label>Description</mat-label>
                      <textarea matInput type="text" formControlName="description"></textarea>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="my-input">
                      <mat-label>Category</mat-label>
                      <mat-select [multiple]="false" formControlName="category">
                        <mat-option *ngFor="let category of categories | async" [value]="category.name">
                          {{category.name}}
                        </mat-option>
                      </mat-select>
                      <mat-progress-spinner matTooltip="Fetching units"
                                            *ngIf="categoriesFetching" matSuffix color="accent"
                                            mode="indeterminate"
                                            [diameter]="20"></mat-progress-spinner>
                      <mat-error>Category required</mat-error>
                      <div matSuffix class="d-flex flex-row">
                        <button (click)="refreshCategories($event)" mat-icon-button matTooltip="refresh categories"
                                *ngIf="!categoriesFetching">
                          <mat-icon>refresh</mat-icon>
                        </button>
                        <button (click)="addNewCategory($event)" mat-icon-button matTooltip="add new category"
                                *ngIf="!categoriesFetching">
                          <mat-icon>add</mat-icon>
                        </button>
                      </div>
                    </mat-form-field>

                    <mat-form-field *ngIf="getPurchasableFormControl().value === true" appearance="outline"
                                    class="my-input">
                      <mat-label>Supplier</mat-label>
                      <mat-select [multiple]="false" formControlName="supplier">
                        <mat-option *ngFor="let supplier of suppliers | async" [value]="supplier.name">
                          {{supplier.name}}
                        </mat-option>
                      </mat-select>
                      <mat-progress-spinner matTooltip="Fetching suppliers"
                                            *ngIf="suppliersFetching" matSuffix color="accent"
                                            mode="indeterminate"
                                            [diameter]="20"></mat-progress-spinner>
                      <mat-error>Supplier required</mat-error>
                      <div matSuffix class="d-flex flex-row">
                        <button (click)="refreshSuppliers($event)" mat-icon-button matTooltip="refresh suppliers"
                                *ngIf="!suppliersFetching">
                          <mat-icon>refresh</mat-icon>
                        </button>
                        <button (click)="addNewSupplier($event)" mat-icon-button matTooltip="add new supplier"
                                *ngIf="!suppliersFetching">
                          <mat-icon>add</mat-icon>
                        </button>
                      </div>
                    </mat-form-field>

                  </mat-card-content>
                </mat-card>

                <h5>
                  Inventory
                </h5>
                <mat-card class="card-wrapper">
                  <mat-card-content class="card-content">
                    <mat-form-field *ngIf="getPurchasableFormControl().value === true" appearance="fill" class="my-input">
                      <mat-label>Purchase Price / Unit</mat-label>
                      <span matSuffix>TZS</span>
                      <input min="0" matInput type="number" required formControlName="purchase">
                      <mat-error>Purchase price required</mat-error>
                    </mat-form-field>

                    <mat-form-field *ngIf="getSaleableFormControl().value === true" appearance="fill" class="my-input">
                      <mat-label>Retail Price / Unit</mat-label>
                      <span matSuffix>TZS</span>
                      <input min="0" matInput type="number" required formControlName="retailPrice">
                      <mat-error>Retail price required</mat-error>
                    </mat-form-field>

                    <mat-form-field *ngIf="getSaleableFormControl().value === true" appearance="fill" class="my-input">
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

                    <mat-form-field *ngIf="getStockableFormControl().value === true" appearance="fill" class="my-input"
                                    matTooltip="Total initial unit quantity available">
                      <mat-label>Quantity</mat-label>
                      <input min="0" matInput type="number" required
                             formControlName="quantity">
                      <mat-error>Quantity required</mat-error>
                    </mat-form-field>

                    <mat-form-field *ngIf="getStockableFormControl().value === true" appearance="fill" class="my-input">
                      <mat-label>Reorder Level</mat-label>
                      <input min="0" matInput type="number" required formControlName="reorder">
                      <mat-error>Reorder field required</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="my-input">
                      <mat-label>Unit</mat-label>
                      <mat-select formControlName="unit">
                        <mat-option *ngFor="let unit of units | async" [value]="unit.name">
                          {{unit.name}}
                        </mat-option>
                      </mat-select>
                      <mat-progress-spinner matTooltip="Fetching units"
                                            *ngIf="unitsFetching" matSuffix color="accent"
                                            mode="indeterminate"
                                            [diameter]="20"></mat-progress-spinner>
                      <mat-error>Unit required</mat-error>
                      <div matSuffix class="d-flex flex-row">
                        <button (click)="refreshUnits($event)" mat-icon-button matTooltip="refresh units"
                                *ngIf="!unitsFetching">
                          <mat-icon>refresh</mat-icon>
                        </button>
                        <button (click)="addNewUnit($event)" mat-icon-button matTooltip="add new unit"
                                *ngIf="!unitsFetching">
                          <mat-icon>add</mat-icon>
                        </button>
                      </div>
                    </mat-form-field>

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
export class CreatePageComponent extends DeviceInfo implements OnInit {

  @Input() isUpdateMode = false;
  @Input() initialStock: StockModel;

  croppedImage: any = '';
  productForm: FormGroup;
  units: Observable<[any]>;
  categories: Observable<any[]>;
  suppliers: Observable<any[]>;
  metas: Observable<{
    type: string;
    label: string;
    controlName: string;
  }[]>;
  mainProgress = false;
  unitsFetching = true;
  categoriesFetching = true;
  suppliersFetching = true;
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
    this.getCategories();
    this.getUnits();
    this.getSuppliers();
    this.metas = of([]);
  }

  fileChangeEvent(event: any): void {
    if (event) {
      this.dialog.open(DialogImageCropComponent, {
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
      stockable: [stock && stock.stockable !== undefined ? stock.stockable : true],
      purchasable: [stock && stock.purchasable !== undefined ? stock.purchasable : true],
      description: [stock && stock.description ? stock.description : ''],
      purchase: [stock && stock.purchase ? stock.purchase : 0, [Validators.nullValidator, Validators.required]],
      retailPrice: [stock && stock.retailPrice ? stock.retailPrice : 0, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [stock && stock.wholesalePrice ? stock.wholesalePrice : 0, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [stock && stock.wholesaleQuantity ? stock.wholesaleQuantity : 0, [Validators.nullValidator, Validators.required]],
      quantity: [stock && stock.quantity ? stock.quantity : 0, [Validators.nullValidator, Validators.required]],
      reorder: [stock && stock.reorder ? stock.reorder : 0, [Validators.nullValidator, Validators.required]],
      unit: [stock && stock.unit ? stock.unit : null, [Validators.nullValidator, Validators.required]],
      canExpire: [stock && stock.canExpire !== undefined ? stock.canExpire : true],
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

  getSuppliers() {
    this.suppliersFetching = true;
    this.stockDatabase.getAllSupplier({}).then(value => {
      this.suppliersFetching = false;
      this.suppliers = of(JSON.parse(JSON.stringify(value)));
    }).catch(_ => {
      console.log(_);
      this.suppliersFetching = false;
      this.suppliers = of([{name: 'Default'}]);
    });
  }

  getCategories() {
    this.categoriesFetching = true;
    this.stockDatabase.getAllCategory({size: 10000}).then(categoryObject => {
      const cat = JSON.parse(JSON.stringify(categoryObject));
      this.categories = of(cat);
      this.categoriesFetching = false;
    }).catch(reason => {
      this.categories = of([{name: 'No category'}]);
      console.warn(reason);
      this.categoriesFetching = false;
    });
  }

  getUnits() {
    this.unitsFetching = true;
    this.stockDatabase.getAllUnit({}).then(unitsObjects => {
      this.units = of(JSON.parse(JSON.stringify(unitsObjects)));
      this.unitsFetching = false;
    }).catch(reason => {
      this.units = of([{name: 'No unit'}]);
      console.warn(reason);
      this.unitsFetching = false;
    });
  }

  addProduct(formElement: FormGroupDirective) {
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
    this.stockDatabase.addStock(this.productForm.value).then(_ => {
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
    newStock.objectId = this.initialStock.objectId;
    newStock.image = this.croppedImage;
    this.stockDatabase.updateStock(newStock).then(_ => {
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

  addNewUnit($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(DialogUnitNewComponent, {
      closeOnNavigation: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getUnits();
      }
    });
  }

  refreshUnits($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.getUnits();
  }

  addNewCategory($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(DialogCategoryNewComponent, {
      closeOnNavigation: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getCategories();
      }
    });
  }

  refreshCategories($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.getCategories();
  }

  addNewSupplier($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(DialogSupplierNewComponent, {
      closeOnNavigation: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getSuppliers();
      }
    });
  }

  refreshSuppliers($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.getSuppliers();
  }

  removeImage(imageInput: HTMLInputElement) {
    imageInput.value = '';
    this.croppedImage = null;
  }
}
