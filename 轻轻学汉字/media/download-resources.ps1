# 下载媒体资源脚本 (PowerShell)
# 运行方式: 右键 -> 使用 PowerShell 运行

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 创建目录
New-Item -ItemType Directory -Force -Path "$baseDir\images" | Out-Null
New-Item -ItemType Directory -Force -Path "$baseDir\videos" | Out-Null
New-Item -ItemType Directory -Force -Path "$baseDir\thumbnails" | Out-Null

Write-Host "开始下载资源..." -ForegroundColor Green

# 图片列表
$images = @(
    @{ name = "mountain1.jpg"; url = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" },
    @{ name = "mountain2.jpg"; url = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
    @{ name = "water1.jpg"; url = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400" },
    @{ name = "water2.jpg"; url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    @{ name = "flower1.jpg"; url = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400" },
    @{ name = "flower2.jpg"; url = "https://images.unsplash.com/photo-1518882605630-8a6bf0fdfad6?w=400" },
    @{ name = "tree1.jpg"; url = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400" },
    @{ name = "tree2.jpg"; url = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400" },
    @{ name = "bird1.jpg"; url = "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400" },
    @{ name = "bird2.jpg"; url = "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=400" },
    @{ name = "default1.jpg"; url = "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=400" },
    @{ name = "default2.jpg"; url = "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400" }
)

# 缩略图列表
$thumbnails = @(
    @{ name = "mountain1_thumb.jpg"; url = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200" },
    @{ name = "water1_thumb.jpg"; url = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200" },
    @{ name = "default1_thumb.jpg"; url = "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=200" }
)

# 下载图片
foreach ($img in $images) {
    $path = "$baseDir\images\$($img.name)"
    Write-Host "下载: $($img.name)..."
    try {
        Invoke-WebRequest -Uri $img.url -OutFile $path -UseBasicParsing
        Write-Host "  ✓ 完成" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ 失败: $_" -ForegroundColor Red
    }
}

# 下载缩略图
foreach ($thumb in $thumbnails) {
    $path = "$baseDir\thumbnails\$($thumb.name)"
    Write-Host "下载: $($thumb.name)..."
    try {
        Invoke-WebRequest -Uri $thumb.url -OutFile $path -UseBasicParsing
        Write-Host "  ✓ 完成" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ 失败: $_" -ForegroundColor Red
    }
}

# 下载视频
$videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"
$videoPath = "$baseDir\videos\sample.mp4"
Write-Host "下载: sample.mp4..."
try {
    Invoke-WebRequest -Uri $videoUrl -OutFile $videoPath -UseBasicParsing
    Write-Host "  ✓ 完成" -ForegroundColor Green
} catch {
    Write-Host "  ✗ 失败: $_" -ForegroundColor Red
}

Write-Host "`n所有资源下载完成!" -ForegroundColor Cyan
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
