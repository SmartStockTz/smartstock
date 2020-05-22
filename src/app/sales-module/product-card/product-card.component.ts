import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {EventApiService} from 'src/app/services/event-api.service';
import {MatSidenav} from '@angular/material/sidenav';
import {Stock} from '../../model/stock';
import {SsmEvents} from '../../utils/eventsNames';
import {DeviceInfo} from '../../common-components/DeviceInfo';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent extends DeviceInfo implements OnInit {
  @Input() product: Stock;
  @Input() productIndex: number;
  @Input() isViewedInWholesale = false;
  @Input() cartdrawer: MatSidenav;

  detailView = false;
  quantityFormControl = new FormControl(1, [Validators.nullValidator, Validators.min(1)]);

  flipped: number;
  displayError = false;

  constructor(private readonly eventService: EventApiService) {
    super();
  }

  ngOnInit() {
  }

  flip(value) {
    this.eventService.listen('flipping', (data) => {
      this.flipped = data.detail;
    });
    this.eventService.broadcast('flipping', value);

  }

  decrementQty() {
    if (this.quantityFormControl.value > 0) {
      this.quantityFormControl.setValue(this.quantityFormControl.value - 1);
    }
  }

  incrementQty() {
    this.quantityFormControl.setValue(this.quantityFormControl.value + 1);
  }

  addToCart(product) {
    const quantity = this.quantityFormControl.value;
    if (quantity > 0) {
      this.eventService.broadcast(SsmEvents.CART, {product: product, quantity: quantity});
      if (this.enoughWidth()) {
        this.cartdrawer.opened = true;
      }
      this.quantityFormControl.reset(0);
      this.detailView = false;
      this.flipped = null;
      this.displayError = false;
    } else {
      this.displayError = true;
    }
  }
}
