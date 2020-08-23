import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DateRangeHeaderComponent} from './date-range-header.component';
/*********** move to common ***********/
import {StorageService} from '../../lib/services/storage.service';
/*********** move to common ***********/
import {FormControl} from '@angular/forms';
import {ShopModel} from '../models/shop.model';
import {DeviceInfoUtil} from '../../lib/utils/device-info.util';

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
          <mat-form-field>
            <input matInput
                   (click)="picker6.open()"
                   [formControl]="dashboardDateInput"
                   placeholder="Choose a date"
                   [satDatepicker]="picker6">
            <sat-datepicker #picker6 [rangeMode]="true"
                            [touchUi]="!enoughWidth()"
                            panelClass="range-datepicker"
                            [selectFirstDateOnClose]="true">
            </sat-datepicker>
            <sat-datepicker-toggle matSuffix [for]="picker6"></sat-datepicker-toggle>
          </mat-form-field>
        </div>

      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/date-range.style.css']
})
export class DateRangeComponent extends DeviceInfoUtil implements OnInit {
  rangeHeader = DateRangeHeaderComponent;
  shop: ShopModel;
  today = new Date();
  dashboardDateInput = new FormControl({begin: new Date(), end: new Date()});
  @Output() dateSelected = new EventEmitter<{ begin: Date, end: Date }>();

  constructor(private readonly storage: StorageService) {
    super();
  }

  ngOnInit(): void {
    this.storage.getActiveShop().then(value => {
      this.shop = value;
    });
    this.dateSelected.emit({begin: new Date(), end: new Date()});
    this.dashboardDateInput.valueChanges.subscribe(value => {
      if (value && value.begin && value.end) {
        this.dateSelected.emit(value);
      }
    });
  }

}
