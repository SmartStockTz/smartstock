import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StockDatabaseService} from '../../services/stock-database.service';
import {UnitsI} from '../../model/UnitsI';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  unitsDatasource: MatTableDataSource<UnitsI>;
  unitsTableColums = ['name', 'abbreviation', 'description', 'actions'];
  unitsArray: UnitsI[];
  fetchUnitsFlag = false;
  nameFormControl = new FormControl();
  abbreviationFormControl = new FormControl();
  descriptionFormControl = new FormControl();

  constructor(private readonly stockDatabase: StockDatabaseService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.getUnits();
  }

  getUnits() {
    this.fetchUnitsFlag = true;
    this.stockDatabase.getAllUnit({size: 100}).then(data => {
      this.unitsArray = JSON.parse(JSON.stringify(data));
      this.unitsDatasource = new MatTableDataSource<UnitsI>(this.unitsArray);
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
        this.unitsDatasource.data = this.unitsArray;
        this.snack.open('Unit deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('Unit not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateUnitName(unit, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (unit && unit.value) {
      unit.field = 'name';
      this.updateUnit(unit);
    }
  }

  updateUnitAbbreviation(abbreviation, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (abbreviation && abbreviation.value) {
      abbreviation.field = 'abbreviation';
      this.updateUnit(abbreviation);
    }
  }

  updateUnit(unit: { objectId: string, value: string, field: string }) {
    this.snack.open('Update units in progress..', 'Ok');
    this.stockDatabase.updateUnit(unit).then(data => {
      const editedObjectIndex = this.unitsArray.findIndex(value => value.objectId === data.objectId);
      this.unitsArray = this.unitsArray.filter(value => value.objectId !== unit.objectId);
      if (editedObjectIndex !== -1) {
        const updatedObject = this.unitsArray[editedObjectIndex];
        updatedObject[unit.field] = unit.value;
        this.unitsArray[editedObjectIndex] = updatedObject;
        this.unitsDatasource.data = this.unitsArray;
      } else {
        console.warn('fails to update unit table');
      }
      this.snack.open('Unit updated', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      console.log(reason);
      this.snack.open('Fail to update unit', 'Ok', {
        duration: 3000
      });
    });
  }

  updateUnitDescription(unit, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (unit && unit.value) {
      unit.field = 'description';
      this.updateUnit(unit);
    }
  }

  openAddUnitDialog() {
    this.dialog.open(DialogUnitNewComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.unitsArray.push(value);
        this.unitsDatasource.data = this.unitsArray;
      }
    });
  }
}

@Component({
  selector: 'app-dialog-delete',
  templateUrl: 'app-dialog-delete.html',

})
export class DialogUnitDeleteComponent {
  deleteProgress = false;
  errorUnitMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUnitDeleteComponent>,
    private readonly stockDatabase: StockDatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteUnit(unit: any) {
    this.errorUnitMessage = undefined;
    this.deleteProgress = true;
    this.stockDatabase.deleteUnit(unit).then(value => {
      this.dialogRef.close(unit);
      this.deleteProgress = false;
    }).catch(reason => {
      console.log(reason);
      this.errorUnitMessage = 'Fails to delete, try again';
      this.deleteProgress = false;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}


@Component({
  selector: 'app-new-unit',
  templateUrl: 'app-new-unit.html',

})
export class DialogUnitNewComponent implements OnInit {
  newUnitForm: FormGroup;
  createUnitProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockDatabaseService,
    public dialogRef: MatDialogRef<DialogUnitDeleteComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newUnitForm = this.formBuilder.group({
      name: ['', [Validators.nullValidator, Validators.required]],
      abbreviation: ['', [Validators.nullValidator, Validators.required]],
      description: ['']
    });
  }

  createUnit() {
    if (!this.newUnitForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.createUnitProgress = true;
    this.stockDatabase.addUnit(this.newUnitForm.value).then(value => {
      this.createUnitProgress = false;
      value.name = this.newUnitForm.value.name;
      value.description = this.newUnitForm.value.description;
      this.dialogRef.close(value);
      this.snack.open('Unit created', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      console.log(reason);
      this.createUnitProgress = false;
      this.snack.open('Unit not created, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  cancel($event: Event) {
    $event.preventDefault();
    this.dialogRef.close(null);
  }
}

