# Multi-Column Blocks

```bash
pnpm i react-icons
pnpm i @mantine/core
```

pnpm run dev


## ✅ 已加入 [.gitignore](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 的項目

### 🔧 **TypeScript 相關**

* `*.tsbuildinfo` - TypeScript 增量編譯信息（你之前遇到的問題）

### 📦 **構建和輸出**

* [dist](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) - Vite 構建輸出目錄
* `/dist2` - 額外的構建目錄
* [build/](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) - 通用構建目錄
* `out/` - 輸出目錄

### 🌍 **環境變數**

* `.env` - 環境變數文件
* `.env.local` - 本地環境變數
* `.env.*.local` - 各種環境的本地配置

### 📋 **日誌文件**

* `npm-debug.log*` - npm 調試日誌
* `yarn-debug.log*` - Yarn 調試日誌
* `yarn-error.log*` - Yarn 錯誤日誌
* `pnpm-debug.log*` - pnpm 調試日誌
* `lerna-debug.log*` - Lerna 調試日誌

### 🔄 **運行時數據**

* `pids` - 進程 ID 目錄
* `*.pid` - 進程 ID 文件
* `*.seed` - 種子文件
* `*.pid.lock` - 進程鎖定文件

### 📊 **測試覆蓋率**

* `coverage/` - 測試覆蓋率報告
* `*.lcov` - LCOV 格式的覆蓋率文件

### 🖥️ **操作系統文件**

* `.DS_Store` - macOS 文件系統元數據
* `Thumbs.db` - Windows 縮略圖數據庫
* `ehthumbs.db` - Windows 增強縮略圖

### 🗂️ **臨時文件**

* `*.tmp` - 臨時文件
* `*.temp` - 臨時文件

### 💼 **編輯器/IDE**

* `.idea` - JetBrains IDE 配置
* `.vscode` - VS Code 配置
* `*.suo`, `*.ntvs*`, `*.njsproj`, `*.sln` - Visual Studio 文件
* `*.sw?` - Vim 交換文件

### 📝 **備註項目**

我保留了註釋的選項：

* Source maps (`*.map`, `*.css.map`, `*.js.map`) - 取決於你是否要追蹤調試文件
* Package lock 文件 - 通常保留 [pnpm-lock.yaml](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 以確保依賴版本一致

## 🎯 **建議**

對於你的項目，這個 [.gitignore](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) 現在應該已經覆蓋了所有常見的應該被忽略的文件類型。特別重要的是：

1. ✅ `*.tsbuildinfo` - 已解決你看到的 TypeScript 構建信息文件問題
2. ✅ [dist](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) - 構建輸出不應該被追蹤
3. ✅ [node_modules](vscode-file://vscode-app/c:/Users/dpes8/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) - 依賴包不應該被追蹤
4. ✅ 各種日誌和臨時文件

現在你可以安全地提交更改而不會意外包含不必要的文件！
