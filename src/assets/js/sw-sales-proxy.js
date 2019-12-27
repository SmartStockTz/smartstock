importScripts('/assets/js/localforage.min.js');
addEventListener('message', ({data}) => {
  localforage.config({
    name: 'ssmsales',
    storeName: 'ng_forage'
  });
  const intervalSales = setInterval(() => {
    localforage.keys().then(keys => {
      if (keys === null) {

      } else if (keys.length === 0) {

      } else if (keys.length > 0) {
        keys.forEach(key => {
          localforage.getItem(key).then(value => {
            fetch('https://lbpharmacy-daas.bfast.fahamutech.com/batch', {
              method: 'POST',
              body: {
                'requests': value
              },
              headers: {
                'X-Parse-Application-Id': 'lbpharmacy',
                'Content-Type': 'application/json'
              }
            }).then(_ => {
              console.log(_);
              localforage.removeItem(key).catch(reason => console.log(reason));
            }).catch(reason => {
              console.log(reason);
            });
          }).catch(reason => console.log(reason));
        });
      }
    }).catch(reason => {
      console.log(reason);
    });
  }, 1000);
  postMessage("your request received");
});
