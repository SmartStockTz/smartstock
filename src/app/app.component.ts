import {Component, OnInit} from '@angular/core';
import {BackgroundService} from './workers/background.service';
import {isBrowser, isElectron} from 'bfast';

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
    // init({
    //   applicationId: 'smartstock_lb',
    //   projectId: 'smartstock'
    // });
    return this.backgroundService.start();
  }
}

