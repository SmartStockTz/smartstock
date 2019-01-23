import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.css']
})
export class NavUserComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goToSales() {
    this.router.navigateByUrl('sale').catch(reason => console.log(reason));
  }

  goToWholesale() {
    this.router.navigateByUrl('whole').catch(reason => console.log(reason));
  }
}
