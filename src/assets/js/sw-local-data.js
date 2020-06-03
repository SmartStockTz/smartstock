importScripts('bfast.js');

function run() {
  init();
  startStockSocket()
    .catch(console.log);
}

function init() {
  BFast.init({
    applicationId: 'smartstock_lb', projectId: 'smartstock', cache: {
      enable: true
    }
  });
}

async function startStockSocket() {
  const smartStockCache = BFast.cache({database: 'smartstock', collection: 'config'});
  const shop = await smartStockCache.get('activeShop');
  const event = BFast.functions().event('stocks', () => {
    console.log('stocks socket connect');
    getMissedStocks(shop, smartStockCache);
    event.emit({auth: null, payload: {applicationId: shop?.applicationId, projectId: shop?.projectId}});
  }, () => {
    console.log('stocks socket disconnect');
  });

  event.listener(async data => {
    const smartStockCache = BFast.cache({database: 'smartstock', collection: 'config'});
    const shop = await smartStockCache.get('activeShop');
    updateLocalStock(data.payload ? data.payload : data, shop)
      .catch(console.log);
  });
}

/**
 *
 * @param shop {object}
 * @param smartStockCache {CacheAdapter}
 * @return Promise<void>
 */
async function getMissedStocks(shop, smartStockCache) {
  if (shop && shop.applicationId && shop.projectId) {
    let lastUpdate = await smartStockCache.get('lastUpdate');
    if (lastUpdate) {
      await mergeStocks(shop, lastUpdate, smartStockCache);
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

/**
 *
 * @param shop {object}
 * @param lastUpdate {string}
 * @param smartStockCache
 * @return {Promise<void>}
 */
async function mergeStocks(shop, lastUpdate, smartStockCache) {

  const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});

  BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
  const remoteStocks = await BFast.functions().request(`/functions/stocks/sync/${shop.projectId}?lastUpdateTime=${lastUpdate}`)
    .get();

  if (remoteStocks
    && remoteStocks.lastUpdateTime
    && remoteStocks.projectId
    && remoteStocks.results
    && Array.isArray(remoteStocks.results)
    && remoteStocks.results.length > 0) {
    const localStocks = await stocksCache.get('all');
    const localStockMap = {};
    localStocks.forEach(value => {
      localStockMap[value.objectId] = value;
    });
    remoteStocks.results.forEach(value => {
      localStockMap[value.objectId] = value;
    });
    const newStocks = [];
    Object.keys(localStockMap).forEach(key => {
      newStocks.push(localStockMap[key]);
    });
    await stocksCache.set('all', newStocks);
    await smartStockCache.set('lastUpdate', remoteStocks.lastUpdateTime);
    // console.log(localStocks);
    /// console.log(remoteStocks);
  } else {
    // console.log('no new stocks');
  }
}

/**
 *
 * @param data {object}
 * @param shop {object}
 */
async function updateLocalStock(data, shop) {

// mongodb events
// insert
// delete
// replace
// update

  if (shop && shop.applicationId && shop.projectId && data && data.data) {
    BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
    const stocksCache = BFast.cache({database: 'stocks', collection: shop.projectId});
    const stocks = await stocksCache.get('all');
    const {operationType, fullDocument, documentKey, updateDescription} = data.data;
    switch (operationType) {
      case 'insert':
        fullDocument.objectId = fullDocument['_id'];
        delete fullDocument._id;
        fullDocument.createdAt = fullDocument['_created_at'];
        delete fullDocument._created_at;
        fullDocument.createdAt = fullDocument['_created_at'];
        delete fullDocument._updated_at;
        stocks.push(fullDocument);
        await stocksCache.set('all', stocks);
        return;
      case 'delete':
        await stocksCache.set('all', stocks.filter(stock => stock.objectId !== documentKey['_id']));
        return;
      case 'update':
        await stocksCache.set('all', stocks.map(stock => {
          if (stock.objectId === documentKey['_id']) {
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
          if (stock.objectId === documentKey['_id']) {
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

addEventListener('message', async ({data}) => {
  run();
});
