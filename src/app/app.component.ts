import {Component, OnInit} from '@angular/core';
import {ThreadsService} from './services/threads.service';
import {SsmEvents} from './utils/eventsNames';
import {LocalStorageService} from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    ThreadsService,
  ]
})
export class AppComponent implements OnInit {

  constructor(private readonly threadProxy: ThreadsService,
              private readonly _storage: LocalStorageService) {
  }

  ngOnInit() {
    this._storage.getActiveShop().then(_ => {
      window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_SET));
    }).catch(_ => {
      window.dispatchEvent(new Event(SsmEvents.ACTIVE_SHOP_REMOVE));
    });

    window.addEventListener(SsmEvents.ACTIVE_SHOP_SET, async ($event) => {
      try {
        await this.threadProxy.start();
      } catch (e) {
        console.log(e);
      }
    });
    window.addEventListener(SsmEvents.ACTIVE_SHOP_REMOVE, async ($event) => {
      try {
        await this.threadProxy.stop();
      } catch (e) {
        console.log(e);
      }
    });
    // try {
    //   await this.threadProxy.start();
    // } catch (e) {
    //   console.warn(e);
    // }
  }

  // private _checkNewVersion() {
  //
  // }
}

export class UpdateApplicationDialog {
  constructor() {
  }
}
