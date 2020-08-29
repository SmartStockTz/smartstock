/// <reference lib="webworker" />

import {BFast} from 'bfastjs';
import {ShopModel} from '../models/shop.model';

// const SalesWorkerService = {
//   async run() {
//     this.initiateSmartStock();
//     this.saveSalesAndRemove().catch();
//   },
//
//   initiateSmartStock() {
//     BFast.init({applicationId: 'smartstock', projectId: 'smartstock'});
//   },
//
//   async getShops(): Promise<ShopModel[]> {
//     try {
//       const user = await BFast.auth().currentUser();
//       if (user && user.shops && Array.isArray(user.shops)) {
//         const shops = [];
//         user.shops.forEach(element => {
//           shops.push(element);
//         });
//         shops.push({
//           businessName: user.businessName,
//           projectId: user.projectId,
//           applicationId: user.applicationId,
//           projectUrlId: user.projectUrlId,
//           settings: user.settings,
//           street: user.street,
//           country: user.country,
//           region: user.region
//         });
//         return shops;
//       }
//       return [];
//     } catch (e) {
//       return [];
//     }
//   },
//
//   async saveSalesAndRemove() {
//     const shops = await this.getShops();
//     for (const shop of shops) {
//       BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
//       const salesCache = BFast.cache({database: 'sales', collection: shop.projectId});
//       const salesKeys: string[] = await salesCache.keys();
//       if (salesKeys && Array.isArray(salesKeys)) {
//         for (const key of salesKeys) {
//           const sales: any[] = await salesCache.get(key);
//           const transactionResult = await this.saveSaleAndUpdateStock(sales, shop, salesCache, key);
//           await salesCache.remove(key, true);
//           return transactionResult;
//         }
//       }
//     }
//   },
//
//   async saveSaleAndUpdateStock(sales: any[], shop: ShopModel, salesCache, key: string) {
//     const dataToSave = sales.map(sale => sale.body);
//     await BFast
//       .database(shop.projectId)
//       .transaction(false)
//       .createMany('sales', dataToSave)
//       .updateMany('stocks',
//         dataToSave.map(sale => {
//           return {
//             id: sale.stock.id,
//             data: {'quantity': {'__op': 'Increment', 'amount': -sale.quantity}}
//           };
//         })
//       )
//       .commit({
//         before: async transactionModels => {
//           await this.prepareSalesCollection(shop);
//           const salesFromTransactionModel = transactionModels.filter(value =>
//             value.path.toLowerCase() === '/classes/sales' && value.method.toLowerCase() === 'post');
//           for (const sale of salesFromTransactionModel) {
//             const duplicateResults = await BFast.database(shop.projectId)
//               .collection('sales')
//               .query()
//               .find({
//                 filter: {
//                   batch: sale.body.batch
//                 }
//               });
//             if (duplicateResults && Array.isArray(duplicateResults) && duplicateResults.length > 0) {
//               transactionModels = transactionModels.filter(value => value.body.batch !== sale.body.batch);
//               await salesCache.remove(key, true);
//             }
//           }
//           return transactionModels;
//         }
//       });
//   },
//
//   async prepareSalesCollection(shop: ShopModel) {
//     const inits = await BFast
//       .database(shop.projectId)
//       .collection('sales')
//       .query()
//       .find({
//         filter: {
//           'n1m': 'prepare'
//         }
//       });
//     if (inits && Array.isArray(inits) && inits.length > 0) {
//       return;
//     }
//     const t: any = await BFast.database(shop.projectId)
//       .collection('sales')
//       .save({'n1m': 'prepare'});
//     await BFast.database(shop.projectId)
//       .collection('sales')
//       .delete(t.id);
//   },
// };

// let shouldRun = true;

addEventListener('message', async ({data}) => {
  console.log('sales worker started');
  // setInterval(_ => {
  //   if (shouldRun) {
  //     shouldRun = false;
  //     SalesWorkerService.run()
  //       .then()
  //       .catch()
  //       .finally(() => {
  //         shouldRun = true;
  //       });
  //   } else {
  //     // console.log('another save sales routine runs');
  //   }
  // }, 5000);
});

