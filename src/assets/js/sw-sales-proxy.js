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


addEventListener('message', ({data}) => {

  let _mainStorage = _getStorage('ssm');

  setInterval(() => {

    _mainStorage.getItem('activeShop').then(activeShop => {

      if (!activeShop) {
        // console.log('active shop is not available yet');
        throw 'active shop is not available yet';
      }

      if (activeShop && activeShop.applicationId && activeShop.projectId && activeShop.projectUrlId) {
        let _salesStorage = _getStorage(activeShop.projectId + '_sales');
        _salesStorage.keys().then(keys => {
          if (keys.length > 0) {
            keys.forEach(key => {
              _salesStorage.getItem(key).then(sales => {
                axios.post(`https://smartstock-faas.bfast.fahamutech.com/functions/sales/${activeShop.projectId}`,
                  {
                    'requests': sales
                  },
                  {
                    headers: {
                      'bfast-application-id': 'smartstock_lb',
                      'Content-Type': 'application/json'
                    }
                  }).then(_ => {
                  _salesStorage.removeItem(key).catch(reason => console.log(reason));
                }).catch(reason => {
                  // console.log(reason);
                });
              });
            });
          }
        });
      } else {
        console.log('project required parameters not available yet');
      }

    }).catch(reason => {
      // console.warn(reason);
      // console.log('error when fetch user');
    });

  }, 4000);

  postMessage("sales routine started");

});
