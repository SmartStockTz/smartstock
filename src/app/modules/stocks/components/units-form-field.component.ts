import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {StockState} from '../states/stock.state';
import {MatDialog} from '@angular/material/dialog';
import {DialogUnitNewComponent} from './units.component';

@Component({
  selector: 'smartstock-units-form-field',
  template: `
    <div [formGroup]="formGroup" *ngIf="stockable">
      <mat-form-field appearance="outline" class="my-input">
        <mat-label>Unit</mat-label>
        <mat-select formControlName="unit">
          <mat-option *ngFor="let unit of units | async" [value]="unit.name">
            {{unit.name}}
          </mat-option>
        </mat-select>
        <mat-progress-spinner matTooltip="Fetching units"
                              *ngIf="unitsFetching" matSuffix color="accent"
                              mode="indeterminate"
                              [diameter]="20"></mat-progress-spinner>
        <mat-error>Unit required</mat-error>
        <div matSuffix class="d-flex flex-row">
          <button (click)="refreshUnits($event)" mat-icon-button matTooltip="refresh units"
                  *ngIf="!unitsFetching">
            <mat-icon>refresh</mat-icon>
          </button>
          <button (click)="addNewUnit($event)" mat-icon-button matTooltip="add new unit"
                  *ngIf="!unitsFetching">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-form-field>
    </div>
  `
})
export class UnitsFormFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;
  units: Observable<[any]>;
  unitsFetching = true;
  @Input() stockable = false;

  constructor(private readonly stockState: StockState,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getUnits();
  }

  getUnits() {
    this.unitsFetching = true;
    this.stockState.getAllUnit({}).then(unitsObjects => {
      this.units = of(JSON.parse(JSON.stringify(unitsObjects)));
      this.unitsFetching = false;
    }).catch(reason => {
      this.units = of([{name: 'No unit'}]);
      console.warn(reason);
      this.unitsFetching = false;
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

}
