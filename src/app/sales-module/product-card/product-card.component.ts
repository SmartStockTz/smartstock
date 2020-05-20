import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventApiService } from 'src/app/services/event-api.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product;
  @Input() productIndex;
  @Input() salesType: string;
  detailView = false;
  quantityFormControl = new FormControl(0, [Validators.nullValidator, Validators.min(1)]);

  flipped;
  
  constructor(
    private readonly eventService: EventApiService
  ) { }

  ngOnInit() {
  }

  flip(value) {
       this.eventService.listen('flipping', (data)=> {
      this.flipped =data.detail;
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
    const cartEvent = new CustomEvent('add_cart', {detail: {product: product, quantity: quantity}});
    window.dispatchEvent(cartEvent);
    this.quantityFormControl.reset(0);
    this.detailView = false;
  }
}
