import {Component, OnInit} from '@angular/core';
import {ThreadsService} from './services/threads.service';
import {SsmEvents} from './utils/eventsNames';
import {StorageService} from './services/storage.service';
import {EventApiService} from './services/event-api.service';
import {BFast} from 'bfastjs';

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
              private readonly _storage: StorageService) {
  }

  ngOnInit() {
    this._storage.getActiveShop().then(_ => {
      this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_SET);
    }).catch(_ => {
      this.eventApi.broadcast(SsmEvents.ACTIVE_SHOP_REMOVE);
    });

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
  }
}

