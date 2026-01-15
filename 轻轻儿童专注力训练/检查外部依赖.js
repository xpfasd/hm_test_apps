/**
 * 离线资源检查脚本
 * 用于验证是否有外部资源引用
 * 
 * 使用方法：
 * node 检查外部依赖.js
 */

const fs = require('fs');
const path = require('path');

// 需要检查的外部资源模式
const patterns = [
    /https?:\/\//gi,                    // HTTP/HTTPS 链接
    /\/\/cdn\./gi,                      // CDN引用
    /googleapis\.com/gi,                // Google APIs
    /@import\s+url\([^)]*http/gi,      // CSS @import
    /src=["'][^"']*http/gi,            // HTML src属性
    /href=["'][^"']*http/gi,           // HTML href属性
    /url\([^)]*http/gi,                // CSS url()
    /jsdelivr|unpkg|cdnjs/gi,          // 常见CDN
];

// 排除的文件/目录
const excludePatterns = [
    'node_modules',
    '.git',
    '检查外部依赖.js',
    '浏览器测试脚本.js',
    'test.html',                        // 测试文件可以有localhost引用
];

// 收集问题
const issues = [];
let filesChecked = 0;

/**
 * 检查文件内容
 */
function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // 对于test.html和测试脚本，只检查非localhost的外部链接
    const isTestFile = fileName === 'test.html' || fileName.includes('测试');
    
    patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            // 过滤localhost引用（测试文件允许）
            const validMatches = matches.filter(match => {
                if (isTestFile && match.includes('localhost')) {
                    return false;
                }
                return true;
            });
            
            if (validMatches.length > 0) {
                issues.push({
                    file: filePath,
                    pattern: pattern.toString(),
                    matches: validMatches,
                    count: validMatches.length
                });
            }
        }
    });
    
    filesChecked++;
}

/**
 * 递归扫描目录
 */
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        // 检查是否应该排除
        if (excludePatterns.some(pattern => filePath.includes(pattern))) {
            return;
        }
        
        if (stat.isDirectory()) {
            scanDirectory(filePath);
        } else if (stat.isFile()) {
            // 只检查文本文件
            const ext = path.extname(file).toLowerCase();
            if (['.html', '.css', '.js', '.json', '.md'].includes(ext)) {
                checkFile(filePath);
            }
        }
    });
}

/**
 * 主函数
 */
function main() {
    console.log('🔍 开始检查外部依赖...\n');
    
    const projectDir = __dirname;
    scanDirectory(projectDir);
    
    console.log(`📊 检查完成！共检查 ${filesChecked} 个文件\n`);
    
    if (issues.length === 0) {
        console.log('✅ 恭喜！未发现任何外部资源引用');
        console.log('✅ 本应用是 100% 离线单机版本\n');
        console.log('📦 可以安全地分发和部署：');
        console.log('   • 无需网络连接');
        console.log('   • 无CDN依赖');
        console.log('   • 无外部API调用');
        console.log('   • 完全本地运行\n');
    } else {
        console.log(`⚠️  发现 ${issues.length} 个潜在问题：\n`);
        
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. 文件: ${issue.file}`);
            console.log(`   模式: ${issue.pattern}`);
            console.log(`   匹配数: ${issue.count}`);
            console.log(`   内容: ${issue.matches.join(', ')}`);
            console.log('');
        });
        
        console.log('💡 建议：');
        console.log('   • 下载外部资源到本地');
        console.log('   • 使用本地字体替代在线字体');
        console.log('   • 移除或替换CDN引用\n');
    }
}

// 运行检查
try {
    main();
} catch (error) {
    console.error('❌ 检查过程出错:', error.message);
    console.log('\n💡 提示：请确保在项目根目录运行此脚本');
}

