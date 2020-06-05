import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl} from '@angular/forms';

import {Observable, of} from 'rxjs';
import {UnitsI} from '../../../model/UnitsI';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {InfoMessageService} from '../../../services/info-message.service';
import {DialogUnitDeleteComponent, DialogUnitNewComponent} from '../../stocks/units/units.component';


@Component({
  selector: 'app-units-mobile-ui',
  templateUrl: './units-mobile-ui.component.html',
  styleUrls: ['./units-mobile-ui.component.css']
})
export class UnitsMobileUiComponent implements OnInit {

  unitsArray: UnitsI[];
  fetchUnitsFlag = false;
  nameFormControl = new FormControl();
  abbreviationFormControl = new FormControl();
  descriptionFormControl = new FormControl();
  units: Observable<UnitsI[]>;

  // @ViewChild(CdkVirtualScrollViewport, {static: false}) virtualScroll: CdkVirtualScrollViewport;

  constructor(private readonly stockDatabase: StockDatabaseService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: InfoMessageService) {
  }

  ngOnInit() {
    this.getUnits();
  }

  getUnits() {
    this.fetchUnitsFlag = true;
    this.stockDatabase.getAllUnit({size: 100}).then(data => {
      this.unitsArray = data;
      this.units = of(this.unitsArray);
      this.fetchUnitsFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.fetchUnitsFlag = false;
    });
  }

  deleteUnit(element: any) {
    this.dialog.open(DialogUnitDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.unitsArray = this.unitsArray.filter(value => value.objectId !== element.objectId);
        this.units = of(this.unitsArray);
        this.snack.showMobileInfoMessage('Unit deleted');
      } else {
        this.snack.showMobileInfoMessage('Unit not deleted');
      }
    });
  }

  updateUnit(unit: UnitsI) {
    this.dialog.open(DialogUnitNewComponent, {
      minWidth: '80%',
      closeOnNavigation: true,
      hasBackdrop: true,
      data: unit
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getUnits();
        // const editedObjectIndex = this.unitsArray.findIndex(value1 => value1.objectId === value.objectId);
        // // this.unitsArray = this.unitsArray.filter(value2 => value2.objectId !== value.objectId);
        // if (editedObjectIndex !== -1) {
        //   this.unitsArray[editedObjectIndex] = value;
        //   this.units-mobile-ui = of(this.unitsArray);
        // } else {
        //   console.warn('fails to update unit table');
        // }
        // this.snack.open('Unit updated', 'Ok', {
        //   duration: 3000
        // });
      }
    });
  }

  openAddUnitDialog() {
    this.dialog.open(DialogUnitNewComponent, {
      minWidth: '80%',
      closeOnNavigation: true,
      hasBackdrop: true,
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getUnits();
      }
    });
  }
}
