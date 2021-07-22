// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')
const $ = require('jquery')

let win;

async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });

  // Load app
  win.loadFile(path.join(__dirname, "index.html"));

  // rest of code..
}

var globalData;
var countries = [];
var globalCountries;

function initializeData()
{
  if (!globalData) 
  {
    fs.readFile(path.join(__dirname, "data.json"), "utf8", (error, data) => {
      // Do something with file contents
      if (error)
      {
        globalData = {
          'countries': {}
        };
      }
      else
      {
        globalData = JSON.parse(data);
      }

      win.webContents.send("setCountries", globalData);
    });
  }
  else 
  {
    win.webContents.send("setCountries", globalData);
  }
}

function initializeCountryData()
{
  if (!globalCountries)
  {
    fs.readFile(path.join(__dirname, "data/countryData.json"), "utf8", (error, data) => {
      var innerStr = "<option selected>Open this select menu</option>";
  
      globalCountries = JSON.parse(data);
  
      globalCountries.forEach(element => {
        if (!countries.includes(element.country))
        {
          countries.push(element.country);
        }
      });

      countries.sort();
  
      for (let i = 0; i < countries.length; i++)
      {
        innerStr += "<option value='" + countries[i] + "'>" + countries[i] + "</option>";
      }
  
      win.webContents.send("getCountries", innerStr);
    });
  }
  else
  {
    var innerStr = "<option selected>Open this select menu</option>";

    for (let i = 0; i < countries.length; i++)
      {
        innerStr += "<option value='" + countries[i] + "'>" + countries[i] + "</option>";
      }
  
      win.webContents.send("getCountries", innerStr);
  }

}

function saveData()
{
  const jsonData = JSON.stringify(globalData);
  fs.writeFile(path.join(__dirname, "data.json"), jsonData, (err) => {
    if (err) throw err;
  });
}

app.on("ready", createWindow);

ipcMain.on("getData", (event, args) => {
    win.webContents.send("getData", globalData);
});

ipcMain.on("getCountries", (event, args) => {
  initializeCountryData();
});

ipcMain.on("updateCountries", (event, args) => {
  globalData.countries[args] = {};
  win.webContents.send("updateCountries", globalData);
  saveData();
});

ipcMain.on("updateCities", (event, args) => {
  if (!globalData.countries[args[0]].cities)
  {
    globalData.countries[args[0]].cities = {};
    globalData.countries[args[0]].cities[args[1]] = {};
  }
  else
  {
    globalData.countries[args[0]].cities[args[1]] = {};
  }
  win.webContents.send("updateCities", globalData.countries[args[0]]);
  saveData();
});

ipcMain.on("setCities", (event, args) => {
  win.webContents.send("setCities", globalData.countries[args]);
});

ipcMain.on("setCountries", (event, args) => {
  initializeData();
});

ipcMain.on("getCities", (event, args) => {

  var cities = [];

  globalCountries.forEach(element => {
    if (element.country == args)
    {
      cities.push(element.name);
    }
  });

  cities.sort();

  var innerStr = "<option selected>Open this select menu</option>";

    for (let i = 0; i < cities.length; i++)
      {
        innerStr += "<option value='" + cities[i] + "'>" + cities[i] + "</option>";
      }
  
      win.webContents.send("getCities", innerStr);
});

