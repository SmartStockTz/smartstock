import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {StockModel} from '../../stocks/models/stock.model';
import {StockDetailsComponent} from '../../stocks/components/stock.component';


@Component({
  selector: 'app-stock-product-item-mobile-ui',
  templateUrl: './stock-product-item-mobile-ui.component.html',
  styleUrls: ['./stock-product-item-mobile-ui.component.css']
})
export class StockProductItemMobileUiComponent implements OnInit {

  @Input() product: StockModel;
  @Input() bottomSheet: MatBottomSheet;
  @Output() deleteCallback = new EventEmitter();
  @Output() editCallback = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  showDetails(product: StockModel) {
    this.bottomSheet.open(StockDetailsComponent, {
      data: product,
      closeOnNavigation: true,
    });
  }
}
