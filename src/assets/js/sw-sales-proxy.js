importScripts('localforage.min.js');
importScripts('axios.min.js');

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

async function _syncSales() {
  return new Promise(async (resolve, _) => {
    try {
      const _mainStorage = _getStorage('ssm');
      const activeShop = await _mainStorage.getItem('activeShop');
      if (!activeShop) {
        throw 'active shop is not available yet';
      }
      if (activeShop && activeShop.applicationId && activeShop.projectId && activeShop.projectUrlId) {
        let _salesStorage = _getStorage(activeShop.projectId + '_sales');
        const keys = await _salesStorage.keys();
        if (keys.length > 0) {
          for (const key of keys) {
            const sales = await _salesStorage.getItem(key);
            await axios.post(`https://smartstock-faas.bfast.fahamutech.com/functions/sales/${activeShop.projectId}`,
              {
                'requests': sales
              },
              {
                headers: {
                  'bfast-application-id': 'smartstock_lb',
                  'Content-Type': 'application/json'
                }
              });
            await _salesStorage.removeItem(key);
          }
          resolve();
        } else {
          // console.log('project required parameters not available yet');
          setTimeout(() => {
            resolve();
          }, 2000);
        }
      } else {
        setTimeout(() => {
          resolve();
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        resolve();
      }, 2000);
    }
  })
}

addEventListener('message', async ({data}) => {
  let wait = false;
  postMessage("sales routine started");
  while (true) {
    if (wait) {
      // console.log('in wait mode');
    } else {
      wait = true;
      await _syncSales();
      wait = false;
    }
  }
});
