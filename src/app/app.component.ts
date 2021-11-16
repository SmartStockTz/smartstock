import {Component, OnInit} from '@angular/core';
import {BackgroundService} from './workers/background.service';

@Component({
  selector: 'smartstock-root',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {

  constructor(private readonly backgroundService: BackgroundService) {
  }

  async ngOnInit() {
    document.getElementById('splash12').style.display = 'none';
    return this.backgroundService.start();
  }
}

