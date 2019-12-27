importScripts('/assets/js/localforage.min.js');
importScripts('/assets/js/axios.min.js');
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
            axios({
              baseURL: 'https://lbpharmacy-daas.bfast.fahamutech.com',
              url: '/batch',
              method: 'post',
              // mode: "cors",
              data: {
                'requests': value
              },
              headers: {
                'X-Parse-Application-Id': 'lbpharmacy',
                'Content-Type': 'application/json'
              }
            }).then(_ => {
              // console.log(_);
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
  }, 2000);
  postMessage("your request received");
});
