const { app, BrowserWindow, Menu } = require('electron');
const isDevMode = require('electron-is-dev');
const { CapacitorSplashScreen, configCapacitor } = require('@capacitor/electron');

const path = require('path');

app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

let mainWindow = null;

let splashScreen = null;

let useSplashScreen = true;

const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: 'Open Dev Tools',
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];

const gotTheLock = app.requestSingleInstanceLock();
if (gotTheLock){

}else {

}

async function createWindow () {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1100,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });

  configCapacitor(mainWindow).catch(console.log);

  if (isDevMode) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    mainWindow.webContents.openDevTools();
  }

  if(useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow);
    splashScreen.init();
  } else {
    await mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow().catch(console.log);
  }
});

// Define any IPC or other custom functionality below here



//
// const {app, BrowserWindow} = require('electron');
// const url = require("url");
// const path = require("path");
//
// app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
// app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
//
// let mainWindow;
//
// const gotTheLock = app.requestSingleInstanceLock();
// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', (event, commandLine, workingDirectory) => {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) {
//         mainWindow.restore();
//       }
//       mainWindow.focus()
//     }
//   });
//
//   app.on('ready', createWindow);
//
//   app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') app.quit();
//   });
//
//   app.on('activate', function () {
//     if (mainWindow === null) createWindow();
//   });
//
// }
//
// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1100,
//     height: 600,
//     center: true,
//     autoHideMenuBar: true,
//     webPreferences: {
//       nodeIntegration: true,
//     }
//   });
//
//   mainWindow.loadURL(
//     url.format({
//       pathname: path.join(__dirname, `./smartstock/index.html`),
//       protocol: "file:",
//       slashes: true,
//     })
//   ).catch(reason => {
//     console.log(reason);
//   });
//   mainWindow.on('closed', function () {
//     mainWindow = null
//   })
// }
