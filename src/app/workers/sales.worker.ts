import * as bfast from 'bfast';
import {ShopModel} from '../models/shop.model';
import {SalesModel} from '../models/sales.model';
import {SmartstockUtil} from '../utils/smartstock.util';

const SalesWorkerService = {
  async run(): Promise<any> {
    return this.saveSalesAndRemove();
  },

  initiateSmartStock(): void {
    bfast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
  },

  async getShops(): Promise<ShopModel[]> {
    try {
      const user = await bfast.auth().currentUser();
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

  async saveSalesAndRemove(): Promise<string> {
    const shops = await this.getShops();
    for (const shop of shops) {
      bfast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
      const salesCache = bfast.cache({database: 'sales', collection: shop.projectId});
      const salesKeys: string[] = await salesCache.keys();
      if (salesKeys && Array.isArray(salesKeys)) {
        for (const key of salesKeys) {
          const sales: any[] = await salesCache.get(key);
          if (sales && Array.isArray(sales) && sales.length > 0) {
            await this.saveSaleAndUpdateStock(sales, shop);
            await salesCache.remove(key, true);
          } else {
            await salesCache.remove(key, true);
          }
        }
      }
    }
    return 'Done';
  },

  async saveSaleAndUpdateStock(
    sales: { method: string, path: string, body: SalesModel }[],
    shop: ShopModel
  ): Promise<string> {
    if (sales && Array.isArray(sales) && sales.length > 0) {
      return bfast.functions(shop.projectId)
        .request(SmartstockUtil.faasToDaasUrl('/functions/sales', shop.projectId))
        .post({
          requests: sales
        });
    } else {
      return 'no sale to sale';
    }
  }

};

let shouldRun = true;

addEventListener('message', async ({data}) => {
  console.log('sales worker started');
  SalesWorkerService.initiateSmartStock();
  setInterval(_ => {
    if (shouldRun === true) {
      shouldRun = false;
      SalesWorkerService.run()
        .then(_1 => {
        })
        .catch(_2 => {
        })
        .finally(() => {
          shouldRun = true;
        });
    } else {
      console.log('another save sales routine run');
    }
  }, 5000);
});
