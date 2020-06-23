import {Component, Input, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogUnitNewComponent} from '../units/units.component';
import {DialogCategoryNewComponent} from '../categories/categories.component';
import {DialogSupplierNewComponent} from '../suppliers/suppliers.component';
import {DialogImageCropComponent} from '../../shared/dialog-image-crop/dialog-image-crop.component';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {Stock} from '../../../model/stock';

@Component({
  selector: 'app-stock-new',
  templateUrl: './stock-new.component.html',
  styleUrls: ['./stock-new.component.css']
})
export class StockNewComponent extends DeviceInfo implements OnInit {

  @Input() isUpdateMode = false;
  @Input() initialStock: Stock;

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
              private readonly stockDatabase: StockDatabaseService) {
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

  initializeForm(stock?: Stock) {
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
