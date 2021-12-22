const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');

app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
process.env.IS_DESKTOP_SSM = '1';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;
  let splashScreen = null;

  const menuTemplateDev = [
    {
      label: 'Help',
      click() {
        require('electron').shell.openExternal('https://tawk.to/chat/5fe973abdf060f156a90dd77/1eqjunn83').catch(_ => {
        });
      },
    },
    {
      label: 'Privacy',
      click() {
        require('electron').shell.openExternal('https://smartstock.co.tz/privacy').catch(_ => {
        });
      },
    },
    {
      label: 'Options',
      submenu: [
        {
          label: 'Dev Tools',
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
        preload: path.join(__dirname, 'preload.js')
      }
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));

    if (splashScreen) {
      await splashScreen.loadFile(__dirname + `/splash_assets/ssm.png`);
      splashScreen.show();
    }

    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
      if (splashScreen) {
        try{
          splashScreen.close();
        }catch (e){
          console.log(e);
        }
      }
    });
    mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      require('electron').shell.openExternal(url).catch(_ => {
      });
    });
    if (process.env.EA && process.env.EA.toString() === '1') {
      await mainWindow.loadURL('http://localhost:4200');
    } else {
      await mainWindow.loadURL('https://smartstock.co.tz');
      // await mainWindow.loadFile(__dirname + '/smartstock/index.html');
    }
  }

  app.on('ready', createWindow);

  app.on('window-all-closed', function () {
    // if (process.platform !== 'darwin') {
      app.quit();
    // }
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
