# vite-electron

Create and build electron project with vite and vue3

Install

`yarn add vite-electron --dev`

add scripts to your package.json

```json
  "scripts": {
    "start": "vitetron start",
    "release": "vitetron release"
  }
```

run `yarn start`

todo：

主进程可以调试

vitetron 有 TS 的类型

[] 编译状态下能启动首页

[] vue-cli 移除了哪些依赖

[] 测试一下包含外部引用的主进程入口程序

把 vitetron 对象做成全局的
