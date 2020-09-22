import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UnitsModel} from '../models/units.model';
import {StockState} from '../states/stock.state';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'smartstock-units',
  template: `
    <mat-card class="mat-elevation-z3">
      <mat-card-title class="d-flex flex-row">
        <button (click)="openAddUnitDialog()" color="primary" class="ft-button" mat-flat-button>Add Unit</button>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button color="primary" [matMenuTriggerFor]="unitsMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #unitsMenu>
          <button (click)="getUnits()" mat-menu-item>Reload Units</button>
        </mat-menu>
      </mat-card-title>
      <mat-card-content>
        <table style="margin-top: 16px" class="my-input"
               *ngIf="!fetchUnitsFlag && unitsArray && unitsArray.length > 0"
               mat-table
               [dataSource]="unitsDatasource">
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
                      (click)="updateUnitName({id: id, value: nameFormControl.value}, nameMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="abbreviation">
            <th mat-header-cell *matHeaderCellDef>Abbreviation</th>
            <td class="editable" [matMenuTriggerFor]="abbreviationMenu"
                #nameMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.abbreviation}" matRipple mat-cell
                *matCellDef="let element">{{element.abbreviation}}
              <mat-menu #abbreviationMenu>
                <ng-template matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Abbreviation</mat-label>
                      <input [value]="data" [formControl]="abbreviationFormControl" matInput>
                    </mat-form-field>
                    <button
                      (click)="updateUnitAbbreviation({id: id, value: abbreviationFormControl.value}, nameMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td class="editable" [matMenuTriggerFor]="descriptionMenu"
                #descriptionMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.description}" matRipple mat-cell
                *matCellDef="let element">{{element.description}}
              <mat-menu #descriptionMenu>
                <ng-template style="padding: 16px" matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Description</mat-label>
                      <textarea [value]="data" [formControl]="descriptionFormControl" matInput></textarea>
                    </mat-form-field>
                    <button
                      (click)="updateUnitDescription({id: id, value: descriptionFormControl.value},
                     descriptionMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <div class="d-flex justify-content-end align-items-end">
                Actions
              </div>
            </th>
            <td mat-cell *matCellDef="let element">
              <div class="d-flex justify-content-end align-items-end">
                <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #opts>
                  <button (click)="deleteUnit(element)" mat-menu-item>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="unitsTableColums"></tr>
          <tr mat-row class="table-data-row" *matRowDef="let row; columns: unitsTableColums;"></tr>
        </table>
        <div *ngIf="fetchUnitsFlag">
          <mat-progress-spinner matTooltip="fetch units" [diameter]="30" mode="indeterminate"
                                color="primary">
          </mat-progress-spinner>
        </div>
        <mat-paginator #matPaginator [pageSize]="10" [pageSizeOptions]="[5,10,50]" showFirstLastButtons></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/units.style.css']
})
export class UnitsComponent implements OnInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  unitsDatasource: MatTableDataSource<UnitsModel>;
  unitsTableColums = ['name', 'abbreviation', 'description', 'actions'];
  unitsArray: UnitsModel[];
  fetchUnitsFlag = false;
  nameFormControl = new FormControl();
  abbreviationFormControl = new FormControl();
  descriptionFormControl = new FormControl();

  constructor(private readonly stockDatabase: StockState,
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
      this.unitsDatasource = new MatTableDataSource<UnitsModel>(this.unitsArray);
      this.unitsDatasource.paginator = this.matPaginator;
      this.fetchUnitsFlag = false;
    }).catch(reason => {
      // console.log(reason);
      this.fetchUnitsFlag = false;
    });
  }

  deleteUnit(element: any) {
    this.dialog.open(DialogUnitDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.unitsArray = this.unitsArray.filter(value => value.id !== element.id);
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

  updateUnit(unit: { id: string, value: string, field: string }) {
    this.snack.open('Update units-mobile-ui in progress..', 'Ok');
    this.stockDatabase.updateUnit(unit).then(data => {
      const editedObjectIndex = this.unitsArray.findIndex(value => value.id === data.id);
      this.unitsArray = this.unitsArray.filter(value => value.id !== unit.id);
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
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="deleteUnit(data)">
            Delete
            <mat-progress-spinner *ngIf="deleteProgress"
                                  matTooltip="Delete in progress..."
                                  style="display: inline-block" mode="indeterminate" diameter="15"
                                  color="accent">
            </mat-progress-spinner>
          </button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
      <p class="bg-danger" *ngIf="errorUnitMessage">{{errorUnitMessage}}</p>
    </div>
  `,
})
export class DialogUnitDeleteComponent {
  deleteProgress = false;
  errorUnitMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUnitDeleteComponent>,
    private readonly stockDatabase: StockState,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteUnit(unit: any) {
    this.errorUnitMessage = undefined;
    this.deleteProgress = true;
    this.stockDatabase.deleteUnit(unit).then(value => {
      this.dialogRef.close(unit);
      this.deleteProgress = false;
    }).catch(reason => {
      // console.log(reason);
      this.errorUnitMessage = 'Fails to delete, try again';
      this.deleteProgress = false;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}


@Component({
  selector: 'smartstock-new-unit',
  template: `
    <div style="min-width: 300px">
      <div mat-dialog-title>Create Unit</div>
      <div mat-dialog-content>
        <form class="d-flex flex-column" [formGroup]="newUnitForm" (ngSubmit)="createUnit()">

          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input placeholder="e.g Kilogram" matInput type="text" formControlName="name" required>
            <mat-error>Name required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" [rows]="2"></textarea>
          </mat-form-field>

          <button color="primary" [disabled]="createUnitProgress" mat-flat-button class="ft-button">
            Save
            <mat-progress-spinner style="display: inline-block" *ngIf="createUnitProgress" [diameter]="20"
                                  mode="indeterminate"></mat-progress-spinner>
          </button>
          <span style="margin-bottom: 8px"></span>
          <button color="warn" mat-dialog-close mat-button (click)="cancel($event)">
            Close
          </button>
        </form>
      </div>
    </div>
  `,
})
export class DialogUnitNewComponent implements OnInit {
  newUnitForm: FormGroup;
  createUnitProgress = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly stockDatabase: StockState,
    public dialogRef: MatDialogRef<DialogUnitDeleteComponent>) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm() {
    this.newUnitForm = this.formBuilder.group({
      name: ['', [Validators.nullValidator, Validators.required]],
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

