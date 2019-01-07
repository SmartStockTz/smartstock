// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
//
// const app = admin.initializeApp();
//
// // export const helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });
//
// // const firestore = new Firestore();
// // const settings = {/* your settings... */ timestampsInSnapshots: true};
// // firestore.settings(settings);
// //
// // With this change, timestamps stored in Cloud Firestore will be read back as
// //   Firebase Timestamp objects instead of as system Date objects. So you will also
// // need to update code expecting a Date to instead expect a Timestamp. For example:
// //
// //   // Old:
// //   const date = snapshot.get('created_at');
// // // New:
// // const timestamp = snapshot.get('created_at');
// // const date = timestamp.toDate();
//
// const failedTransaction = function (data: {}) {
//   app.firestore().collection('failures').add({type: 'sales', data: data}).catch(rea => {
//     console.log(rea);
//   });
// };
//
// export const addSales = functions.firestore.document('sales/{saleId}').onCreate((snapshot, context) => {
//   const salesQuantity = snapshot.data().quantity;
//   const documentReference = app.firestore().collection('stocks').doc(snapshot.data().stockId);
//   app.firestore().runTransaction(transaction => {
//     return transaction.get(documentReference).then(value1 => {
//       if (!value1.exists) {
//         throw new Error('Document does not exist!');
//       } else {
//         const newQuantity = Number(<number>value1.get('quantity')) - Number(<number>salesQuantity);
//         transaction.update(documentReference, {quantity: newQuantity});
//       }
//     }, reason1 => {
//       console.log('Fail to get a stock object, reason is : ' + reason1);
//     });
//   }).catch(reas => {
//     failedTransaction(snapshot.data());
//     console.log('transaction fails to execute, reason is :' + reas);
//   }).then(valu => {
//     console.log('transaction complete successful, value returned is : ' + valu);
//   }).catch(() => console.log('obligatory catch'));
// });
