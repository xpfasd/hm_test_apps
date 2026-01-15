#!/bin/bash

# 专注力训练 - 离线版打包工具 (macOS/Linux)

VERSION="v1.0"
OUTPUT_NAME="专注力训练_${VERSION}_离线版"

echo "========================================"
echo "  专注力训练 - 离线版打包工具"
echo "========================================"
echo ""

echo "📦 开始打包..."
echo ""

# 排除的文件和目录
EXCLUDE_FILES=(
    "*.zip"
    "*.tar.gz"
    "*.bat"
    ".git*"
    "node_modules"
    "检查外部依赖.js"
    "浏览器测试脚本.js"
    "打包分发.sh"
)

# 构建排除参数
EXCLUDE_ARGS=""
for item in "${EXCLUDE_FILES[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude=$item"
done

# 打包
if command -v tar &> /dev/null; then
    echo "✓ 使用 tar 打包"
    tar -czf "${OUTPUT_NAME}.tar.gz" $EXCLUDE_ARGS \
        --exclude="${OUTPUT_NAME}.tar.gz" \
        *.html css js *.md 2>/dev/null || \
    tar -czf "${OUTPUT_NAME}.tar.gz" \
        --exclude="*.zip" --exclude="*.tar.gz" --exclude="*.bat" \
        --exclude=".git*" --exclude="node_modules" \
        --exclude="检查外部依赖.js" --exclude="浏览器测试脚本.js" \
        --exclude="打包分发.sh" \
        *.html css js *.md
    
    # 同时创建ZIP格式（更通用）
    if command -v zip &> /dev/null; then
        echo "✓ 同时创建 ZIP 格式"
        zip -r "${OUTPUT_NAME}.zip" . \
            -x "*.zip" "*.tar.gz" "*.bat" ".git*" "node_modules/*" \
            -x "检查外部依赖.js" "浏览器测试脚本.js" "打包分发.sh" \
            > /dev/null 2>&1
    fi
else
    echo "❌ 未找到打包工具"
    echo "请安装 tar 或 zip"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ 打包完成！"
echo ""

if [ -f "${OUTPUT_NAME}.tar.gz" ]; then
    SIZE=$(du -h "${OUTPUT_NAME}.tar.gz" | cut -f1)
    echo "📦 TAR.GZ 文件: ${OUTPUT_NAME}.tar.gz (${SIZE})"
fi

if [ -f "${OUTPUT_NAME}.zip" ]; then
    SIZE=$(du -h "${OUTPUT_NAME}.zip" | cut -f1)
    echo "📦 ZIP 文件: ${OUTPUT_NAME}.zip (${SIZE})"
fi

echo "📁 当前目录: $(pwd)"
echo ""
echo "🚀 分发说明："
echo "   • 解压文件"
echo "   • 双击 index.html 即可运行"
echo "   • 无需网络连接"
echo "   • 支持所有现代浏览器"
echo ""
echo "📖 详细说明请查看: 离线部署说明.md"
echo "========================================"
echo ""

