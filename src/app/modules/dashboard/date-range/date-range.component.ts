import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {DateRangeHeaderComponent} from '../date-range-header/date-range-header.component';
import {ShopI} from '../../../model/ShopI';
import {StorageService} from '../../../services/storage.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-current-shop',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent extends DeviceInfo implements OnInit {
  rangeHeader = DateRangeHeaderComponent;
  shop: ShopI;
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
