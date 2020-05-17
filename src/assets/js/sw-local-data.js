importScripts('localforage.min.js');
importScripts('axios.min.js');

let firstFetch = true;

/**
 *
 * @param name{string}
 * @param store {string | null}
 * @returns {LocalForage}
 * @private
 */
function _getStorage(name, store = null) {
  return localforage.createInstance({
    name: name,
    storeName: store ? store : 'ng_forage_DEFAULT'
  });
}

addEventListener('message', ({data}) => {
  let onFetch = false;
  let _stockStorage = _getStorage('ssm_DEFAULT_smartstock');

  setInterval(async () => {
    if (!onFetch) {
      onFetch = true;
      const activeShop = await _stockStorage.getItem('activeShop');
      if (activeShop && activeShop.applicationId && activeShop.projectId && activeShop.projectUrlId) {
        const fetchStockURL =
          `https://smartstock-faas.bfast.fahamutech.com/functions/stocks/sync/${activeShop.projectId}`;
        fetchStocks(activeShop.applicationId, fetchStockURL, _stockStorage, activeShop.projectId).then(done => {
          // postMessage('stock ( s ) updated');
          firstFetch = false;
          onFetch = false;
        }).catch(_ => {
          onFetch = false;
        });
      } else {
        // console.log('user not available yet');
      }
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
 * @param _stockStorage {LocalForage}
 * @param projectId {string}
 * @returns {Promise<void>}
 */
async function fetchStocks(appId, url, _stockStorage, projectId) {
  try {
    // if (firstFetch) {
    //   await _stockStorage.removeItem('lastUpdate');
    // }
    const lastUpdateStamp = await _stockStorage.getItem('lastUpdate');
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

    const newProducts = response.data.results;
    if (newProducts && Array.isArray(newProducts) && newProducts.length > 0) {
      if (response.data['lastUpdateTime']) {
        await _stockStorage.setItem('lastUpdate', response.data['lastUpdateTime']);
      }

      const newData = [];

      const oldProducts = await _stockStorage.getItem(projectId + '_stocks');
      if (oldProducts && Array.isArray(oldProducts) && oldProducts.length > 0) {

        // if (newProducts.length > oldProducts.length) {
        //
        // } else if (newProducts.length < oldProducts.length) {
        //   oldProducts
        // } else if (newProducts.length === oldProducts.length) {
        //
        // }

        newProducts.forEach(newProduct => {
          oldProducts.forEach(oldProduct => {
            if (oldProduct.objectId === newProduct.objectId) {
              newData.push(newProduct);
            } else {
              newData.push(oldProduct);
            }
          });
        });

        await _stockStorage.setItem(projectId + '_stocks', newData);
        postMessage('ssm_stocks_updated');
        return Promise.resolve();
      } else {
        await _stockStorage.setItem(projectId + '_stocks', newProducts);
        postMessage('ssm_stocks_updated');
        return Promise.resolve();
      }
    }
  } catch (e) {
    // console.log(e);
    // throw {message: 'Fails to update stocks', reason: e.toString()};
  }
}
