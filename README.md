# 个人网站项目

这是一个简单的个人网站项目，使用HTML、CSS和JavaScript构建。网站具有响应式设计，支持暗色模式，并包含多个交互功能。

## 功能特点

- 响应式设计，适配各种设备屏幕
- 暗色模式支持
- 平滑滚动效果
- 联系表单
- 返回顶部按钮
- 项目展示区域
- 动画效果

## 部署说明

### 本地部署

1. 克隆项目到本地：
```bash
git clone <repository-url>
cd website
```

2. 使用本地服务器运行项目：
   - 如果安装了Python，可以使用：
     ```bash
     python -m http.server 8000
     ```
   - 如果安装了Node.js，可以使用：
     ```bash
     npx serve
     ```

3. 在浏览器中访问 `http://localhost:8000` 或服务器提供的URL

### 在线部署

1. Cloudflare Pages部署：
   - 在Cloudflare Pages中创建新项目
   - 连接您的Git仓库
   - 选择主分支进行部署
   - 等待部署完成

2. GitHub Pages部署：
   - 将代码推送到GitHub仓库
   - 在仓库设置中启用GitHub Pages
   - 选择部署分支和目录
   - 访问生成的GitHub Pages URL

## 自定义修改

1. 修改个人信息：
   - 编辑 `index.html` 中的文本内容
   - 更新联系方式和项目描述

2. 修改样式：
   - 在 `styles.css` 中调整颜色、布局等样式
   - 修改暗色模式配色方案

3. 添加新功能：
   - 在 `script.js` 中添加新的交互功能
   - 确保新功能与现有代码兼容

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- 响应式设计
- CSS Grid 和 Flexbox
- CSS 变量
- Intersection Observer API

## 注意事项

- 确保所有文件在同一目录下
- 测试所有功能在不同浏览器中的兼容性
- 检查响应式设计在各种设备上的表现
- 定期更新内容和维护代码