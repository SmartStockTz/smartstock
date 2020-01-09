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

  let _salesStorage = _getStorage('ssmsales');
  let _mainStorage = _getStorage('ssm');

  setInterval(() => {

    _mainStorage.getItem('user').then(user => {
      if (!user) {
        console.log('user is not available yet');
        throw 'user is not available yet';
      }
      if (user && user.applicationId && user.projectId && user.projectUrlId) {
        _salesStorage.keys().then(keys => {
          if (keys.length > 0) {
            keys.forEach(key => {
              _salesStorage.getItem(key).then(sales => {
                axios({
                  baseURL: `https://${user.projectUrlId}.bfast.fahamutech.com`,
                  url: '/batch',
                  method: 'post',
                  // mode: "cors",
                  data: {
                    'requests': sales
                  },
                  headers: {
                    'X-Parse-Application-Id': user.applicationId,
                    'Content-Type': 'application/json'
                  }
                }).then(_ => {
                  _salesStorage.removeItem(key).catch(reason => console.log(reason));
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
