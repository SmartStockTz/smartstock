import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-billing-invoices',
  templateUrl: './billing-invoices.component.html',
  styleUrls: ['./billing-invoices.component.css']
})
export class BillingInvoicesComponent implements OnInit {
  invoices: any;

  constructor() {
  }

  ngOnInit() {
  }

}
