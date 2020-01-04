import {Component, OnInit} from '@angular/core';
import {ThreadsService} from './services/threads.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private readonly thread: ThreadsService) {
  }

  async ngOnInit() {
    try {
      await this.thread.startSalesProxy();
      await this.thread.startStockUpdateProxy();
    } catch (e) {
      console.warn(e);
    }
  }
}
