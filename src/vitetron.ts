import { BrowserWindow, webContents } from "electron";
import { Protocol } from "./Lib/Protocol";
class Vitetron {
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
let vitetron = new Vitetron();
export default vitetron;
