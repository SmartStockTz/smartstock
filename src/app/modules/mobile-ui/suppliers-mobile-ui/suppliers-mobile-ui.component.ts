import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {SupplierI} from '../../../model/SupplierI';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {ShowSupplierMobileUiComponent} from './show-supplier-mobile-ui/show-supplier-mobile-ui.component';
import {DialogSupplierDeleteComponent, DialogSupplierNewComponent} from '../../stocks/suppliers/suppliers.component';

@Component({
  selector: 'app-suppliers-mobile-ui',
  templateUrl: './suppliers-mobile-ui.component.html',
  styleUrls: ['./suppliers-mobile-ui.component.css']
})
export class SuppliersMobileUiComponent implements OnInit {

  suppliersArray: SupplierI[];
  fetchSuppliersFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();
  addressFormControl = new FormControl();
  emailFormControl = new FormControl();
  mobileFormControl = new FormControl();
  suppliers: Observable<SupplierI[]>;

  constructor(private readonly stockDatabase: StockDatabaseService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly bottomSheet: MatBottomSheet,
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
    this.stockDatabase.getAllSupplier({size: 100}).then(data => {
      this.suppliersArray = JSON.parse(JSON.stringify(data));
      this.suppliers = of(this.suppliersArray);
      this.fetchSuppliersFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.fetchSuppliersFlag = false;
    });
  }

  deleteSupplier(element: any) {
    this.dialog.open(DialogSupplierDeleteComponent, {
      data: element,
      disableClose: true,
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.suppliersArray = this.suppliersArray.filter(value => value.objectId !== element.objectId);
        this.suppliers = of(this.suppliersArray);
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

  updateSupplier(supplier: SupplierI) {
    this.dialog.open(DialogSupplierNewComponent, {
      minWidth: '80%',
      closeOnNavigation: true,
      hasBackdrop: true,
      data: supplier
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getSuppliers();
      }
    });
  }

  openAddSupplierDialog() {
    this.dialog.open(DialogSupplierNewComponent, {
      minWidth: '80%',
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getSuppliers();
      }
    });
  }

  showDetails(supplier) {
    this.bottomSheet.open(ShowSupplierMobileUiComponent, {
      data: supplier
    });
  }
}
