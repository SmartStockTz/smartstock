import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.sidenav.open().catch(reason => {
      console.log(reason.toString());
    });
  }

  openDrawer() {
    console.log('side nav about to open');
    this.sidenav.open()
      .then(value => {
        console.log(value);
      }).catch(reason => {
      console.log(reason.toString());
    });
  }

  showProfile() {
    console.log('to go to profile');
  }

  home() {
    this.router.navigateByUrl('/').catch(reason => {
      console.log(reason.toString());
    });
  }

  logout() {
    this.router.navigateByUrl('login').catch(reason => {
      console.log(reason.toString());
    });
  }
}
