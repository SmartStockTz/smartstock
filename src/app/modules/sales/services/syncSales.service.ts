import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';

@Injectable({
  providedIn: 'root'
})
export class SyncSalesService {
  shouldRun = true;
  salesInterval: NodeJS.Timeout;

  constructor() {
  }

  async run() {
    this.initiateSmartStock();
    await this.saveSalesAndRemove();
  }

  initiateSmartStock() {
    BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
  }

  async getShops() {
    try {
      const user = await BFast.auth().currentUser();
      if (user && user.shops && Array.isArray(user.shops)) {
        const shops = [];
        user.shops.forEach(element => {
          shops.push(element);
        });
        shops.push({
          businessName: user.businessName,
          projectId: user.projectId,
          applicationId: user.applicationId,
          projectUrlId: user.projectUrlId,
          settings: user.settings,
          street: user.street,
          country: user.country,
          region: user.region
        });
        return shops;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async saveSalesAndRemove() {
    const shops = await this.getShops();
    for (const shop of shops) {
      BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
      const salesCache = BFast.cache({database: 'sales', collection: shop.projectId});
      const salesKeys = await salesCache.keys();
      for (const key of salesKeys) {
        const sales = await salesCache.get(key);
        const transactionResult = await this.saveSaleAndUpdateStock(sales, shop, salesCache, key);
        await salesCache.remove(key, true);
        return transactionResult;
      }
    }
  }

  async saveSaleAndUpdateStock(sales, shop, salesCache, key) {
    const dataToSave = sales.map(sale => sale.body);
    await BFast
      .database(shop.projectId)
      .transaction(false)
      .createMany('sales', dataToSave)
      .updateMany('stocks',
        dataToSave.map(sale => {
          return {
            objectId: sale.stock.objectId,
            data: {'quantity': {'__op': 'Increment', 'amount': -sale.quantity}}
          };
        })
      )
      .commit({
        before: async transactionModels => {
          await this.prepareSalesCollection(shop);
          const salesFromTransactionModel = transactionModels.filter(value =>
            value.path.toLowerCase() === '/classes/sales' && value.method.toLowerCase() === 'post');
          for (const sale of salesFromTransactionModel) {
            const duplicateResults = await BFast.database(shop.projectId)
              .collection('sales')
              .query()
              .find({
                filter: {
                  batch: sale.body.batch
                }
              });
            if (duplicateResults && Array.isArray(duplicateResults) && duplicateResults.length > 0) {
              transactionModels = transactionModels.filter(value => value.body.batch !== sale.body.batch);
              await salesCache.remove(key, true);
            }
          }
          return transactionModels;
        }
      });
  }

  async prepareSalesCollection(shop) {
    const inits = await BFast
      .database(shop.projectId)
      .collection('sales')
      .query()
      .find({
        filter: {
          'n1m': 'prepare'
        }
      });
    if (inits && Array.isArray(inits) && inits.length > 0) {
      return;
    }
    const t = await BFast.database(shop.projectId)
      .collection('sales')
      .save<any>({'n1m': 'prepare'});
    await BFast.database(shop.projectId)
      .collection('sales')
      .delete(t.objectId);
  }

  start() {
    this.salesInterval = setInterval(_ => {
      if (this.shouldRun) {
        this.shouldRun = false;
        this.run()
          .then()
          .catch()
          .finally(() => {
            this.shouldRun = true;
          });
      } else {
        // console.log('another save sales routine runs');
      }
    }, 8000);
  }

  stop() {
    if (this.salesInterval) {clearInterval(this.salesInterval); }
  }

}
