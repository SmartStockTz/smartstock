import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SupplierModel} from '../models/supplier.model';
import {StockState} from '../states/stock.state';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'smartstock-suppliers',
  template: `
    <mat-card class="mat-elevation-z3">
      <mat-card-title class="d-flex flex-row">
        <button (click)="openAddSupplierDialog()" color="primary" class="ft-button" mat-flat-button>
          Add Supplier
        </button>
        <span class="toolbar-spacer"></span>
        <button [matMenuTriggerFor]="menuSuppliers" mat-icon-button>
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menuSuppliers>
          <button (click)="getSuppliers()" mat-menu-item>Reload Suppliers</button>
        </mat-menu>
      </mat-card-title>
      <mat-card-content>
        <table style="margin-top: 16px" class="my-input"
               *ngIf="!fetchSuppliersFlag && suppliersArray && suppliersArray.length > 0"
               mat-table
               [dataSource]="suppliersDatasource">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td class="editable" [matMenuTriggerFor]="nameMenu"
                #nameMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.name}" matRipple mat-cell
                *matCellDef="let element">{{element.name}}
              <mat-menu #nameMenu>
                <ng-template matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Name</mat-label>
                      <input [value]="data" [formControl]="nameFormControl" matInput>
                    </mat-form-field>
                    <button
                      (click)="updateSupplierName({id: id, value: nameFormControl.value}, nameMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="mobile">
            <th mat-header-cell *matHeaderCellDef>Mobile</th>
            <td class="editable" [matMenuTriggerFor]="mobileMenu"
                #mobileMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.number}" matRipple mat-cell
                *matCellDef="let element">{{element.number}}
              <mat-menu #mobileMenu>
                <ng-template style="padding: 16px" matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Mobile</mat-label>
                      <textarea [value]="data" [formControl]="mobileFormControl" matInput></textarea>
                    </mat-form-field>
                    <button
                      (click)="updateSupplierMobile({id: id, value: mobileFormControl.value},
                     mobileMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td class="editable" [matMenuTriggerFor]="emailMenu"
                #emailMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.email}" matRipple mat-cell
                *matCellDef="let element">{{element.email}}
              <mat-menu #emailMenu>
                <ng-template style="padding: 16px" matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Email</mat-label>
                      <textarea [value]="data" [formControl]="emailFormControl" matInput></textarea>
                    </mat-form-field>
                    <button
                      (click)="updateSupplierEmail({id: id, value: emailFormControl.value},
                     emailMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Address</th>
            <td class="editable" [matMenuTriggerFor]="addressMenu"
                #addressMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.address}" matRipple mat-cell
                *matCellDef="let element">{{element.address}}
              <mat-menu #addressMenu>
                <ng-template style="padding: 16px" matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Address</mat-label>
                      <textarea [value]="data" [formControl]="addressFormControl" matInput></textarea>
                    </mat-form-field>
                    <button
                      (click)="updateSupplierAddress({id: id, value: addressFormControl.value},
                     addressMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <!--          <div class="d-flex justify-content-end align-items-end">-->
              <!--            Actions-->
              <!--          </div>-->
            </th>
            <td mat-cell *matCellDef="let element">
              <div class="d-flex justify-content-end align-items-end">
                <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #opts>
                  <button (click)="deleteSupplier(element)" mat-menu-item>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="suppliersTableColums"></tr>
          <tr mat-row class="table-data-row" *matRowDef="let row; columns: suppliersTableColums;"></tr>

        </table>
        <div *ngIf="fetchSuppliersFlag">
          <mat-progress-spinner matTooltip="fetch suppliers"
                                [diameter]="30" mode="indeterminate"
                                color="primary">
          </mat-progress-spinner>
        </div>
        <mat-paginator #matPaginator [pageSize]="10" [pageSizeOptions]="[5,10,50]" showFirstLastButtons></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/suppliers.style.css']
})
export class SuppliersComponent implements OnInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  suppliersDatasource: MatTableDataSource<SupplierModel>;
  suppliersTableColums = ['name', 'email', 'mobile', 'address', 'actions'];
  suppliersArray: SupplierModel[];
  fetchSuppliersFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();
  addressFormControl = new FormControl();
  emailFormControl = new FormControl();
  mobileFormControl = new FormControl();

  constructor(private readonly stockState: StockState,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.getSuppliers();
  }

  searchSupplier(query: string) {
    // if ($event && $event.query) {
    //   this.fetchSuppliersFlag = true;
    //   this.stockDatabase.searchSupplier($event.query, {size: 20}).then(data => {
    //     this.suppliersArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.suppliersDatasource = new MatTableDataSource(this.suppliersArray);
    //     this.fetchSuppliersFlag = false;
    //     // this.size = 0;
    //   }).catch(reason => {
    //     this.snack.open(reason, 'Ok', {
    //       duration: 3000
    //     });
    //     this.fetchSuppliersFlag = false;
    //   });
    // } else {
    //   this.getSuppliers();
    // }
  }

  getSuppliers() {
    this.fetchSuppliersFlag = true;
    this.stockState.getAllSupplier({size: 100}).then(data => {
      this.suppliersArray = JSON.parse(JSON.stringify(data));
      this.suppliersDatasource = new MatTableDataSource<SupplierModel>(this.suppliersArray);
      this.suppliersDatasource.paginator = this.matPaginator;
      this.fetchSuppliersFlag = false;
    }).catch(reason => {
      // console.log(reason);
      this.fetchSuppliersFlag = false;
    });
  }

  deleteSupplier(element: any) {
    this.dialog.open(DialogSupplierDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.suppliersArray = this.suppliersArray.filter(value => value.id !== element.id);
        this.suppliersDatasource = new MatTableDataSource<SupplierModel>(this.suppliersArray);
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

  updateSupplier(supplier: { id: string, value: string, field: string }) {
    this.snack.open('Update in progress..', 'Ok');
    this.stockState.updateSupplier(supplier).then(data => {
      const editedObjectIndex = this.suppliersArray.findIndex(value => value.id === data.id);
      this.suppliersArray = this.suppliersArray.filter(value => value.id !== supplier.id);
      if (editedObjectIndex !== -1) {
        const updatedObject = this.suppliersArray[editedObjectIndex];
        updatedObject[supplier.field] = supplier.value;
        this.suppliersDatasource.data[editedObjectIndex] = updatedObject;
      } else {
        console.warn('fails to update supplier table');
      }
      this.snack.open('Supplier updated', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      this.snack.open('Fail to update supplier', 'Ok', {
        duration: 3000
      });
    });
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

  updateSupplierEmail(supplier: any, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (supplier && supplier.value) {
      supplier.field = 'email';
      this.updateSupplier(supplier);
    }
  }

  updateSupplierAddress(supplier: any, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (supplier && supplier.value) {
      supplier.field = 'address';
      this.updateSupplier(supplier);
    }
  }

  updateSupplierMobile(supplier: any, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (supplier && supplier.value) {
      supplier.field = 'number';
      this.updateSupplier(supplier);
    }
  }
}

@Component({
  selector: 'smartstock-dialog-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete : <b>{{' ' + data.name}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="deleteSupplier(data)">
            Delete
            <mat-progress-spinner *ngIf="deleteProgress"
                                  matTooltip="Delete in progress..."
                                  style="display: inline-block" mode="indeterminate" diameter="15"
                                  color="accent"></mat-progress-spinner>
          </button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button mat-dialog-close [disabled]="deleteProgress" color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
      <p class="bg-danger" *ngIf="errorSupplierMessage">{{errorSupplierMessage}}</p>
    </div>
  `
})
export class DialogSupplierDeleteComponent {
  deleteProgress = false;
  errorSupplierMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogSupplierDeleteComponent>,
    private readonly stockDatabase: StockState,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteSupplier(supplier: SupplierModel) {
    this.errorSupplierMessage = undefined;
    this.deleteProgress = true;
    this.stockDatabase.deleteSupplier(supplier.id).then(value => {
      this.dialogRef.close(supplier);
      this.deleteProgress = false;
    }).catch(reason => {
      this.errorSupplierMessage = 'Fails to delete supplier, try again';
      this.deleteProgress = false;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}


@Component({
  selector: 'smartstock-new-supplier',
  template: `
    <div style="min-width: 300px">
      <div mat-dialog-title>Create Supplier</div>
      <div mat-dialog-content>
        <form class="d-flex flex-column" [formGroup]="newSupplierForm" (ngSubmit)="createSupplier()">

          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput type="text" formControlName="name" required>
            <mat-error>Name required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email">
            <mat-error>Email required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mobile</mat-label>
            <input matInput formControlName="number">
            <mat-error>Mobile required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Address</mat-label>
            <textarea matInput formControlName="address" rows="2"></textarea>
            <mat-error>Address required</mat-error>
          </mat-form-field>

          <button color="primary" [disabled]="createSupplierProgress" mat-flat-button class="ft-button">
            Save
            <mat-progress-spinner style="display: inline-block"
                                  *ngIf="createSupplierProgress"
                                  [diameter]="20"
                                  mode="indeterminate">
            </mat-progress-spinner>
          </button>
          <button mat-dialog-close="" class="btn-block" mat-button color="warn">Close</button>

          <span style="margin-bottom: 8px"></span>
          <!--      <button color="warn" mat-flat-button (click)="cancel($event)">-->
          <!--        Close-->
          <!--      </button>-->
        </form>
      </div>
    </div>
  `
})
export class DialogSupplierNewComponent implements OnInit {
  newSupplierForm: FormGroup;
  createSupplierProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockState,
    public dialogRef: MatDialogRef<DialogSupplierDeleteComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newSupplierForm = this.formBuilder.group({
      name: ['', [Validators.nullValidator, Validators.required]],
      email: [''],
      number: [''],
      address: ['']
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
    this.stockDatabase.addSupplier(this.newSupplierForm.value).then(value => {
      this.createSupplierProgress = false;
      value.name = this.newSupplierForm.value.name;
      value.email = this.newSupplierForm.value.email;
      value.mobile = this.newSupplierForm.value.mobile;
      value.address = this.newSupplierForm.value.address;
      this.dialogRef.close(value);
      this.snack.open('Supplier created', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      // console.log(reason);
      this.createSupplierProgress = false;
      //  this.dialogRef.close(null);
      this.snack.open('Supplier not created, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}

