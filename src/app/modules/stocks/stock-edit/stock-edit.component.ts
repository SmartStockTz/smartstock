import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {DialogImageCropComponent} from '../../shared/dialog-image-crop/dialog-image-crop.component';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {Stock} from '../../../model/stock';

@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrls: ['./stock-edit.component.css']
})
export class StockEditComponent extends DeviceInfo implements OnInit {

  updateForm: FormGroup;
  units: Observable<[any]>;
  categories: Observable<any[]>;
  suppliers: Observable<any[]>;
  mainProgress = false;
  unitsFetching = true;
  categoriesFetching = true;
  suppliersFetching = true;
  stock: Stock;
  croppedImage: any;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly router: Router,
              private readonly _dialog: MatDialog,
              private readonly stockDatabase: StockDatabaseService) {
    super();
  }

  ngOnInit() {
    this.getStock();
  }

  getStock() {
    this.activatedRoute.queryParams.subscribe(value => {
      if (value && value.stock) {
        this.stock = JSON.parse(value.stock);
        // console.log(this.stock);
        this.initialize(this.stock);
        this.getCategories();
        this.getUnits();
        this.getSuppliers();
      } else {
        this.snack.open('Fails to get stock for update', 'Ok', {
          duration: 3000
        });
      }
    });
  }

  initialize(stock: Stock) {
    if (stock.image) {
      this.croppedImage = stock.image;
    }
    this.updateForm = this.formBuilder.group({
      product: [stock.product, [Validators.nullValidator, Validators.required]],
      description: [stock.description],
      purchase: [stock.purchase, [Validators.nullValidator, Validators.required]],
      retailPrice: [stock.retailPrice, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [stock.wholesalePrice, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [stock.wholesaleQuantity, [Validators.nullValidator, Validators.required]],
      quantity: [stock.quantity, [Validators.nullValidator, Validators.required]],
      reorder: [stock.reorder, [Validators.nullValidator, Validators.required]],
      unit: [stock.unit, [Validators.nullValidator, Validators.required]],
      canExpire: [stock.canExpire ? stock.canExpire : true],
      expire: [stock.expire, []],
      active: [stock.active ? stock.active : true, [Validators.nullValidator, Validators.required]],
      category: [stock.category, [Validators.required, Validators.nullValidator]],
      supplier: [stock.supplier, [Validators.required, Validators.nullValidator]],
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

  updateProduct() {
    if (!this.updateForm.valid) {
      this.snack.open('Fill all required fields', 'Ok', {
        duration: 3000
      });
      return;
    }

    if (this.updateForm.get('canExpire').value && !this.updateForm.get('expire').value) {
      this.snack.open('Please enter expire date', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.mainProgress = true;
    const newStock = this.updateForm.value;
    newStock.objectId = this.stock.objectId;
    newStock.image = this.croppedImage;
    this.stockDatabase.updateStock(newStock).then(_ => {
      this.mainProgress = false;
      this.snack.open('Product updated', 'Ok', {
        duration: 3000
      });
      this.updateForm.reset();
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
    this.croppedImage = null;
    imageInput.value = '';
  }

  fileChangeEvent(event: Event) {
    if (event) {
      this._dialog.open(DialogImageCropComponent, {
        data: {
          event: event
        }
      }).afterClosed().subscribe(value => {
        if (value) {
          this.croppedImage = value;
          // console.log(this.croppedImage);
        }
      });
    }
  }
}
