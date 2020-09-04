import {Component, OnInit} from '@angular/core';
import {ThreadService} from './modules/lib/services/thread.service';
import {StorageService} from './modules/lib/services/storage.service';
import {EventService} from './modules/lib/services/event.service';
import {BFast} from 'bfastjs';
import {SsmEvents} from './modules/lib/utils/eventsNames.util';

@Component({
  selector: 'smartstock-root',
  template: `
    <router-outlet></router-outlet>
  `,
  providers: [
    ThreadService,
  ]
})
export class AppComponent implements OnInit {

  constructor(private readonly threadProxy: ThreadService,
              private readonly eventApi: EventService,
              private readonly _storage: StorageService) {
  }

  ngOnInit() {
    this.eventApi.listen(SsmEvents.ACTIVE_SHOP_SET, async ($event) => {
      try {
        const activeShop = await this._storage.getActiveShop();
        BFast.init({applicationId: activeShop.applicationId, projectId: activeShop.projectId}, activeShop.projectId);
        await this.threadProxy.start();
      } catch (e) {
        console.log(e);
      }
    });
    this.eventApi.listen(SsmEvents.ACTIVE_SHOP_REMOVE, async ($event) => {
      try {
        BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
        await this.threadProxy.stop();
      } catch (e) {
        console.log(e);
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

