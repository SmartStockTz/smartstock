import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {StockModel} from '../models/stock.model';

@Component({
  selector: 'smartstock-product-short-detail-form',
  template: `
    <div [formGroup]="formGroup">
      <h5>
        Product
      </h5>
      <mat-card class="card-wrapper">
        <mat-card-content class="card-content">
          <mat-form-field appearance="fill" class="my-input">
            <mat-label>Name</mat-label>
            <input matInput type="text" required formControlName="product">
            <mat-error>Product name required</mat-error>
          </mat-form-field>
          <mat-form-field *ngIf="saleable === true" appearance="fill" class="my-input">
            <mat-label>Sale Price</mat-label>
            <span matSuffix>TZS</span>
            <input min="0" matInput type="number" required formControlName="retailPrice">
            <mat-error>Sale price required</mat-error>
          </mat-form-field>
          <smartstock-category-form-field [formGroup]="formGroup"></smartstock-category-form-field>
          <smartstock-catalog-form-field [formGroup]="formGroup"></smartstock-catalog-form-field>
          <div class="d-flex align-items-center">
            <mat-checkbox style="margin-right: 5px" formControlName="downloadable"></mat-checkbox>
            <p style="margin: 0">Can be downloaded</p>
          </div>
          <div *ngIf="downloadAble" class="card-wrapper">
            <smartstock-upload-files [files]="isUpdateMode?initialStock.downloads:[]"
                                     [uploadFileFormControl]="downloadsFormControl()"></smartstock-upload-files>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProductShortDetailFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() saleable = true;
  @Input() downloadAble = false;
  @Input() isUpdateMode = false;
  @Input() initialStock: StockModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  downloadsFormControl() {
    return this.formGroup.get('downloads') as FormControl;
  }
}
