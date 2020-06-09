importScripts('bfast.js');

async function run() {
  initiateSmartStock();
  await saveSalesAndRemove();
}

function initiateSmartStock() {
  BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
}

/**
 * get all shops of the current user
 * @return {Promise<{
    businessName: string,
    projectId: string,
    applicationId: string,
    projectUrlId: string,
    settings: Object,
    street: string,
    country: string,
    region: string
  }[]>}
 */
async function getShops() {
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
    // console.warn(e);
    return [];
  }
}

async function saveSalesAndRemove() {
  const shops = await getShops();
  for (const shop of shops) {
    BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
    const salesCache = BFast.cache({database: 'sales', collection: shop.projectId});
    const salesKeys = await salesCache.keys();
    for (const key of salesKeys) {
      const sales = await salesCache.get(key);
      const transactionResult = await saveSaleAndUpdateStock(sales, shop, salesCache, key);
      // console.log(key);
      await salesCache.remove(key, true);
      // console.log(remove);
      // console.log(transactionResult);
      return transactionResult;
    }
  }
}

/**
 *
 * @param sales {any[]}
 * @param shop {object}
 * @param salesCache
 * @param key
 * @return {Promise<void>}
 */
async function saveSaleAndUpdateStock(sales, shop, salesCache, key) {
  const dataToSave = sales.map(sale => sale.body);
  await BFast
    .database(shop.projectId)
    .transaction(false)
    .createMany('sales', dataToSave)
    .updateMany('stocks',
      dataToSave.map(sale => {
        return {
          objectId: sale.stock.objectId,
          data: {"quantity": {"__op": "Increment", "amount": -sale.quantity}}
        }
      })
    )
    .commit({
      before: async transactionModels => {
        await prepareSalesCollection(shop);
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

/**
 *
 * @param shop {object}
 * @return {Promise<void>}
 */
async function prepareSalesCollection(shop) {
  const inits = await BFast
    .database(shop.projectId)
    .collection('sales')
    .query()
    .find({
      filter: {
        "n1m": 'prepare'
      }
    });
  if (inits && Array.isArray(inits) && inits.length > 0) {
    return;
  }
  const t = await BFast.database(shop.projectId)
    .collection('sales')
    .save({'n1m': 'prepare'});
  await BFast.database(shop.projectId)
    .collection('sales')
    .delete(t.objectId);
}

let shouldRun = true;

addEventListener('message', async ({data}) => {
  console.log('sales worker started');
  setInterval(_ => {
    if (shouldRun) {
      shouldRun = false;
      run()
        .then()
        .catch(console.log)
        .finally(_ => {
          shouldRun = true;
        });
    } else {
      // console.log('another save sales routine runs');
    }
  }, 3000);
});
