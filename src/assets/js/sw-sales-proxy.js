// importScripts('localforage.min.js');
// importScripts('axios.min.js');
//
// /**
//  *
//  * @param name{string}
//  * @param store {string | null}
//  * @returns {LocalForage}
//  * @private
//  */
// function _getStorage(name, store=null) {
//   return localforage.createInstance({
//     name: name,
//     storeName: store?store:'ng_forage_DEFAULT'
//   });
// }
//
// async function _syncSales() {
//   return new Promise(async (resolve, _) => {
//     try {
//       const _mainStorage = _getStorage('ssm_DEFAULT_smartstock');
//       const activeShop = await _mainStorage.getItem('activeShop');
//       if (!activeShop) {
//         throw 'active shop is not available yet';
//       }
//       if (activeShop && activeShop.applicationId && activeShop.projectId && activeShop.projectUrlId) {
//         let _salesStorage = _getStorage(activeShop.projectId + '_sales_DEFAULT_smartstock','ng_forage_DEFAULT');
//         const keys = await _salesStorage.keys();
//         if (keys.length > 0) {
//           for (const key of keys) {
//             const sales = await _salesStorage.getItem(key);
//             const response = await axios.post(`https://smartstock-faas.bfast.fahamutech.com/functions/sales/${activeShop.projectId}`,
//               {
//                 'requests': sales
//               },
//               {
//                 headers: {
//                   'bfast-application-id': 'smartstock_lb',
//                   'Content-Type': 'application/json'
//                 }
//               });
//             console.log(response.data);
//             await _salesStorage.removeItem(key);
//           }
//           resolve();
//         } else {
//           // console.log('project required parameters not available yet');
//           setTimeout(() => {
//             resolve();
//           }, 2000);
//         }
//       } else {
//         setTimeout(() => {
//           resolve();
//         }, 2000);
//       }
//     } catch (e) {
//       // console.log(e);
//       setTimeout(() => {
//         resolve();
//       }, 2000);
//     }
//   })
// }
//
// addEventListener('message', async ({data}) => {
//   let wait = false;
//   postMessage("sales routine started");
//   while (true) {
//     if (wait) {
//       // console.log('in wait mode');
//     } else {
//       wait = true;
//       await _syncSales();
//       wait = false;
//     }
//   }
// });
