'use strict'

import { app, BrowserWindow, session, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl, parse as parseUrl, URLSearchParams } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production';

// Set our app configuration
app.config = {};
if ( isDevelopment ) {
  app.config.serverRootUri = 'http://localhost:3000';
}

// Create our main window
// TODO: Move to its own file
let mainWindow;
function createMainWindow() {
  const window = new BrowserWindow({
    width: 320,
    height: 480,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true
    }
  });

  if ( isDevelopment ) {
    window.webContents.openDevTools();
  }

  if ( isDevelopment ) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  ipcMain.on('discord-auth', (event) => {
    const options = {
      modal: true,
      center: true,
      parent: window,
      width: 320,
      height: 480,
      frame: true,
      transparent: false,
      resizable: false,
      maximizable: false,
      skipTaskbar: true,
      show: false,
      webPreferences: {
        nodeIntegration: false
      }
    };

    let closedByUser = true;

    const childWindow = new BrowserWindow(options);
    childWindow.setMenu(null);
    childWindow.setBounds(window.getBounds());

    childWindow.loadURL(`${ app.config.serverRootUri }/discord/auth`);
    childWindow.webContents.on('did-finish-load', () => {
      childWindow.show();
    });

    childWindow.on('close', () => {
      if ( closedByUser === true ) {
        event.sender.send('auth-canceled');
      }
    });

    const onBeforeRedirect = (details) => {
      if ( details.redirectURL.startsWith('http://party-finder/') === true ) {
        const params = new URLSearchParams(parseUrl(details.redirectURL).search);
        if ( params.get('error') != null ) {
          event.sender.send('auth-failed');
        }
        else {
          event.sender.send('discord-auth', { user: JSON.parse(params.get('user')), token: params.get('token') });
        }

        closedByUser = false;
        childWindow.close();
      }
    };
    session.defaultSession.webRequest.onBeforeRedirect(onBeforeRedirect);
  });

  return window;
};

app.on('window-all-closed', app.quit);

app.on('activate', () => {
  if ( mainWindow === null ) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});
