import {Component, OnInit} from '@angular/core';
import {bfast} from 'bfastjs';
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
    bfast.init({
      applicationId: 'smartstock_lb',
      projectId: 'smartstock'
    });
    return this.backgroundService.start();
  }
}

