importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js');

const cf_ = {
  apiKey: 'AIzaSyAlcMxXCZ25jAVWQ5RY98AUsdK5-UP_iew',
  authDomain: 'smart-stock-manager.firebaseapp.com',
  databaseURL: 'https://smart-stock-manager.firebaseio.com',
  projectId: 'smart-stock-manager',
  storageBucket: 'smart-stock-manager.appspot.com',
  messagingSenderId: '23694341104',
  appId: '1:23694341104:web:2905c54949c39987eca335',
  measurementId: 'G-GBR0FY21QZ'
}
firebase.initializeApp(cf_);
const messaging = firebase.messaging();
// messaging.getToken({
//   vapidKey: 'BAjyuI_opZiVghN7ixIu7csRcOXNExhhjdfTU0CbUkKwXmc4v_C0X2KA8x5vFSPp3PHdI1-A6Bco-ReFMl7W9gw'
// }).then(token => {
//   console.log(token);
//
// }).catch(console.log);

messaging.onBackgroundMessage(value => {
  // console.log(value, 'BG');
  self.registration.showNotification(value.notification.title, {
    body: value.notification.body,
    image: '/sslogo.png'
    // silent: false,
    // tag: value.collapseKey,
    // renotify: true
  }).then(console.log).catch(console.log);
});
