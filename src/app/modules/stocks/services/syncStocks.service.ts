import {BFast} from 'bfastjs';
import {Injectable} from '@angular/core';
import {ShopModel} from '../models/shop.model';
import {SocketController} from 'bfastjs/dist/controllers/SocketController';

@Injectable({
  providedIn: 'root'
})
export class SyncStocksService {
  private stockSocket: SocketController;

  constructor() {
  }

  start() {
    this.init();
    this.startStockSocket()
      .catch();
  }

  init() {
    BFast.init({
      applicationId: 'smartstock_lb', projectId: 'smartstock'
    });
  }

  async startStockSocket() {
    const smartStockCache = BFast.cache({database: 'smartstock', collection: 'config'});
    const shop: ShopModel = await smartStockCache.get('activeShop');
    this.stockSocket = BFast.functions().event('/stocks', () => {
      console.log('stocks socket connect');
      this.getMissedStocks(shop, smartStockCache);
      this.stockSocket.emit({
        auth: null,
        body: {applicationId: shop ? shop.applicationId : null, projectId: shop ? shop.projectId : null}
      });
    }, () => {
      console.log('stocks socket disconnect');
    });

    this.stockSocket.listener(async data => {
      const smartStockCache1 = BFast.cache({database: 'smartstock', collection: 'config'});
      const shop1: ShopModel = await smartStockCache1.get('activeShop');
      this.updateLocalStock(data.body ? data.body : data, shop1)
        .catch();
    });
  }

  async getMissedStocks(shop, smartStockCache) {
    if (shop && shop.applicationId && shop.projectId) {
      let lastUpdate = await smartStockCache.get('lastUpdate');
      if (lastUpdate) {
        await this.mergeStocks(shop, lastUpdate, smartStockCache);
        return;
      }
      lastUpdate = new Date().toISOString();
      BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
      const stocks = await BFast.database(shop.projectId).collection('stocks')
        .getAll(null, {cacheEnable: false, dtl: 7});
      await BFast.cache({database: 'stocks', collection: shop.projectId})
        .set('all', stocks);
      await smartStockCache.set('lastUpdate', lastUpdate);
    }
  }

  async mergeStocks(shop, lastUpdate, smartStockCache) {

    const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});

    BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
    const remoteStocks: any = await BFast.functions().request(`/functions/stocks/sync/${shop.projectId}?lastUpdateTime=${lastUpdate}`)
      .get();

    if (remoteStocks
      && remoteStocks.lastUpdateTime
      && remoteStocks.projectId
      && remoteStocks.results
      && Array.isArray(remoteStocks.results)
      && remoteStocks.results.length > 0) {
      const localStocks: any[] = await stocksCache.get('all');
      const localStockMap = {};
      if (localStocks) {
        localStocks.forEach(value => {
          localStockMap[value.id] = value;
        });
      }
      if (remoteStocks && remoteStocks.results) {
        remoteStocks.results.forEach(value => {
          localStockMap[value.id] = value;
        });
      }
      const newStocks = [];
      Object.keys(localStockMap).forEach(key => {
        newStocks.push(localStockMap[key]);
      });
      await stocksCache.set('all', newStocks);
      await smartStockCache.set('lastUpdate', (remoteStocks && remoteStocks.lastUpdateTime)
        ? remoteStocks.lastUpdateTime : undefined);
      // console.log(localStocks);
      /// console.log(remoteStocks);
    } else {
      // console.log('no new stocks');
    }
  }

  async updateLocalStock(data, shop) {

    if (shop && shop.applicationId && shop.projectId && data && data.data) {
      BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
      const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
      const stocks: any[] = await stocksCache.get('all');
      const {operationType, fullDocument, documentKey, updateDescription} = data.data;
      switch (operationType) {
        case 'insert':
          fullDocument.id = fullDocument['_id'];
          delete fullDocument._id;
          fullDocument.createdAt = fullDocument['_created_at'];
          delete fullDocument._created_at;
          fullDocument.createdAt = fullDocument['_created_at'];
          delete fullDocument._updated_at;
          stocks.push(fullDocument);
          await stocksCache.set('all', stocks);
          return;
        case 'delete':
          await stocksCache.set('all', stocks.filter(stock => stock.id !== documentKey['_id']));
          return;
        case 'update':
          await stocksCache.set('all', stocks.map(stock => {
            if (stock.id === documentKey['_id']) {
              // updatedFields
              // removedFields
              const updatedFields = updateDescription['updatedFields'];
              const removedFields = updateDescription['removedFields'];
              if (updateDescription && updatedFields) {
                if (updatedFields['_updated_at']) {
                  stock.updatedAt = updatedFields['_updated_at'];
                }
                Object.keys(updatedFields)
                  .filter(key => !key.toString().startsWith('_'))
                  .forEach(key => {
                    stock[key] = updatedFields[key];
                  });
              }
              if (updateDescription && removedFields && Array.isArray(removedFields)) {
                removedFields.forEach(field => {
                  delete stock[field];
                });
              }
              return stock;
            } else {
              return stock;
            }
          }));
          return;
        case 'replace':
          await stocksCache.set('all', stocks.map(stock => {
            if (stock.id === documentKey['_id']) {
              return fullDocument;
            } else {
              return stock;
            }
          }));
          return;
        default:
          return;
      }
    }
  }

  stop() {
    if (this.stockSocket) {
      this.stockSocket.close();
    }
  }

}
