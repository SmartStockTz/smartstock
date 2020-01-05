import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../common-components/DeviceInfo';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {StockDatabaseService} from '../../services/stock-database.service';

@Component({
  selector: 'app-stock-new',
  templateUrl: './stock-new.component.html',
  styleUrls: ['./stock-new.component.css']
})
export class StockNewComponent extends DeviceInfo implements OnInit {

  productForm: FormGroup;
  units: Observable<[any]>;
  categories: Observable<any[]>;
  suppliers: Observable<any[]>;
  metas: Observable<{
    type: string;
    label: string;
    controlName: string;
  }[]>;
  metasArray = [];
  addMetaTypeFormControl = new FormControl('text', [Validators.nullValidator, Validators.required]);
  addMetaNameFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);
  mainProgress = false;
  unitsFetching = true;
  categoriesFetching = true;
  suppliersFetching = true;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              // private readonly categoryService: CategoryService,
              // private readonly supplierService: SupplierService,
              // private readonly unitsService: UnitsService,
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
      canExpire: [false],
      expire: [null, []],
      active: [true, [Validators.nullValidator, Validators.required]],
      category: [null, [Validators.required, Validators.nullValidator]],
      supplier: [null, [Validators.required, Validators.nullValidator]],
      images: [[]],
    });
  }

  getSuppliers() {
    // this.suppliersFetching = true;
    // this.supplierService.getSuppliers({size: 200}).then(value => {
    //   this.suppliersFetching = false;
    //   this.suppliers = of(JSON.parse(JSON.stringify(value)));
    // }).catch(_ => {
    //   this.suppliersFetching = false;
    //   this.units = of(['Default']);
    // });
  }

  addAttributeToMeta($event) {
    $event.preventDefault();
    this.productForm.addControl(this.addMetaNameFormControl.value,
      this.formBuilder.control(null, [Validators.nullValidator, Validators.required]));
    this.metasArray.push({
      label: this.addMetaNameFormControl.value,
      type: this.addMetaTypeFormControl.value,
      controlName: this.addMetaNameFormControl.value
    });
    this.metas = of(this.metasArray);
    this.addMetaNameFormControl.reset();
    this.addMetaTypeFormControl.reset();
  }

  removeAttributeToMeta($event, index, controlName) {
    $event.preventDefault();
    this.metasArray = this.metasArray.filter(value => value.controlName !== controlName);
    this.metas = of(this.metasArray);
    this.productForm.removeControl(controlName);
  }

  getCategories() {
    // this.categoriesFetching = true;
    // this.categoryService.getCategories().then(categoryObject => {
    //   const cat = JSON.parse(JSON.stringify(categoryObject));
    //   this.categories = of(cat);
    //   this.categoriesFetching = false;
    // }).catch(reason => {
    //   this.categories = of([{name: 'No category'}]);
    //   console.warn(reason);
    //   this.categoriesFetching = false;
    // });
  }

  getUnits() {
    // this.unitsFetching = true;
    // this.unitsService.getUnits().then(unitsObjects => {
    //   this.units = of(JSON.parse(JSON.stringify(unitsObjects)));
    //   this.unitsFetching = false;
    // }).catch(reason => {
    //   this.units = of([{name: 'No unit'}]);
    //   console.warn(reason);
    //   this.unitsFetching = false;
    // });
  }

  addProduct() {
    this.mainProgress = true;
    // this.stockDatabase.addStock(this.productForm.value).then(_ => {
    //   this.mainProgress = false;
    //   this.snack.open('Product added', 'Ok', {
    //     // verticalPosition: 'top',
    //     // horizontalPosition: 'center',
    //     duration: 3000
    //   });
    //   this.productForm.reset();
    //   window.dispatchEvent(new Event('clearImagePreview'));
    //   this.productForm.clearValidators();
    // }).catch(reason => {
    //   console.warn(reason);
    //   this.mainProgress = false;
    //   this.snack.open(reason.message ? reason.message : 'Unknown', 'Ok', {
    //     // verticalPosition: 'top',
    //     // horizontalPosition: 'center',
    //     duration: 3000
    //   });
    // });
  }

  handleImages($event: { images: any[] }) {
    this.productForm.get('images').setValue($event.images);
  }

}
