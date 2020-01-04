importScripts('localforage.min.js');
importScripts('axios.min.js');
addEventListener('message', ({appId, projectUrlId}) => {
  localforage.config({
    name: 'ssm',
    storeName: 'ng_forage'
  });
  setInterval(() => {

  }, 30000);
  postMessage("stock comparison thread started");
});
