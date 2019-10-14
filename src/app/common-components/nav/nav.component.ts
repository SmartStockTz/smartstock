import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goToSale() {
    this.router.navigateByUrl('/sale').catch(reason => console.log(reason));
  }

  goToWholeSale() {
    this.router.navigateByUrl('/sale/whole').catch(reason => console.log(reason));
  }

  goToStock() {
    this.router.navigateByUrl('/stock').catch(reason => console.log(reason));
  }

  goToPurchase() {
    this.router.navigateByUrl('/purchase').catch(reason => console.log(reason));
  }

  goToServerSetting() {
    this.router.navigateByUrl('server', {
      queryParams: {name: 'joshua'}
    }).catch(reason => console.log(reason));
  }

  goToUsers() {
    this.router.navigateByUrl('/users').catch(reason => console.log(reason));
  }
}
