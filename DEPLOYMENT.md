# GitHub Pages 部署指南

## 项目配置

这个项目已经配置好部署到 GitHub Pages。主要配置包括：

### 1. Vite 配置
- `vite.config.ts` 中设置了正确的 base path：`/multi-block-note2/`
- 在生产环境中会自动使用正确的路径

### 2. Package.json 脚本
- `build`: 构建项目
- `predeploy`: 构建前的预处理
- `deploy`: 使用 gh-pages 部署到 GitHub Pages

### 3. GitHub Actions
- `.github/workflows/deploy.yml` 文件配置了自动部署流程
- 当推送到 main 分支时自动构建并部署

## 部署步骤

### 方法一：自动部署（推荐）
1. 将代码推送到 GitHub 仓库的 main 分支
2. GitHub Actions 会自动构建并部署到 GitHub Pages
3. 访问 `https://dpes8693.github.io/multi-block-note2/`

### 方法二：手动部署
1. 确保已安装依赖：
   ```bash
   pnpm install
   ```

2. 构建项目：
   ```bash
   pnpm run build
   ```

3. 部署到 GitHub Pages：
   ```bash
   pnpm run deploy
   ```

## GitHub Pages 设置

在 GitHub 仓库中：
1. 进入 Settings > Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages" 
4. Folder 选择 "/ (root)"

## 访问地址

部署成功后，项目将在以下地址访问：
- https://dpes8693.github.io/multi-block-note2/

## 注意事项

1. 如果仓库名称不是 `multi-block-note2`，需要修改 `vite.config.ts` 中的 base path
2. 首次部署后可能需要几分钟才能访问
3. 任何推送到 main 分支的代码都会触发自动部署
