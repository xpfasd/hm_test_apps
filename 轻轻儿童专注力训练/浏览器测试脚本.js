// 浏览器控制台测试脚本
// 使用方法：打开 http://localhost:8000/index.html，按F12打开控制台，粘贴此脚本并执行

console.log('🧪 开始自动化测试...');

// 测试1: 检查页面元素
function testPageElements() {
    console.log('\n📋 测试1: 页面元素检查');
    const tests = [
        { name: '标题元素', selector: '.title', expected: true },
        { name: '测试模式复选框', selector: '#testMode', expected: true },
        { name: '星星统计', selector: '#totalStars', expected: true },
        { name: '举报按钮', selector: '#reportBtn', expected: true },
        { name: '项目区域数量', selector: '.game-section', expected: 20 }
    ];
    
    tests.forEach(test => {
        const element = document.querySelector(test.selector);
        const result = !!element === test.expected;
        console.log(`${result ? '✅' : '❌'} ${test.name}: ${result ? '通过' : '失败'}`);
        if (!result) console.error(`   未找到元素: ${test.selector}`);
    });
}

// 测试2: 测试模式功能
function testTestMode() {
    console.log('\n📋 测试2: 测试模式功能');
    const testModeCheckbox = document.getElementById('testMode');
    
    if (!testModeCheckbox) {
        console.error('❌ 测试模式复选框未找到');
        return;
    }
    
    // 测试开启
    testModeCheckbox.checked = true;
    testModeCheckbox.dispatchEvent(new Event('change'));
    console.log('✅ 测试模式已开启');
    
    // 检查localStorage
    const saved = localStorage.getItem('testMode');
    if (saved === 'true') {
        console.log('✅ localStorage保存成功');
    } else {
        console.error('❌ localStorage保存失败');
    }
    
    // 测试关闭
    testModeCheckbox.checked = false;
    testModeCheckbox.dispatchEvent(new Event('change'));
    console.log('✅ 测试模式已关闭');
}

// 测试3: 举报功能
function testReportButton() {
    console.log('\n📋 测试3: 举报功能');
    const reportBtn = document.getElementById('reportBtn');
    
    if (!reportBtn) {
        console.error('❌ 举报按钮未找到');
        return;
    }
    
    reportBtn.click();
    setTimeout(() => {
        const modal = document.getElementById('reportSuccessModal');
        if (modal && modal.classList.contains('active')) {
            console.log('✅ 举报弹窗显示正常');
            // 关闭弹窗
            const closeBtn = modal.querySelector('.btn');
            if (closeBtn) {
                closeBtn.click();
                console.log('✅ 弹窗关闭正常');
            }
        } else {
            console.error('❌ 举报弹窗未显示');
        }
    }, 100);
}

// 测试4: 关卡卡片功能
function testLevelCards() {
    console.log('\n📋 测试4: 关卡卡片功能');
    const levelCards = document.querySelectorAll('.level-card:not(.locked)');
    console.log(`✅ 找到 ${levelCards.length} 个解锁的关卡卡片`);
    
    if (levelCards.length > 0) {
        const firstCard = levelCards[0];
        const href = firstCard.onclick ? '已绑定点击事件' : '未绑定点击事件';
        console.log(`✅ 第一个关卡卡片: ${href}`);
    }
}

// 测试5: 响应式检查
function testResponsive() {
    console.log('\n📋 测试5: 响应式设计检查');
    const container = document.querySelector('.container');
    if (container) {
        const styles = window.getComputedStyle(container);
        const maxWidth = styles.maxWidth;
        console.log(`✅ 容器最大宽度: ${maxWidth}`);
        
        if (maxWidth === '480px') {
            console.log('✅ 响应式最大宽度设置正确');
        } else {
            console.warn(`⚠️  最大宽度为 ${maxWidth}，预期为 480px`);
        }
    }
}

// 测试6: localStorage功能
function testLocalStorage() {
    console.log('\n📋 测试6: localStorage功能');
    try {
        // 测试写入
        localStorage.setItem('test_key', 'test_value');
        const value = localStorage.getItem('test_key');
        localStorage.removeItem('test_key');
        
        if (value === 'test_value') {
            console.log('✅ localStorage读写正常');
        } else {
            console.error('❌ localStorage读写异常');
        }
        
        // 检查进度数据
        const progress = localStorage.getItem('focusGameProgress');
        if (progress) {
            console.log('✅ 项目进度数据存在');
            try {
                const parsed = JSON.parse(progress);
                console.log(`✅ 进度数据解析成功，包含 ${Object.keys(parsed).length} 个项目`);
            } catch (e) {
                console.error('❌ 进度数据解析失败:', e.message);
            }
        } else {
            console.log('ℹ️  暂无进度数据（首次运行）');
        }
    } catch (e) {
        console.error('❌ localStorage测试失败:', e.message);
    }
}

// 测试7: JavaScript函数检查
function testFunctions() {
    console.log('\n📋 测试7: JavaScript函数检查');
    const functions = [
        'getProgress',
        'saveProgress',
        'updateLevelProgress',
        'showModal',
        'closeModal',
        'goHome',
        'retryLevel',
        'nextLevel'
    ];
    
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName} 函数存在`);
        } else {
            console.error(`❌ ${funcName} 函数不存在`);
        }
    });
}

// 测试8: 控制台错误检查
function checkConsoleErrors() {
    console.log('\n📋 测试8: 错误检查');
    // 这个测试需要在控制台手动查看是否有红色错误
    console.log('ℹ️  请手动检查控制台是否有红色错误信息');
    console.log('ℹ️  如果有错误，请记录错误信息和堆栈跟踪');
}

// 运行所有测试
function runAllTests() {
    console.log('═══════════════════════════════════════');
    console.log('   专注力训练项目 - 自动化测试');
    console.log('═══════════════════════════════════════');
    
    testPageElements();
    testTestMode();
    testReportButton();
    testLevelCards();
    testResponsive();
    testLocalStorage();
    testFunctions();
    checkConsoleErrors();
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ 自动化测试完成！');
    console.log('📝 请查看上述结果，并手动测试响应式设计和项目流程');
    console.log('═══════════════════════════════════════');
}

// 自动运行
runAllTests();

// 导出测试函数，方便单独调用
window.runAllTests = runAllTests;
window.testPageElements = testPageElements;
window.testTestMode = testTestMode;
window.testReportButton = testReportButton;

