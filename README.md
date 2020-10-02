# vitetron

Develop and build electron project with vite and vue3

## Install

> yarn create vite-app project-name

```bash
yarn add vitetron --dev
```

Add background.js `or background.ts` at the ./src folder

Set the file's content with:

```js
import { app, BrowserWindow } from "electron";
let win;
app.on("ready", () => {
  win = new BrowserWindow();
  vitetron.load(win, "index.html");
});
```

add scripts to your package.json

```json
  "scripts": {
    "start": "vitetron start",
    "release": "vitetron release"
  }
```

run `yarn start` to develope,`yarn release` for build

## Config

todo：

主进程可以调试

vitetron 有 TS 的类型

[] 编译状态下能启动首页

[] vue-cli 移除了哪些依赖

[] 测试一下包含外部引用的主进程入口程序

把 vitetron 对象做成全局的
