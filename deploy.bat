@echo off
chcp 65001
echo ========================================
echo 稻香村库存管理系统 - GitHub Pages 部署脚本
echo ========================================
echo.

echo 正在检查 Git 状态...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未安装 Git，请先安装 Git
    echo 下载地址：https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git 已安装

echo.
echo 请输入您的 GitHub 用户名：
set /p username=

echo.
echo 请输入仓库名称（默认：dxc）：
set /p reponame=
if "%reponame%"=="" set reponame=dxc

echo.
echo 配置信息：
echo 用户名：%username%
echo 仓库名：%reponame%
echo 部署后访问地址：https://%username%.github.io/%reponame%
echo.

echo 确认部署？(Y/N)
set /p confirm=
if /i not "%confirm%"=="Y" (
    echo 部署已取消
    pause
    exit /b 0
)

echo.
echo 🚀 开始部署...

echo.
echo 1. 初始化 Git 仓库...
git init

echo.
echo 2. 添加所有文件...
git add .

echo.
echo 3. 创建初始提交...
git commit -m "初始化稻香村库存管理系统"

echo.
echo 4. 设置远程仓库...
git remote add origin https://github.com/%username%/%reponame%.git

echo.
echo 5. 推送到 GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败，可能的原因：
    echo 1. 仓库不存在，请先在 GitHub 创建仓库
    echo 2. 认证失败，请检查 GitHub 账户权限
    echo 3. 网络连接问题
    echo.
    echo 请手动执行以下步骤：
    echo 1. 在 GitHub 创建名为 "%reponame%" 的仓库
    echo 2. 重新运行此脚本
    pause
    exit /b 1
)

echo.
echo ✅ 代码推送成功！
echo.
echo 📋 接下来的步骤：
echo 1. 访问：https://github.com/%username%/%reponame%
echo 2. 进入 Settings → Pages
echo 3. Source 选择 "Deploy from a branch"
echo 4. Branch 选择 "main"
echo 5. 点击 Save
echo 6. 等待 2-3 分钟后访问：https://%username%.github.io/%reponame%
echo.

echo 🎉 部署完成！
echo.
echo 是否打开 GitHub 仓库页面？(Y/N)
set /p openrepo=
if /i "%openrepo%"=="Y" (
    start https://github.com/%username%/%reponame%
)

pause 