import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin-drawer',
  templateUrl: './admin-drawer.component.html',
  styleUrls: ['./admin-drawer.component.css']
})
export class AdminDrawerComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  shouldExpand(route: string) {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }
}
