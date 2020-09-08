const {app, BrowserWindow, Menu} = require('electron');
const isDevMode = require('electron-is-dev');
// const {CapacitorSplashScreen, configCapacitor} = require('@capacitor/electron');

const path = require('path');

app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;

  let splashScreen = null;

  let useSplashScreen = true
  ;

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

  async function createWindow() {
    mainWindow = new BrowserWindow({
      height: 700,
      width: 1200,
      show: false,
      webPreferences: {
        nodeIntegration: true,
       // preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
      }
    });

    // configCapacitor(mainWindow).catch(console.log);

    if (isDevMode) {
      Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
      mainWindow.webContents.openDevTools();
    }

    // if (useSplashScreen) {
    //   splashScreen = new CapacitorSplashScreen(mainWindow);
    //   splashScreen.init();
    // } else {
      await mainWindow.loadURL(`file://${__dirname}/app/smartstock/index.html`);
      mainWindow.on('ready-to-show', ()=>{
        mainWindow.show();
      })
      // mainWindow.webContents.on('dom-ready', () => {
      //   mainWindow.show();
      // });
    // }

  }

  app.on('ready', createWindow);

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized())  mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow().catch(console.log);
    }
  });

}
