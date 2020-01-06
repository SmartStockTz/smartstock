importScripts('localforage.min.js');
importScripts('axios.min.js');
var localStorage = {};
addEventListener('message', ({data}) => {
  console.log(data);
  const appId = JSON.parse(data).appId;
  const projectUrlId = JSON.parse(data).projectUrlId;

  localforage.config({
    name: 'ssmsales',
    storeName: 'ng_forage'
  });

  setInterval(() => {
    localforage.keys().then(keys => {
      if (keys.length > 0) {
        keys.forEach(key => {
          localforage.getItem(key).then(sales => {
            axios({
              baseURL: `https://${projectUrlId}.bfast.fahamutech.com`,
              url: '/batch',
              method: 'post',
              // mode: "cors",
              data: {
                'requests': sales
              },
              headers: {
                'X-Parse-Application-Id': appId,
                'Content-Type': 'application/json'
              }
            }).then(_ => {
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
  }, 5000);

  postMessage("sales routine started");
});
