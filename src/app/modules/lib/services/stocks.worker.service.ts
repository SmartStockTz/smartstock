import {BFast} from 'bfastjs';
import {ShopModel} from '../models/shop.model';
import {StockModel} from '../../stocks/models/stock.model';

function run() {
  init();
  startStockSocket().catch(_ => console.log(''));
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
  const shop: ShopModel = await smartStockCache.get('activeShop');
  BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
  BFast.database(shop.projectId).collection('stocks')
    .query()
    .changes(() => {
      console.log('stocks socket connect');
      getMissedStocks(shop);
    }, () => {
      console.log('stocks socket disconnected');
    }).addListener(async response => {
    updateLocalStock(response.body, shop).catch(reason => console.log(''));
  });

}


async function getMissedStocks(shop) {
  if (shop && shop.applicationId && shop.projectId) {
    BFast.init({applicationId: shop.applicationId, projectId: shop.projectId}, shop.projectId);
    const stocksCount: number = await BFast.database(shop.projectId).collection('stocks')
      .query()
      .count(true)
      .find();
    let localStocks: StockModel[] = await BFast.cache({database: 'stocks', collection: shop.projectId}).get('all');
    if (!localStocks) {
      localStocks = [];
    }
    const stocks: StockModel[] = await BFast.database(shop.projectId).collection('stocks')
      .query()
      .size(stocksCount)
      .skip(0)
      .notIncludesIn('_id', localStocks.map(value => value.id))
      .notIncludesIn('_updated_at', localStocks.map(value => value.updatedAt))
      .find();
    localStocks.push(...stocks);
    await BFast.cache({database: 'stocks', collection: shop.projectId})
      .set('all', localStocks);
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
    const stocksCache = await BFast.cache({database: 'stocks', collection: shop.projectId});
    if (body.change.name === 'create' && body.change.snapshot) {
      const localStocks: StockModel[] = await stocksCache.get('all');
      localStocks.filter(x => x.id !== body.change.snapshot.id).unshift(body.change.snapshot);
      stocksCache.set('all', localStocks);
    } else if (body.change.name === 'delete' && body.change.snapshot) {
      const localStocks: StockModel[] = await stocksCache.get('all');
      stocksCache.set('all', localStocks.filter(value => value.id !== body.change.snapshot.id));
    } else if (body.change.name === 'update' && body.change.snapshot) {
      const localStocks: StockModel[] = await stocksCache.get('all');
      stocksCache.set('all', localStocks.map(value => {
        if (value.id === body.change.snapshot.id) {
          return body.change.snapshot;
        } else {
          return value;
        }
      }));
    }

  }
}

addEventListener('message', async ({data}) => {
  run();
});
