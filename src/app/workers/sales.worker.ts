import {BFast} from 'bfastjs';

export interface ShopModel {
  businessName: string;
  applicationId: string;
  projectId: string;
  projectUrlId: string;
  category: string;
  settings: {
    saleWithoutPrinter: boolean,
    printerFooter: string,
    printerHeader: string,
    allowRetail: boolean,
    allowWholesale: boolean,
  };
  country?: string;
  region?: string;
  street?: string;
}

export interface StockModel {
  createdAt?: any;
  updatedAt?: any;
  image?: any;
  id?: string;
  _id?: string;
  product: string;
  saleable: boolean | true;
  canExpire?: boolean | true;
  description?: string;
  unit: string;
  category: string;
  type?: 'simple' | 'grouped';
  downloadable: boolean | false;
  downloads: { name: string, type: string, url: string }[];
  stockable: boolean | true;
  purchasable: boolean | true;
  quantity: number;
  wholesaleQuantity: number;
  reorder: number;
  purchase: number;
  retailPrice: number;
  wholesalePrice: any;
  supplier: string;
  expire: string;
}


export interface SalesModel {
  soldBy?: { username: string };
  id?: string;
  idTra?: string;
  date?: any;
  product?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  amount?: number;
  customer?: string;
  cartId?: string; // for retrieve sold items per cart/order
  discount?: number;
  user?: string;
  channel?: string;
  stock?: StockModel;
  batch?: string; // for offline sync
  stockId: string;
}

const SalesWorkerService = {
  async run(): Promise<any> {
    return this.saveSalesAndRemove();
  },

  initiateSmartStock(): void {
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

  async saveSalesAndRemove(): Promise<string> {
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

  async saveSaleAndUpdateStock(sales: {
                                 method: string,
                                 path: string,
                                 body: SalesModel
                               }[],
                               shop: ShopModel,
                               salesCache,
                               key: string): Promise<string> {
    if (sales && Array.isArray(sales) && sales.length > 0) {
      const activeUser = await BFast.auth().currentUser();
      await BFast.database(shop.projectId)
        .transaction()
        .create('sales', sales.filter(x => x.body.stock.saleable === true).map(x => {
          x.body.soldBy = {
            username: activeUser.username
          };
          return x.body;
        }))
        .update('stocks', sales.filter(x => x.body.stock.stockable === true).map(value => {
          return {
            update: {
              $inc: {
                quantity: -Number(value.body.quantity)
              }
            },
            query: {
              id: value.body.stock.id
            }
          };
        })).commit(
          //   {
          //   before: async transactionRequests => {
          //     for (const value of transactionRequests) {
          //       if (value.action === 'create') {
          //         console.log(value.data);
          //         const results = await BFast.database(shop.projectId).collection('sales')
          //           .query()
          //           .equalTo('batch', value.data['batch'])
          //           .find();
          //         if (results && Array.isArray(results) && results.length > 0) {
          //           salesToSave = transactionRequests.filter(x => x.data.batch !== value.batch);
          //         }
          //       }
          //     }
          //     return transactionRequests;
          //   }
          // }
        );
    } else {
      return 'Done';
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
      console.log('another save sales routine runs');
    }
  }, 5000);
});
