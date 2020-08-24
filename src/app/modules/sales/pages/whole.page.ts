import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'smartstock-whole-sale',
  template: `
    <smartstock-sale [isViewedInWholesale]="true"></smartstock-sale>
  `,
  styleUrls: ['../styles/whole.style.css'],
})
export class WholePageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
