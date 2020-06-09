import {Component, OnInit} from '@angular/core';
import {DeviceInfo} from '../../shared/DeviceInfo';
import {DateRangeSelectorComponent} from '../date-range-selector/date-range-selector.component';
import {ShopI} from '../../../model/ShopI';
import {StorageService} from '../../../services/storage.service';

@Component({
  selector: 'app-current-shop',
  templateUrl: './current-shop.component.html',
  styleUrls: ['./current-shop.component.css']
})
export class CurrentShopComponent extends DeviceInfo implements OnInit {
  rangesFooter = DateRangeSelectorComponent;
  shop: ShopI;
  today = new Date();

  constructor(private readonly storage: StorageService) {
    super();
  }

  ngOnInit(): void {
    this.storage.getActiveShop().then(value => {
      this.shop = value;
    });
  }

}
