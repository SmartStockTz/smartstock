import {Component, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {DeviceInfo} from '../../shared-components/DeviceInfo';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends DeviceInfo implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  // openDrawer() {
  //   this.sidenav.open()
  //     .then(value => {
  //       console.log(value);
  //     }).catch(reason => {
  //     console.log(reason.toString());
  //   });
  // }
}
