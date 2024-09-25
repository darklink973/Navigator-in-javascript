const { app, BrowserWindow, webContents } = require('electron')
const fs = require('fs');
const searchHistory = fs.readFileSync('search_history.json');
const searchHistoryData = JSON.parse(searchHistory);
let mainWindow;
let currentURL = "https://google.com";

const createWindow = () => {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webContents: true,
    width: 800,
    height: 600,
  })
  logEverySeconds(0);
  mainWindow.loadURL(currentURL);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
  console.log("After Adding data",JSON.stringify(searchHistoryData, null, 4));
})

const write = (URL) => {
  try {
    searchHistoryData.search_history.push({
      "url": URL,
    });
    const searchHistoryString = JSON.stringify(searchHistoryData);
    fs.writeFileSync('search_history.json', searchHistoryString, 'utf-8');
    const update_data = fs.readFileSync('search_history.json');
  } catch (error) {
    console.log('An error has occurred ', error)
  }
}

function logEverySeconds(i) {
  setTimeout(() => {
    let date = Date();
    let currentURL = mainWindow.webContents.getURL();
    let search_history = date + ", " + currentURL;
    
    write(search_history);

    logEverySeconds(++i);
  }, 1000)
}

