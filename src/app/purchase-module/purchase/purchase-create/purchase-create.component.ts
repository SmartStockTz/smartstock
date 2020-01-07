import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {DeviceInfo} from '../../../common-components/DeviceInfo';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {NgForage} from 'ngforage';
import {Stock} from '../../../model/stock';
import {Router} from '@angular/router';

@Component({
  selector: 'app-purchase-create',
  templateUrl: './purchase-create.component.html',
  styleUrls: ['./purchase-create.component.css']
})
export class PurchaseCreateComponent extends DeviceInfo implements OnInit {
  invoiceForm: FormGroup;
  supplierFetching = true;
  suppliers: Observable<any[]>;
  searchProductFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);
  products: Observable<any[]>;
  selectedProduct: Stock;
  saveInvoiceProgress = false;
  searchProductProgress = false;
  isInvoiceFormControl = new FormControl(false, [Validators.required, Validators.nullValidator]);

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly router: Router,
              private readonly indexDb: NgForage,
              private readonly stockDatabase: StockDatabaseService) {
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
      this.indexDb.getItem<Stock[]>('stocks').then(stocks => {
        const dataArray =
          stocks.filter(value => value.product.toLowerCase().indexOf(productName.toLowerCase()) !== -1);
        // const dataArray = JSON.parse(JSON.stringify(stocks));
        this.products = of(dataArray);
        this.searchProductProgress = false;
      }).catch(reason => {
        console.log(reason);
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
    this.stockDatabase.addPurchase(this.invoiceForm.value).then(_ => {
      this.snack.open('Purchase recorded', 'Ok', {
        duration: 3000
      });
      this.saveInvoiceProgress = false;
      this.router.navigateByUrl('/purchase').catch(reason => console.log(reason));
    }).catch(reason => {
      this.saveInvoiceProgress = false;
      console.log(reason);
      this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
        duration: 3000
      });
    });
  }

  getSuppliers() {
    this.supplierFetching = true;
    this.stockDatabase.getAllSupplier({size: 200}).then(data => {
      const dataArray = JSON.parse(JSON.stringify(data));
      this.suppliers = of(dataArray);
      this.supplierFetching = false;
    }).catch(reason => {
      console.log(reason);
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

