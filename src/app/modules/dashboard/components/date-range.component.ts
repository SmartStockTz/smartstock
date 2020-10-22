import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DeviceInfoUtil, StorageService} from '@smartstocktz/core-libs';
import {FormControl, FormGroup} from '@angular/forms';
import {ShopModel} from '../models/shop.model';

@Component({
  selector: 'smartstock-current-shop',
  template: `
    <mat-card>
      <mat-card-content class="d-flex flex-lg-row flex-lg-row flex-md-row flex-sm-column flex-column align-items-center">

        <div class="d-flex justify-content-center align-items-center flex-column" style="padding-bottom: 8px">
          <div style="padding: 8px; justify-content: center; align-items: center">
            <mat-icon style="width: 70px; height: 70px; font-size: 70px" color="primary">store</mat-icon>
          </div>
        </div>

        <div class="flex-grow-1 d-flex flex-row">
          <div class="d-flex flex-column justify-content-center">
            <h4 style="overflow: hidden; text-overflow: ellipsis;"
                *ngIf="shop">{{shop.businessName}}</h4>
            <span style="width: 4px; height: 4px"></span>
            <mat-card-subtitle *ngIf="shop">{{shop.category}}</mat-card-subtitle>
          </div>
          <span style="flex: 1 1 auto"></span>
        </div>

        <div class="d-flex justify-content-center align-items-center">

          <mat-form-field appearance="fill">
            <mat-label>Enter a date range</mat-label>
            <mat-date-range-input [formGroup]="rangeFormGroup" [rangePicker]="picker">
              <input matStartDate formControlName="begin" placeholder="Start date">
              <input matEndDate formControlName="end" placeholder="End date">
            </mat-date-range-input>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-date-range-picker #picker></mat-date-range-picker>

            <mat-error *ngIf="rangeFormGroup.controls.begin.hasError('matStartDateInvalid')">Invalid start date</mat-error>
            <mat-error *ngIf="rangeFormGroup.controls.end.hasError('matEndDateInvalid')">Invalid end date</mat-error>
          </mat-form-field>
        </div>

      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/date-range.style.css']
})
export class DateRangeComponent extends DeviceInfoUtil implements OnInit {
  shop: ShopModel;
  today = new Date();
  @Output() dateSelected = new EventEmitter<{ begin: Date, end: Date }>();
  rangeFormGroup: FormGroup = new FormGroup({
    begin: new FormControl(new Date()),
    end: new FormControl(new Date())
  });

  constructor(private readonly storage: StorageService) {
    super();
  }

  ngOnInit(): void {
    this.storage.getActiveShop().then(value => {
      this.shop = value;
    });
    this.dateSelected.emit({begin: new Date(), end: new Date()});
    this.rangeFormGroup.valueChanges.subscribe(value => {
      if (value && value.begin && value.end) {
        this.dateSelected.emit(value);
      }
    });
  }

}
