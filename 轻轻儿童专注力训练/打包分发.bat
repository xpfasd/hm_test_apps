@echo off
chcp 65001 >nul
echo ========================================
echo   专注力训练 - 离线版打包工具
echo ========================================
echo.

set VERSION=v1.0
set OUTPUT_NAME=专注力训练_%VERSION%_离线版

echo 📦 开始打包...
echo.

:: 检查是否安装了7-Zip或WinRAR
where 7z.exe >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ 使用 7-Zip 打包
    7z a -tzip "%OUTPUT_NAME%.zip" * -x!*.zip -x!*.bat -x!*.git* -x!node_modules -x!检查外部依赖.js -x!浏览器测试脚本.js
    goto :success
)

where winrar.exe >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ 使用 WinRAR 打包
    winrar a -afzip -ep1 -r "%OUTPUT_NAME%.zip" * -x*.zip -x*.bat -x*.git* -xnode_modules -x检查外部依赖.js -x浏览器测试脚本.js
    goto :success
)

:: 使用Windows自带的PowerShell压缩
echo ✓ 使用 PowerShell 打包
powershell -Command "Compress-Archive -Path '*.html','css','js','*.md' -DestinationPath '%OUTPUT_NAME%.zip' -Force"
goto :success

:success
echo.
echo ========================================
echo ✅ 打包完成！
echo.
echo 📦 输出文件: %OUTPUT_NAME%.zip
echo 📁 当前目录: %CD%
echo.
echo 🚀 分发说明：
echo    • 解压ZIP文件
echo    • 双击 index.html 即可运行
echo    • 无需网络连接
echo    • 支持所有现代浏览器
echo.
echo 📖 详细说明请查看: 离线部署说明.md
echo ========================================
pause

