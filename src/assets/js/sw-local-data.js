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
        postMessage("stock comparison thread started");
      }).catch(reason => {
        onFetch = false;
        postMessage(false);
      });
    } else {
      console.log('on fetch');
      console.log(onFetch);
    }
  }, 180000);
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
  try {
   // if (firstFetch) {
      await localforage.removeItem('lastUpdate');
   // }
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
    await localforage.setItem('lastUpdate', response.data['lastUpdateTime']);
    /*
    will be implemented
     */
    if (response.data.results && Array.isArray(response.data.results) && response.data.results.length > 0) {
      // const oldItems = await localforage.getItem('stocks');
      // if (oldItems && Array.isArray(oldItems) && oldItems.length > 0) {
      //   response.data.results.forEach(newStock => {
      //     oldItems.forEach((oldStock, index, array) => {
      //       if (oldStock.objectId === newStock.objectId) {
      //         oldItems[index] = newStock;
      //       } else {
      //         oldItems.push(newStock);
      //       }
      //     })
      //   });
      // } else {
      await localforage.setItem('stocks', response.data.results);
      // }
    }
    return Promise.resolve();
  } catch (e) {
    console.log(e.response.data);
    throw {message: 'Fails to get stocks', reason: e.response.data.toString()};
  }
}
