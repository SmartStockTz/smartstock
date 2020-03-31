import {Component, OnInit} from '@angular/core';
import {ThreadsService} from './services/threads.service';
import {SsmEvents} from './utils/eventsNames';
import {LocalStorageService} from './services/local-storage.service';
import {Capacitor} from '@capacitor/core';
import {EventApiService} from './services/event-api.service';

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
              private readonly eventApi: EventApiService,
              private readonly _storage: LocalStorageService) {
  }

  ngOnInit() {


    Capacitor.Plugins.Device.getInfo().then(value => {
      console.log(value);
    }).catch(reason => {
      console.log(reason);
    });


    this._storage.getActiveShop().then(_ => {
      this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_SET);
    }).catch(_ => {
      this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
    });

    this.eventApi.listen(SsmEvents.ACTIVE_SHOP_SET, async ($event) => {
      try {
        await this.threadProxy.start();
      } catch (e) {
        console.log(e);
      }
    });
    this.eventApi.listen(SsmEvents.ACTIVE_SHOP_REMOVE, async ($event) => {
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

// export class UpdateApplicationDialog {
//   constructor() {
//   }
// }
