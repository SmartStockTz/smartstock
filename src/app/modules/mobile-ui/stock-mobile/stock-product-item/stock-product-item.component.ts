import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {Stock} from '../../../../model/stock';
import {StockDetailsComponent} from '../../../stocks/stock/stock.component';


@Component({
  selector: 'app-stock-product-item',
  templateUrl: './stock-product-item.component.html',
  styleUrls: ['./stock-product-item.component.css']
})
export class StockProductItemComponent implements OnInit {

  @Input() product: Stock;
  @Input() bottomSheet: MatBottomSheet;
  @Output() deleteCallback = new EventEmitter();
  @Output() editCallback = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  showDetails(product: Stock) {
    this.bottomSheet.open(StockDetailsComponent, {
      data: product,
      closeOnNavigation: true,
    });
  }
}
