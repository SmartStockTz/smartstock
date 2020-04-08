import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  currencyFormControl = new FormControl('TZS');
  totalProducts = 1;
  totalSales = 1;
  totalPurchases = 1;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('login')
      .catch(reason => {
        console.log(reason.toString());
      });
  }


  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    if (value === 99990) {
      return '10k + ';
    }

    return value;
  }

  monthlyCost() {
    const actual = this.calculateBill(30, this.totalSales, this.totalPurchases, this.totalProducts, this.currencyFormControl.value);
    const maxmun = this.currencyFormControl.value === 'TZS' ? 23000 : 10;
    if (actual > maxmun) {
      return maxmun;
    } else {
      return actual;
    }
  }

  actualMonthlyCost() {
    return this.calculateBill(30, this.totalSales, this.totalPurchases, this.totalProducts, this.currencyFormControl.value);
  }

  discount() {
    const actual = this.calculateBill(30, this.totalSales, this.totalPurchases, this.totalProducts, this.currencyFormControl.value);
    const maxmun = this.currencyFormControl.value === 'TZS' ? 23000 : 10;
    if (actual > maxmun) {
      return actual - maxmun;
    } else {
      return 0;
    }
  }

  // getMonthlyCost() {
  //   return this.calculateBill(30, this.totalSales, this.totalPurchases, this.totalProducts, this.currencyFormControl.value);
  // }

  calculateBill(days: number, soldItems: number, purchaseItems: number, products: number, currency: 'USD' | 'TZS'): number {
    const exRate = currency === 'TZS' ? 2300 : 1;
    const salesCost = 0.000133333 * days * exRate * soldItems;
    const purchaseCost = 0.0004 * days * exRate * purchaseItems;
    const stockCost = 0.0003 * days * exRate * products;
    const analyticsCost = 0.01 * days * exRate;
    return (salesCost + purchaseCost + stockCost + analyticsCost);
  }
}
