import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
/** must be removed to common module **/
/** must be removed to common module **/
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Router} from '@angular/router';
import {StorageService} from '@smartstock/core-libs';
/** must be removed to common module **/
import {DialogSupplierNewComponent} from '../../stocks/components/suppliers.component';
/** must be removed to common module **/
import {StockModel} from '../models/stock.model';
import {PurchaseState} from '../states/purchase.state';
import {DeviceInfoUtil} from '@smartstock/core-libs';

@Component({
  selector: 'smartstock-purchase-create',
  template: `
      <mat-sidenav-container class="match-parent">

          <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side':'over'" [opened]="enoughWidth()">
              <smartstock-drawer></smartstock-drawer>
          </mat-sidenav>

          <mat-sidenav-content>
              <smartstock-toolbar [heading]="'Add Purchase'"
                                  [showSearch]="false"
                                  [sidenav]="sidenav"
                                  [showProgress]="false"
                                  [hasBackRoute]="true"
                                  [backLink]="'/purchase'">
              </smartstock-toolbar>

              <div style="margin-top: 16px" class="container">
                  <form [formGroup]="invoiceForm" (ngSubmit)="saveInvoice()">
                      <div class="row d-flex justify-content-center align-items-center">

                          <div class="col-12 col-xl-9 col-lg-9">
                              <h4>
                                  Information
                              </h4>
                              <mat-card class="mat-elevation-z0">
                                  <mat-card-content class="card-content">

                                      <mat-slide-toggle style="margin-bottom: 8px; margin-top: 8px"
                                                        color="primary" labelPosition="after"
                                                        [formControl]="isInvoiceFormControl"
                                                        label="Invoice purchase">
                                          Invoice purchase
                                      </mat-slide-toggle>
                                      <mat-form-field appearance="fill" class="my-input">
                                          <mat-label>ref #</mat-label>
                                          <input matInput formControlName="refNumber">
                                          <mat-error>Purchase reference number required</mat-error>
                                      </mat-form-field>

                                      <mat-form-field appearance="fill" class="my-input">
                                          <mat-label>Supplier</mat-label>
                                          <mat-select formControlName="supplier">
                                              <mat-option *ngFor="let supplier of suppliers | async" [value]="supplier">
                                                  {{supplier.name}}
                                              </mat-option>
                                          </mat-select>
                                          <mat-progress-spinner matTooltip="Fetching suppliers"
                                                                *ngIf="supplierFetching" matSuffix color="accent"
                                                                mode="indeterminate"
                                                                [diameter]="20"></mat-progress-spinner>
                                          <mat-error>Supplier required</mat-error>
                                          <div matSuffix class="d-flex flex-row">
                                              <button (click)="refreshSuppliers($event)" mat-icon-button matTooltip="refresh suppliers"
                                                      *ngIf="!supplierFetching">
                                                  <mat-icon>refresh</mat-icon>
                                              </button>
                                              <button (click)="addNewSupplier($event)" mat-icon-button matTooltip="add new supplier"
                                                      *ngIf="!supplierFetching">
                                                  <mat-icon>add</mat-icon>
                                              </button>
                                          </div>
                                      </mat-form-field>

                                      <mat-form-field appearance="fill" class="my-input">
                                          <mat-label>Purchase Date</mat-label>
                                          <input matInput [matDatepicker]="picker" formControlName="date" required>
                                          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                                          <mat-datepicker [touchUi]="true" #picker></mat-datepicker>
                                      </mat-form-field>

                                      <mat-form-field *ngIf="isInvoiceFormControl.value" appearance="fill" class="my-input">
                                          <mat-label>Due Date</mat-label>
                                          <input matInput [matDatepicker]="pickerDue" formControlName="due">
                                          <mat-datepicker-toggle matSuffix [for]="pickerDue"></mat-datepicker-toggle>
                                          <mat-datepicker [touchUi]="true" #pickerDue></mat-datepicker>
                                      </mat-form-field>

                                  </mat-card-content>

                              </mat-card>

                              <h4>
                                  Items
                              </h4>

                              <mat-card class="mat-elevation-z0">
                                  <mat-card-content class="card-content">

                                      <div formArrayName="items" (click)="$event.preventDefault()">
                                          <div *ngFor="let item of invoiceItems.controls; let i=index">
                                              <div [formGroupName]="i"
                                                   class="d-flex flex-column align-items-start justify-content-start">
                                                  <div class="flex-grow-0">

                                                      <div formGroupName="product">
                                                          <mat-form-field class="my-input" appearance="fill">
                                                              <mat-label>Product</mat-label>
                                                              <input matInput formControlName="product" type="text" [readonly]="true"
                                                                     required>
                                                              <mat-error>Product is required</mat-error>
                                                          </mat-form-field>
                                                      </div>

                                                      <mat-form-field appearance="fill" class="my-input">
                                                          <mat-label>Expire Date</mat-label>
                                                          <input matInput [matDatepicker]="picker" formControlName="expire">
                                                          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                                                          <mat-datepicker [touchUi]="true" #picker></mat-datepicker>
                                                      </mat-form-field>

                                                      <mat-form-field class="my-input" appearance="fill">
                                                          <mat-label>Purchase Price</mat-label>
                                                          <input type="number" (keyup)="checkKey($event)" (keydown)="checkKey($event)"
                                                                 (change)="updateAmount(item)" min="0"
                                                                 formControlName="purchase" matInput
                                                                 required>
                                                          <mat-error>Purchase price required</mat-error>
                                                      </mat-form-field>

                                                      <mat-form-field class="my-input" appearance="fill">
                                                          <mat-label>Retail Price</mat-label>
                                                          <input type="number" min="0"
                                                                 formControlName="retailPrice" matInput
                                                                 required>
                                                          <mat-error>Retail price required</mat-error>
                                                      </mat-form-field>

                                                      <mat-form-field class="my-input" appearance="fill">
                                                          <mat-label>Wholesale Price</mat-label>
                                                          <input type="number" min="0"
                                                                 formControlName="wholesalePrice" matInput
                                                                 required>
                                                          <mat-error>Wholesale price required</mat-error>
                                                      </mat-form-field>

                                                      <mat-form-field class="my-input" appearance="fill">
                                                          <mat-label>Wholesale Quantity</mat-label>
                                                          <input type="number" min="0"
                                                                 formControlName="wholesaleQuantity" matInput
                                                                 required>
                                                          <mat-error>Wholesale quantity required</mat-error>
                                                      </mat-form-field>

                                                      <mat-form-field class="my-input" appearance="fill">
                                                          <mat-label>Quantity</mat-label>
                                                          <input type="number" (keyup)="checkKey($event)" (keydown)="checkKey($event)"
                                                                 (change)="updateAmount(item)" min="0"
                                                                 formControlName="quantity" matInput
                                                                 required>
                                                          <mat-error>Quantity required</mat-error>
                                                      </mat-form-field>

                                                      <mat-form-field class="my-input" appearance="fill">
                                                          <mat-label>Amount</mat-label>
                                                          <input type="number" min="0" formControlName="amount" matInput [readonly]="true"
                                                                 required>
                                                          <mat-error>Amount required</mat-error>
                                                      </mat-form-field>

                                                  </div>

                                                  <div class="flex-grow-0">
                                                      <button matTooltip="Remove this item"
                                                              (click)="removeItem(i, $event)"
                                                              mat-flat-button
                                                              class="ft-button"
                                                              color="warn">
                                                          Remove Item
                                                      </button>
                                                  </div>
                                              </div>
                                              <hr>
                                          </div>
                                      </div>

                                      <mat-form-field appearance="outline" class="my-input">
                                          <mat-label>Search Product</mat-label>
                                          <input matInput type="text"
                                                 [matAutocomplete]="autocomplete" [formControl]="searchProductFormControl">
                                          <!--                  <mat-error>Field required</mat-error>-->
                                          <mat-progress-spinner matSuffix mode="indeterminate" [diameter]="20"
                                                                *ngIf="searchProductProgress"
                                                                color="accent">
                                          </mat-progress-spinner>
                                      </mat-form-field>

                                      <mat-autocomplete #autocomplete>
                                          <mat-option (onSelectionChange)="selectedProduct = product"
                                                      *ngFor="let product of products | async"
                                                      [value]="product.product">
                                              {{product.product}}
                                          </mat-option>
                                      </mat-autocomplete>

                                      <button matTooltip="Add new item"
                                              (click)="addItem($event)"
                                              class="ft-button"
                                              mat-flat-button color="primary">
                                          Add Item
                                      </button>

                                  </mat-card-content>
                              </mat-card>
                          </div>

                          <div class="col-12 col-xl-9 col-lg-9">
                              <h4>
                                  Status
                              </h4>
                              <mat-card class="mat-elevation-z0">
                                  <mat-card-content class="card-content">
                                      <mat-form-field class="my-input" appearance="outline">
                                          <mat-label>Total Amount</mat-label>
                                          <input matInput type="number" formControlName="amount"
                                                 [readonly]="true" required>
                                          <mat-error>Amount required</mat-error>
                                      </mat-form-field>
                                  </mat-card-content>
                              </mat-card>

                              <button [disabled]="saveInvoiceProgress"
                                      class="btn-block ft-button" mat-flat-button
                                      color="primary">
                                  Save And Record
                                  <mat-progress-spinner style="display: inline-block"
                                                        *ngIf="saveInvoiceProgress" mode="indeterminate"
                                                        [diameter]="15"
                                                        color="accent">
                                  </mat-progress-spinner>
                              </button>
                              <div style="margin-bottom: 48px"></div>
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
  invoiceForm: FormGroup;
  supplierFetching = true;
  suppliers: Observable<any[]>;
  searchProductFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);
  products: Observable<any[]>;
  selectedProduct: StockModel;
  saveInvoiceProgress = false;
  searchProductProgress = false;
  isInvoiceFormControl = new FormControl(false, [Validators.required, Validators.nullValidator]);

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly router: Router,
              private readonly _dialog: MatDialog,
              private readonly indexDb: StorageService,
              private readonly purchaseState: PurchaseState) {
    super();
  }

  ngOnInit() {
    this.invoiceForm = this.formBuilder.group({
      refNumber: ['', [Validators.nullValidator, Validators.required]],
      supplier: [null, [Validators.nullValidator, Validators.required]],
      date: ['', [Validators.nullValidator, Validators.required]],
      due: [''],
      paid: [false],
      draft: [true],
      amount: [0, [Validators.nullValidator, Validators.required]],
      items: this.formBuilder.array([]),
    });
    this.getSuppliers();
    this.searchProductFormControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.searchProduct(value);
      }
    });
  }

  get invoiceItems() {
    return this.invoiceForm.get('items') as FormArray;
  }

  searchProduct(productName: string) {
    if (!this.selectedProduct || (this.selectedProduct && this.selectedProduct.product !== productName)) {
      this.searchProductProgress = true;
      this.indexDb.getStocks().then(stocks => {
        const dataArray =
          stocks.filter(value => value.product.toLowerCase().indexOf(productName.toLowerCase()) !== -1);
        // const dataArray = JSON.parse(JSON.stringify(stocks));
        this.products = of(dataArray);
        this.searchProductProgress = false;
      }).catch(reason => {
        // console.log(reason);
        // this.snack.open('Failed to get stocks', 'Ok', {duration: 3000});
        this.snack.open(reason && reason.message ? reason.message : reason.toString());
        this.products = of([]);
        this.searchProductProgress = false;
      });
    }
  }

  saveInvoice() {
    if (!this.invoiceForm.valid) {
      this.snack.open('Please fill all required information', 'Ok', {
        duration: 3000
      });
      return;
    }
    const due = this.invoiceForm.get('due').value;
    if (this.isInvoiceFormControl.value && !due) {
      this.snack.open('Due date required if you choose invoice', 'Ok', {
        duration: 3000
      });
      return;
    }
    if (this.isInvoiceFormControl.value) {
      this.invoiceForm.value.type = 'invoice';
      this.invoiceForm.value.paid = false;
    } else {
      this.invoiceForm.value.type = 'receipt';
      this.invoiceForm.value.paid = true;
    }
    const items = this.invoiceForm.get('items') as FormArray;
    if (items.controls.length === 0) {
      this.snack.open('Must add at least one item', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.saveInvoiceProgress = true;
    this.purchaseState.addPurchase(this.invoiceForm.value).then(_ => {
      this.snack.open('Purchase recorded', 'Ok', {
        duration: 3000
      });
      this.saveInvoiceProgress = false;
      this.router.navigateByUrl('/purchase').catch(reason => console.log(reason));
    }).catch(reason => {
      this.saveInvoiceProgress = false;
      // console.log(reason);
      this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
        duration: 3000
      });
    });
  }

  addNewSupplier($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this._dialog.open(DialogSupplierNewComponent, {
      // minWidth: '80%',
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

  getSuppliers() {
    this.supplierFetching = true;
    this.purchaseState.getAllSupplier({size: 200}).then(data => {
      const dataArray = JSON.parse(JSON.stringify(data));
      this.suppliers = of(dataArray);
      this.supplierFetching = false;
    }).catch(reason => {
      // console.log(reason);
      this.suppliers = of([{name: 'Default Supplier'}]);
      this.supplierFetching = false;
    });
  }

  getTotalAmountOfInvoice() {
    // reduce((a, b) => a + b, 0)
    const itemsValues: any[] = this.invoiceItems.value;
    const sum = itemsValues.reduce((a, b) => a + b.amount, 0);
    // console.log(sum);
    this.invoiceForm.get('amount').setValue(sum);
  }

  addItem($event) {
    $event.preventDefault();
    if (!this.searchProductFormControl.valid) {
      this.snack.open('No item to add, search and select a product', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.invoiceItems.push(this.formBuilder.group({
      product: this.formBuilder.group(this.selectedProduct, [Validators.nullValidator, Validators.required]),
      expire: [this.selectedProduct.expire],
      purchase: [this.selectedProduct.purchase, [Validators.nullValidator, Validators.required]],
      retailPrice: [this.selectedProduct.retailPrice, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [this.selectedProduct.wholesalePrice, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [this.selectedProduct.wholesaleQuantity, [Validators.nullValidator, Validators.required]],
      quantity: [1, [Validators.nullValidator, Validators.required]],
      amount: [this.selectedProduct.purchase, [Validators.nullValidator, Validators.required]]
    }));
    this.searchProductFormControl.reset();
    this.selectedProduct = null;
    this.getTotalAmountOfInvoice();
  }

  updateAmount(formGroup: AbstractControl) {
    formGroup = formGroup as FormGroup;
    formGroup.get('amount').setValue(formGroup.value.quantity * formGroup.value.purchase);
    this.getTotalAmountOfInvoice();
  }

  removeItem(index, $event) {
    $event.preventDefault();
    this.invoiceItems.removeAt(index);
    this.getTotalAmountOfInvoice();
  }

  checkKey($event: KeyboardEvent) {
    if ($event.code === 'Enter') {
      $event.preventDefault();
    }
  }
}

