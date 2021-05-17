const {app, BrowserWindow, Menu} = require('electron');
const njre = require('njre');
const {spawn} = require("child_process");
const {exec} = require("child_process");
const {promisify} = require("util");
const {execSync} = require("child_process");
// const isDevMode = require('electron-is-dev');

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
        // preload: path.join(__dirname, 'node_modules', '@capacitor', 'desktop', 'dist', 'desktop-bridge.js')
      }
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));

    if (splashScreen) {
      await splashScreen.loadFile(__dirname + `/splash_assets/ssm.png`);
      splashScreen.show();
    }

    mainWindow.webContents.on('dom-ready', () => {
      spawn(`ls -lh ${__dirname}/printer/ssmjavapos-0.2.0.jar`, {

      }).on("message", m=>{
        console.log(m);
      });

      //   .then(value => {
      //   console.log(value.toString());
      // }).catch(err => {
      //   console.log(err.toString());
      // }).finally(() => {
      //   mainWindow.show();
      //   if (splashScreen && !splashScreen.closed) {
      //     splashScreen.close();
      //   }
      // });
    });
    mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      require('electron').shell.openExternal(url).catch(_ => {
      });
    });
    if (process.env.EA && process.env.EA.toString() === '1') {
      await mainWindow.loadURL('http://localhost:4200');
    } else {
      await mainWindow.loadFile(__dirname + '/smartstock/index.html');
    }
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
