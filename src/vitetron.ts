import { BrowserWindow, webContents } from "electron";
import { Protocol } from "./vitetron/Protocol";
class Page {
  private protocol: Protocol;
  public load(win: BrowserWindow | webContents, url: string) {
    if (process.env.VITETRON === "dev") {
      win.loadURL(`http://localhost:${process.env.WEB_PORT}${url}`);
    } else {
      win.loadURL(`vitetron://./index.html${url}`); //todo 这里不一定兼容vue-router
    }
  }
  constructor() {
    this.protocol = new Protocol();
  }
}
export let page = new Page();
