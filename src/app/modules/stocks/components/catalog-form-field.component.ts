import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {StockState} from '../states/stock.state';
import {MatDialog} from '@angular/material/dialog';
import {DialogCatalogCreateComponent} from './dialog-catalog-create.component';

@Component({
  selector: 'smartstock-catalog-form-field',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field appearance="outline" class="my-input">
        <mat-label>Catalogs</mat-label>
        <mat-select [multiple]="true" formControlName="catalog">
          <mat-option *ngFor="let category of catalogs | async" [value]="category.name">
            {{category.name}}
          </mat-option>
        </mat-select>
        <mat-progress-spinner matTooltip="Fetching units"
                              *ngIf="catalogsFetching" matSuffix color="accent"
                              mode="indeterminate"
                              [diameter]="20"></mat-progress-spinner>
        <mat-error>Category required</mat-error>
        <div matSuffix class="d-flex flex-row">
          <button (click)="refreshCategories($event)" mat-icon-button matTooltip="refresh categories"
                  *ngIf="!catalogsFetching">
            <mat-icon>refresh</mat-icon>
          </button>
          <button (click)="addNewCatalog($event)" mat-icon-button matTooltip="add new category"
                  *ngIf="!catalogsFetching">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-form-field>
    </div>
  `
})
export class CatalogFormFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;
  catalogsFetching = true;
  catalogs: Observable<any[]>;

  constructor(private readonly stockState: StockState,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getCatalogs();
  }

  getCatalogs() {
    this.catalogsFetching = true;
    this.stockState.getAllCatalogs({size: 10000}).then(categoryObject => {
      categoryObject.push({name: 'general'});
      this.catalogs = of(categoryObject);
      this.catalogsFetching = false;
    }).catch(_ => {
      this.catalogs = of([{name: 'general'}]);
      this.catalogsFetching = false;
    });
  }

  addNewCatalog($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(DialogCatalogCreateComponent, {
      closeOnNavigation: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getCatalogs();
      }
    });
  }

  refreshCategories($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.getCatalogs();
  }

}
