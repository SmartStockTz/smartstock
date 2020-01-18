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

    _mainStorage.getItem('user').then(user => {

      if (!user) {
        console.log('user is not available yet');
        throw 'user is not available yet';
      }

      if (user && user.applicationId && user.projectId && user.projectUrlId) {
        let _salesStorage = _getStorage(user.projectId + '_sales');
        _salesStorage.keys().then(keys => {
          if (keys.length > 0) {
            keys.forEach(key => {
              _salesStorage.getItem(key).then(sales => {
                axios.post(`https://smartstock-faas.bfast.fahamutech.com/functions/sales/${user.projectId}`,
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
                  console.log(reason);
                });
              });
            });
          }
        });
      } else {
        console.log('project required parameters not available yet');
      }

    }).catch(reason => {
      console.warn(reason);
      console.log('error when fetch user');
    });

  }, 5000);

  postMessage("sales routine started");

});
