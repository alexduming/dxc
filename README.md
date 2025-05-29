# 稻香村库存管理系统

一个专为传统糕点店设计的现代化库存管理系统，具有直观的用户界面和强大的数据分析功能。

## 🌟 功能特色

- **📊 实时仪表盘** - 销售数据、库存状态一目了然
- **📈 数据可视化** - 销售趋势、热销商品图表分析
- **📦 库存管理** - 智能预警、自动补货提醒
- **💰 财务管理** - 收支统计、利润分析
- **📱 响应式设计** - 支持手机、平板、电脑多端使用

## 🚀 在线访问

### 方式一：GitHub Pages（推荐）
访问地址：`https://你的用户名.github.io/dxc`

### 方式二：本地运行
1. 下载项目文件
2. 双击 `index.html` 即可使用

## 📋 部署指南

### GitHub Pages 部署步骤：

1. **创建 GitHub 仓库**
   ```bash
   # 在项目目录下执行
   git init
   git add .
   git commit -m "初始化稻香村库存管理系统"
   ```

2. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/dxc.git
   git branch -M main
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库设置 → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - 点击 Save

4. **访问网站**
   - 等待 2-3 分钟部署完成
   - 访问 `https://你的用户名.github.io/dxc`

## 🛠️ 技术栈

- **前端框架**: 原生 HTML5 + CSS3 + JavaScript
- **图表库**: Chart.js 4.4.9
- **数据存储**: LocalStorage
- **UI设计**: 响应式布局，支持移动端

## 📱 系统截图

- 仪表盘界面：实时数据展示
- 商品管理：产品信息维护
- 库存管理：智能预警系统
- 财务报表：收支分析图表

## 🔧 本地开发

```bash
# 克隆项目
git clone https://github.com/你的用户名/dxc.git

# 进入项目目录
cd dxc

# 直接打开 index.html 或使用本地服务器
python -m http.server 8000
# 或
npx serve .
```

## 📞 技术支持

如有问题，请提交 Issue 或联系开发团队。

## 📄 许可证

MIT License - 可自由使用和修改 