import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogUnitNewComponent} from '../units/units.component';
import {DialogCategoryNewComponent} from '../categories/categories.component';
import {DialogSupplierNewComponent} from '../suppliers/suppliers.component';
import {DialogImageCropComponent} from '../../shared/dialog-image-crop/dialog-image-crop.component';
import {StockDatabaseService} from '../../../services/stock-database.service';

@Component({
  selector: 'app-stock-new',
  templateUrl: './stock-new.component.html',
  styleUrls: ['./stock-new.component.css']
})
export class StockNewComponent extends DeviceInfo implements OnInit {

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

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly _dialog: MatDialog,
              private readonly stockDatabase: StockDatabaseService) {
    super();
  }

  ngOnInit() {
    this.initialize();
    this.getCategories();
    this.getUnits();
    this.getSuppliers();
    this.metas = of([]);
  }

  fileChangeEvent(event: any): void {
    if (event) {
      this._dialog.open(DialogImageCropComponent, {
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

  initialize() {
    this.productForm = this.formBuilder.group({
      product: ['', [Validators.nullValidator, Validators.required]],
      description: [''],
      purchase: [0, [Validators.nullValidator, Validators.required]],
      retailPrice: [0, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [0, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [0, [Validators.nullValidator, Validators.required]],
      quantity: [0, [Validators.nullValidator, Validators.required]],
      reorder: [0, [Validators.nullValidator, Validators.required]],
      unit: [null, [Validators.nullValidator, Validators.required]],
      canExpire: [true],
      expire: [null, []],
      active: [true, [Validators.nullValidator, Validators.required]],
      category: [null, [Validators.required, Validators.nullValidator]],
      supplier: [null, [Validators.required, Validators.nullValidator]],
    });
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
    this._dialog.open(DialogUnitNewComponent, {
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
    this._dialog.open(DialogCategoryNewComponent, {
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
    this._dialog.open(DialogSupplierNewComponent, {
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
