import * as bfast from 'bfast';
import {ShopModel} from '../models/shop.model';
import {StockModel} from '../models/stock.model';
import {sha1} from 'crypto-hash';

function run() {
  init();
  startStockSocket().catch(_ => {
  });
}

function init() {
  bfast.init({
    applicationId: 'smartstock_lb',
    projectId: 'smartstock'
  });
}

async function startStockSocket() {
  const smartStockCache = bfast.cache({database: 'smartstock', collection: 'config'});
  const shop: ShopModel = await smartStockCache.get('activeShop');
  bfast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
  bfast.database(shop.projectId).collection('stocks')
    .query()
    .changes(() => {
      console.log('stocks socket connect');
      getMissedStocks(shop).catch(_ => {
        console.log(_);
      });
    }, () => {
      console.log('stocks socket disconnected');
    }).addListener(response => {
    updateLocalStock(response.body, shop).catch(_ => console.log(''));
  });

}

async function getMissedStocks(shop) {
  if (shop && shop.applicationId && shop.projectId) {
    bfast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
    let localStocks: StockModel[] = await bfast.cache({database: 'stocks', collection: shop.projectId}).get('all');
    if (!localStocks) {
      localStocks = [];
    }
    let hashesMap = {};
    for (const value of localStocks) {
      hashesMap[value.id] = await sha1(JSON.stringify(value));
    }
    const missed = await bfast.functions(shop.projectId)
      .request(`https://${shop.projectId}-daas.bfast.fahamutech.com/functions/stocks/sync`)
      .post(hashesMap);
    hashesMap = {};
    for (const value of localStocks) {
      hashesMap[value.id] = value;
    }
    Object.keys(missed).forEach(mKey => {
      if (missed[mKey] === 'DELETE') {
        delete hashesMap[mKey];
      } else {
        hashesMap[mKey] = missed[mKey];
      }
    });
    localStocks = [];
    Object.keys(hashesMap).forEach(value => {
      localStocks.push(hashesMap[value]);
    });
    await bfast.cache({database: 'stocks', collection: shop.projectId}).set('all', localStocks);
  }
}

async function updateLocalStock(body: {
  info?: string,
  change?: {
    name: 'update' | 'create' | 'delete',
    snapshot: any
  }
}, shop: ShopModel) {
  if (body && body.change) {
    const stocksCache = await bfast.cache({database: 'stocks', collection: shop.projectId});
    let localStocks: StockModel[] = await stocksCache.get('all');
    if ((body.change.name === 'create' || 'update') && body.change.snapshot) {
      localStocks = localStocks.filter(x => x.id !== body.change.snapshot.id);
      localStocks.unshift(body.change.snapshot);
      stocksCache.set('all', localStocks);
    } else if (body.change.name === 'delete' && body.change.snapshot) {
      stocksCache.set('all', localStocks.filter(value => value.id !== body.change.snapshot.id));
    }
  }
}

addEventListener('message', async ({data}) => {
  run();
});
