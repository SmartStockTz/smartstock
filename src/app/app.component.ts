import {Component, OnInit} from '@angular/core';
import {ThreadsService} from './services/threads.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    ThreadsService,
  ]
})
export class AppComponent implements OnInit {

  constructor(private readonly thread: ThreadsService,
              private readonly dialog: MatDialog) {
  }

  async ngOnInit() {
    try {
      await this.thread.startSalesProxy();
      await this.thread.startStockUpdateProxy();
    } catch (e) {
      console.warn(e);
    }
  }

  // private _checkNewVersion() {
  //
  // }
}

export class UpdateApplicationDialog {
  constructor() {
  }
}
