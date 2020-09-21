import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {StockState} from '../states/stock.state';
import {MatDialog} from '@angular/material/dialog';
import {DialogCategoryNewComponent} from './categories.component';

@Component({
  selector: 'smartstock-category-form-field',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field appearance="outline" class="my-input">
        <mat-label>Category</mat-label>
        <mat-select [multiple]="false" formControlName="category">
          <mat-option *ngFor="let category of categories | async" [value]="category.name">
            {{category.name}}
          </mat-option>
        </mat-select>
        <mat-progress-spinner matTooltip="Fetching units"
                              *ngIf="categoriesFetching" matSuffix color="accent"
                              mode="indeterminate"
                              [diameter]="20"></mat-progress-spinner>
        <mat-error>Category required</mat-error>
        <div matSuffix class="d-flex flex-row">
          <button (click)="refreshCategories($event)" mat-icon-button matTooltip="refresh categories"
                  *ngIf="!categoriesFetching">
            <mat-icon>refresh</mat-icon>
          </button>
          <button (click)="addNewCategory($event)" mat-icon-button matTooltip="add new category"
                  *ngIf="!categoriesFetching">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-form-field>
    </div>
  `
})
export class CategoryFormFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;
  categoriesFetching = true;
  categories: Observable<any[]>;

  constructor(private readonly stockState: StockState,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoriesFetching = true;
    this.stockState.getAllCategory({size: 10000}).then(categoryObject => {
      const cat = JSON.parse(JSON.stringify(categoryObject));
      this.categories = of(cat);
      this.categoriesFetching = false;
    }).catch(reason => {
      this.categories = of([{name: 'No category'}]);
      console.warn(reason);
      this.categoriesFetching = false;
    });
  }

  addNewCategory($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(DialogCategoryNewComponent, {
      closeOnNavigation: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getCategories();
      }
    });
  }

  refreshCategories($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.getCategories();
  }

}
