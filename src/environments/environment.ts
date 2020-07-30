// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAlcMxXCZ25jAVWQ5RY98AUsdK5-UP_iew',
    authDomain: 'smart-stock-manager.firebaseapp.com',
    databaseURL: 'https://smart-stock-manager.firebaseio.com',
    projectId: 'smart-stock-manager',
    storageBucket: 'smart-stock-manager.appspot.com',
    messagingSenderId: '23694341104',
  },
  browser: true,
  electron: false,
  android: false,
  printerUrl: 'https://localhost:8080',
  functionsURL: 'http://localhost:3000',  // 'https://smartstock-faas.bfast.fahamutech.com', // 'http://localhost:3000',
  databaseURL: 'https://smartstock-daas.bfast.fahamutech.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
