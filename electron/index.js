const {app, BrowserWindow, Menu} = require('electron');
const isDevMode = require('electron-is-dev');

app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;
  let splashScreen = null;

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
    splashScreen = new BrowserWindow({
      show: false,
      width: 400,
      maxWidth: 400,
      height: 400,
      maxHeight: 400,
      center: true,
      modal: true,
      frame: false
    });
    mainWindow = new BrowserWindow({
      height: 700,
      width: 1200,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        // preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
      }
    });

    if (isDevMode) {
      mainWindow.webContents.openDevTools();
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));

    if (splashScreen) {
      await splashScreen.loadFile(__dirname + `/splash_assets/ssm.png`);
      splashScreen.show();
    }
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
      if (splashScreen) {
        splashScreen.close();
      }
    });
    await mainWindow.loadURL(`https://desktop-smartstock.web.app`);
  }

  app.on('ready', createWindow);

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow().catch(console.log);
    }
  });

}
