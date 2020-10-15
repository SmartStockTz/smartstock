import {Component, OnInit} from '@angular/core';
import {StorageService} from '@smartstock/core-libs';
import {EventService} from '@smartstock/core-libs';
import {BFast} from 'bfastjs';
import {SsmEvents} from '@smartstock/core-libs';
import {BackgroundService} from './workers/background.service';

@Component({
  selector: 'smartstock-root',
  template: `
    <router-outlet></router-outlet>
  `,
  providers: [
    BackgroundService,
  ]
})
export class AppComponent implements OnInit {

  constructor(private readonly backgroundService: BackgroundService,
              private readonly eventApi: EventService,
              private readonly _storage: StorageService) {
  }

  ngOnInit() {
    this.eventApi.listen(SsmEvents.ACTIVE_SHOP_SET, async ($event) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        BFast.init({applicationId: activeShop.applicationId, projectId: activeShop.projectId}, activeShop.projectId);
        await this.backgroundService.start();
      } catch (e) {
       // console.log(e);
      }
    });
    this.eventApi.listen(SsmEvents.ACTIVE_SHOP_REMOVE, async ($event) => {
      try {
        BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
        await this.backgroundService.stop();
      } catch (e) {
       // console.log(e);
      }
    });
    this._storage.getActiveShop().then(_ => {
      if (_) {
        this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_SET);
      } else {
        throw new Error('Shop is undefined');
      }
    }).catch(_ => {
      this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
    });
  }
}

