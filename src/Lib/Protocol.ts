import { app, protocol } from "electron";
import * as path from "path";
import fs from "fs";
import { URL } from "url";
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
export class Protocol {
  private regDefaultProtocol(request, respond) {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName);
    let filePath = path.join(__dirname, pathName);
    fs.readFile(filePath, (error, data) => {
      if (error) {
        console.error(`Failed to read ${pathName} on protocol`, error);
      }
      const extension = path.extname(pathName).toLowerCase();
      let mimeType = "";
      if (extension === ".js") {
        mimeType = "text/javascript";
      } else if (extension === ".html") {
        mimeType = "text/html";
      } else if (extension === ".css") {
        mimeType = "text/css";
      } else if (extension === ".svg" || extension === ".svgz") {
        mimeType = "image/svg+xml";
      } else if (extension === ".json") {
        mimeType = "application/json";
      }
      respond({ mimeType, data });
    });
  }
  constructor() {
    app.on("ready", () => {
      protocol.registerBufferProtocol("vitetron", (request, respond) =>
        this.regDefaultProtocol(request, respond)
      );
    });
  }
}
