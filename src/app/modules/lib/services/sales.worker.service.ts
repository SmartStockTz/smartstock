/// <reference lib="webworker" />

import {BFast} from 'bfastjs';
import {ShopModel} from '../models/shop.model';

const SalesWorkerService = {
  async run() {
    this.initiateSmartStock();
    this.saveSalesAndRemove().catch(_ => {
    });
  },

  initiateSmartStock() {
    BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
  },

  async getShops(): Promise<ShopModel[]> {
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
  },

  async saveSalesAndRemove() {
    const shops = await this.getShops();
    for (const shop of shops) {
      BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
      const salesCache = BFast.cache({database: 'sales', collection: shop.projectId});
      const salesKeys: string[] = await salesCache.keys();
      if (salesKeys && Array.isArray(salesKeys)) {
        for (const key of salesKeys) {
          const sales: any[] = await salesCache.get(key);
          if (sales && Array.isArray(sales) && sales.length > 0) {
            await this.saveSaleAndUpdateStock(sales, shop, salesCache, key);
            await salesCache.remove(key, true);
          }
          return 'Done';
        }
      }
    }
  },

  async saveSaleAndUpdateStock(sales: any[], shop: ShopModel, salesCache, key: string) {
    if (sales && Array.isArray(sales) && sales.length > 0) {
      await BFast
        .functions()
        .request(`/functions/sales/${shop.projectId}/${shop.applicationId}`)
        .post({requests: sales});
    } else {
      return 'Done';
    }
  }

};

let shouldRun = true;

addEventListener('message', async ({data}) => {
  console.log('sales worker started');
  setInterval(_ => {
    if (shouldRun === true) {
      shouldRun = false;
      SalesWorkerService.run()
        .then()
        .catch(__ => {
        })
        .finally(() => {
          shouldRun = true;
        });
    } else {
      // console.log('another save sales routine runs');
    }
  }, 10000);
});

