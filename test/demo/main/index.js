const { app, BrowserWindow } = require("electron");
require("./allen");
let win;
app.on("ready", () => {
  win = new BrowserWindow();
  win.loadURL(`http://localhost:${process.env.WEB_PORT}`);
});
