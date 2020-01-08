import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger, MatSnackBar, MatTableDataSource} from '@angular/material';
import {SupplierI} from '../../model/SupplierI';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StockDatabaseService} from '../../services/stock-database.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  suppliersDatasource: MatTableDataSource<SupplierI>;
  suppliersTableColums = ['name', 'email', 'mobile', 'address', 'actions'];
  suppliersArray: SupplierI[];
  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();
  addressFormControl = new FormControl();
  emailFormControl = new FormControl();
  mobileFormControl = new FormControl();

  constructor(private readonly stockDatabase: StockDatabaseService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.getCategories();
  }

  searchSupplier(query: string) {
    // if ($event && $event.query) {
    //   this.fetchCategoriesFlag = true;
    //   this.stockDatabase.searchSupplier($event.query, {size: 20}).then(data => {
    //     this.suppliersArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.suppliersDatasource = new MatTableDataSource(this.suppliersArray);
    //     this.fetchCategoriesFlag = false;
    //     // this.size = 0;
    //   }).catch(reason => {
    //     this.snack.open(reason, 'Ok', {
    //       duration: 3000
    //     });
    //     this.fetchCategoriesFlag = false;
    //   });
    // } else {
    //   this.getCategories();
    // }
  }

  getCategories() {
    this.fetchCategoriesFlag = true;
    this.stockDatabase.getAllSupplier({size: 100}).then(data => {
      this.suppliersArray = JSON.parse(JSON.stringify(data));
      this.suppliersDatasource = new MatTableDataSource<SupplierI>(this.suppliersArray);
      this.fetchCategoriesFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.fetchCategoriesFlag = false;
    });
  }

  deleteSupplier(element: any) {
    this.dialog.open(DialogSupplierDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.suppliersArray = this.suppliersArray.filter(value => value.objectId !== element.objectId);
        this.suppliersDatasource = new MatTableDataSource<SupplierI>(this.suppliersArray);
        this.snack.open('Supplier deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('Supplier not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateSupplierName(supplier, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (supplier && supplier.value) {
      supplier.field = 'name';
      this.updateSupplier(supplier);
    }
  }

  updateSupplier(supplier: { objectId: string, value: string, field: string }) {
    // this.snack.open('Update in progress..', 'Ok');
    // this.stockDatabase.updateSupplier(supplier).then(data => {
    //   const editedObjectIndex = this.suppliersArray.findIndex(value => value.objectId === data.objectId);
    //   this.suppliersArray = this.suppliersArray.filter(value => value.objectId !== supplier.objectId);
    //   if (editedObjectIndex !== -1) {
    //     const updatedObject = this.suppliersArray[editedObjectIndex];
    //     updatedObject[supplier.field] = supplier.value;
    //     this.suppliersDatasource.data[editedObjectIndex] = updatedObject;
    //   } else {
    //     console.warn('fails to update supplier table');
    //   }
    //   this.snack.open('Supplier updated', 'Ok', {
    //     duration: 3000
    //   });
    // }).catch(reason => {
    //   this.snack.open(reason && reason.message ? reason.message : 'Fail to update supplier', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }

  updateSupplierDescription(supplier, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (supplier && supplier.value) {
      supplier.field = 'description';
      this.updateSupplier(supplier);
    }
  }

  openAddSupplierDialog() {
    this.dialog.open(DialogSupplierNewComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.suppliersArray.push(value);
        this.suppliersDatasource.data = this.suppliersArray;
      }
    });
  }

  updateSupplierEmail(param: {value: any; objectId: any}, descriptionMenuTrigger: MatMenuTrigger) {

  }

  updateSupplierAddress(param: { value: any; objectId: any }, addressMenuTrigger: MatMenuTrigger) {

  }

  updateSupplierMobile(param: { value: any; objectId: any }, mobileMenuTrigger: MatMenuTrigger) {

  }
}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: 'app-dialog-delete.html',

})
export class DialogSupplierDeleteComponent {
  deleteProgress = false;
  errorSupplierMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogSupplierDeleteComponent>,
    private readonly stockDatabase: StockDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteSupplier(supplier: any) {
    // this.errorSupplierMessage = undefined;
    // this.deleteProgress = true;
    // this.stockDatabase.deleteSupplier(supplier).then(value => {
    //   this.dialogRef.close(supplier);
    //   this.deleteProgress = false;
    // }).catch(reason => {
    //   this.errorSupplierMessage = reason && reason.message ? reason.message : reason.toString();
    //   this.deleteProgress = false;
    // });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}


@Component({
  selector: 'app-new-supplier',
  templateUrl: 'app-new-supplier.html',

})
export class DialogSupplierNewComponent implements OnInit {
  newSupplierForm: FormGroup;
  createSupplierProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockDatabaseService,
    public dialogRef: MatDialogRef<DialogSupplierDeleteComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newSupplierForm = this.formBuilder.group({
      name: ['', [Validators.nullValidator, Validators.required]],
      description: ['']
    });
  }

  createSupplier() {
    if (!this.newSupplierForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.createSupplierProgress = true;
    // this.stockDatabase.addSupplier(this.newSupplierForm.value).then(value => {
    //   this.createSupplierProgress = false;
    //   value.name = this.newSupplierForm.value.name;
    //   value.description = this.newSupplierForm.value.description;
    //   this.dialogRef.close(value);
    //   this.snack.open('Supplier created', 'Ok', {
    //     duration: 3000
    //   });
    // }).catch(reason => {
    //   console.log(reason);
    //   this.createSupplierProgress = false;
    //   //  this.dialogRef.close(null);
    //   this.snack.open('Supplier not created, try again', 'Ok', {
    //     duration: 3000
    //   });
    // });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}

