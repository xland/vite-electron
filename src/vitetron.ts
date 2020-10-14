import { BrowserWindow, webContents } from "electron";
import { Protocol } from "./vitetron/Protocol";
class Page {
  private protocol: Protocol;
  public load(win: BrowserWindow | webContents, page: string = "index.html") {
    if (process.env.VITETRON === "dev") {
      win.loadURL(`http://localhost:${process.env.WEB_PORT}/${page}`);
    } else {
      win.loadURL(`vitetron://./${page}`);
    }
  }
  constructor() {
    this.protocol = new Protocol();
  }
}
export let page = new Page();
