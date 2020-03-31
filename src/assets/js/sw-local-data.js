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
  }, 5000);
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
    /*
    will be implemented
     */
    const newProducts = response.data.results;
    if (newProducts && Array.isArray(newProducts) && newProducts.length > 0) {
      if (response.data['lastUpdateTime']) {
        await _stockStorage.setItem('lastUpdate', response.data['lastUpdateTime']);
      }
      // console.log('start-----------------------------start');
      const oldProducts = await _stockStorage.getItem(projectId + '_stocks');
      if (!firstFetch && oldProducts && Array.isArray(oldProducts) && oldProducts.length > 0) {
        newProducts.forEach((newProduct) => {
          // console.log(newProduct);
          const indexOld = oldProducts.findIndex(oldProduct => oldProduct.objectId === newProduct.objectId);
          if (indexOld >= 0) {
            oldProducts.splice(indexOld, 1);
            //  console.log('removed')
          } else {
            // console.log('skipped');
          }
        });
        // console.log('end-----------------------------end');
        newProducts.forEach(element => {
          oldProducts.push(element);
        });
        await _stockStorage.setItem(projectId + '_stocks', oldProducts);
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
