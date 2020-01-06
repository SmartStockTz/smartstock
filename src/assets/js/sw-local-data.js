importScripts('localforage.min.js');
importScripts('axios.min.js');

addEventListener('message', ({data}) => {
  const appId = JSON.parse(data).appId;
  const projectId = JSON.parse(data).projectId;
  const projectUrlId = JSON.parse(data).projectUrlId;
  const serverURL = `https://${projectUrlId}.bfast.fahamutech.com`;
  const fetchStockURL = `https://smartstock-faas.bfast.fahamutech.com/functions/stocks/sync/${projectId}`;
  let firstFetch = true;
  let onFetch = false;

  localforage.config({
    name: 'ssm',
    storeName: 'ng_forage'
  });

  setInterval(() => {
    if (!onFetch) {
      onFetch = true;
      fetchStocks(appId, fetchStockURL, localforage, firstFetch).then(done => {
        firstFetch = false;
        onFetch = false;
        // postMessage("stock comparison thread started");
      }).catch(reason => {
        onFetch = false;
        // postMessage(false);
      });
    } else {
      // console.log('on fetch');
      // console.log(onFetch);
    }
  }, 3000);
});

/**
 *
 * @param appId {string}
 * @param url {string}
 * @param localforage {LocalForage}
 * @param firstFetch {boolean}
 * @returns {Promise<void>}
 */
async function fetchStocks(appId, url, localforage, firstFetch) {
  // console.log(firstFetch);
  try {
    //if (firstFetch) {
    // await localforage.removeItem('lastUpdate');
    //}
    const lastUpdateStamp = await localforage.getItem('lastUpdate');
    let fetchUrl;
    if (lastUpdateStamp) {
      fetchUrl = url + '/?lastUpdateTime=' + lastUpdateStamp;
    } else {
      fetchUrl = url + '/?lastUpdateTime=';
    }
    const response = await axios.get(fetchUrl, {
      headers: {
        'bfast-application-id': 'smartstock_lb',
      }
    });
    /*
    will be implemented
     */
    const newProducts = response.data.results;
    if (newProducts && Array.isArray(newProducts) && newProducts.length > 0) {
      if (response.data['lastUpdateTime']) {
        await localforage.setItem('lastUpdate', response.data['lastUpdateTime']);
      }
      const oldProducts = await localforage.getItem('stocks');
      if (oldProducts && Array.isArray(oldProducts) && oldProducts.length > 0) {
        newProducts.forEach((newProduct) => {
          const indexOld = oldProducts.findIndex(oldProduct => oldProduct.objectId === newProduct.objectId);
          if (indexOld >= 0) {
            oldProducts[indexOld] = newProduct;
          } else {
            oldProducts.push(newProduct);
          }
        });
        await localforage.setItem('stocks', oldProducts);
        window.dispatchEvent(new Event('ssm_stocks_updated'));
        return Promise.resolve();
      } else {
        await localforage.setItem('stocks', newProducts);
        window.dispatchEvent(new Event('ssm_stocks_updated'));
        return Promise.resolve();
      }
    }
  } catch (e) {
    console.log(e.response.data);
    throw {message: 'Fails to update stocks', reason: e.response.data.toString()};
  }
}
