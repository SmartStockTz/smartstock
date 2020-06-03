import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  activeNav(route: string) {
    const url = new URL(location.href);
    return url.pathname.startsWith('/' + route);
  }
}
