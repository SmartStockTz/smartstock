importScripts('localforage.min.js');
importScripts('axios.min.js');

let firstFetch = true;

/**
 *
 * @param name{string}
 * @returns {LocalForage}
 * @private
 */
function _getStorage(name) {
  return localforage.createInstance({
    name: name,
    storeName: 'ng_forage'
  });
}

addEventListener('message', ({data}) => {
  let onFetch = false;
  let _stockStorage = _getStorage('ssm');

  setInterval(async () => {
    if (!onFetch) {
      onFetch = true;
      const activeShop = await _stockStorage.getItem('activeShop');
      if (activeShop && activeShop.applicationId && activeShop.projectId && activeShop.projectUrlId) {
        const fetchStockURL =
          `https://smartstock-faas.bfast.fahamutech.com/functions/stocks/sync/${activeShop.projectId}`;
        fetchStocks(activeShop.applicationId, fetchStockURL, _stockStorage).then(done => {
          firstFetch = false;
          onFetch = false;
        }).catch(_ => {
          onFetch = false;
        });
      } else {
        console.log('user not available yet');
      }
    } else {
      // console.log('on fetch');
      // console.log(onFetch);
    }
  }, 5000);
});

/**
 *
 * @param appId {string}
 * @param url {string}
 * @param _stockStorage {LocalForage}
 * @returns {Promise<void>}
 */
async function fetchStocks(appId, url, _stockStorage) {
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
    /*
    will be implemented
     */
    const newProducts = response.data.results;
    if (newProducts && Array.isArray(newProducts) && newProducts.length > 0) {
      if (response.data['lastUpdateTime']) {
        await _stockStorage.setItem('lastUpdate', response.data['lastUpdateTime']);
      }
      const oldProducts = await _stockStorage.getItem('stocks');
      if (!firstFetch && oldProducts && Array.isArray(oldProducts) && oldProducts.length > 0) {
        newProducts.forEach((newProduct) => {
          // console.log('get new entry');
          const indexOld = oldProducts.findIndex(oldProduct => oldProduct.objectId === newProduct.objectId);
          if (indexOld >= 0) {
            oldProducts[indexOld] = newProduct;
          } else {
            oldProducts.push(newProduct);
          }
        });
        await _stockStorage.setItem('stocks', oldProducts);
        postMessage('ssm_stocks_updated');
        return Promise.resolve();
      } else {
        await _stockStorage.setItem('stocks', newProducts);
        postMessage('ssm_stocks_updated');
        return Promise.resolve();
      }
    }
  } catch (e) {
    console.log(e);
    throw {message: 'Fails to update stocks', reason: e.toString()};
  }
}
//
// async function listenForStocks() {
//   const stockStorage = _getStorage('ssm');
//   const activeShop = await stockStorage.getItem('activeShop');
//   console.log(activeShop);
//   if (activeShop && activeShop.projectUrlId && activeShop.applicationId) {
//     const _sock = new WebSocket(`wss://${activeShop.projectUrlId}.bfast.fahamutech.com`);
//     _sock.addEventListener('open', ev => {
//       console.log(ev);
//       console.log('connection established');
//     });
//     _sock.addEventListener("close", ev => {
//       console.log(ev);
//       console.log('connection closed');
//     });
//     _sock.addEventListener('message', (message) => {
//       console.log(message);
//     });
//     _sock.addEventListener("error", ev => {
//       console.log(ev);
//     })
//
//   } else {
//     console.warn('active shop not selected yet')
//   }
// }
//
// listenForStocks();
