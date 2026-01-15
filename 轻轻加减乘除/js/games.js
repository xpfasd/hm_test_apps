// 数学小游戏管理系统
class MathGamesManager {
    constructor() {
        this.games = this.initGames();
        this.currentGame = null;
        this.gameScore = 0;
        this.gameTimer = null;
        this.mobileObserver = null;
        this.headerScrollHandler = null;
        this.scoreObserver = null;
        this.scoreBumpTimer = null;
    }
    
    // 初始化30个数学小游戏
    initGames() {
        const list = [
            // 逻辑思维类
            { id: 1, name: '数字推理', icon: '🔢', category: 'logic', difficulty: '简单', desc: '找出数字规律', color: '#FF6B6B' },
            { id: 2, name: '数独挑战', icon: '🎯', category: 'logic', difficulty: '困难', desc: '填充9x9数独', color: '#4ECDC4' },
            { id: 3, name: '数字迷宫', icon: '🌀', category: 'logic', difficulty: '中等', desc: '找到正确路径', color: '#45B7D1' },
            { id: 4, name: '逻辑方阵', icon: '⬛', category: 'logic', difficulty: '中等', desc: '完成逻辑方阵', color: '#96CEB4' },
            { id: 5, name: '数字接龙', icon: '🔗', category: 'logic', difficulty: '简单', desc: '连接相邻数字', color: '#FFEAA7' },
            
            // 速算挑战类
            { id: 6, name: '心算大师', icon: '🧠', category: 'speed', difficulty: '中等', desc: '快速心算挑战', color: '#DFE6E9' },
            { id: 7, name: '24点游戏', icon: '🎴', category: 'speed', difficulty: '困难', desc: '用4张牌凑24', color: '#FDCB6E' },
            { id: 8, name: '速算接力', icon: '🏃', category: 'speed', difficulty: '简单', desc: '连续快速计算', color: '#6C5CE7' },
            { id: 9, name: '口算PK', icon: '⚔️', category: 'speed', difficulty: '中等', desc: '与AI比拼速度', color: '#A29BFE' },
            { id: 10, name: '数字雨', icon: '🌧️', category: 'speed', difficulty: '简单', desc: '抓住下落数字', color: '#74B9FF' },
            
            // 益智解谜类
            { id: 11, name: '数字华容道', icon: '🎲', category: 'puzzle', difficulty: '困难', desc: '移动数字排序', color: '#FF7675' },
            { id: 12, name: '魔方数字', icon: '🎪', category: 'puzzle', difficulty: '中等', desc: '还原数字魔方', color: '#FD79A8' },
            { id: 13, name: '数字拼图', icon: '🧩', category: 'puzzle', difficulty: '简单', desc: '拼接数字图片', color: '#FDCB6E' },
            { id: 14, name: '算式填空', icon: '📝', category: 'puzzle', difficulty: '中等', desc: '补充完整算式', color: '#00B894' },
            { id: 15, name: '天平称重', icon: '⚖️', category: 'puzzle', difficulty: '困难', desc: '平衡两边重量', color: '#00CEC9' },
            
            // 记忆训练类
            { id: 16, name: '数字记忆', icon: '🎭', category: 'memory', difficulty: '中等', desc: '记住数字序列', color: '#E17055' },
            { id: 17, name: '翻牌配对', icon: '🃏', category: 'memory', difficulty: '简单', desc: '翻开相同数字', color: '#FDCB6E' },
            { id: 18, name: '闪电记忆', icon: '⚡', category: 'memory', difficulty: '困难', desc: '瞬间记忆数字', color: '#00B894' },
            { id: 19, name: '序列复现', icon: '🔄', category: 'memory', difficulty: '中等', desc: '重现数字序列', color: '#00CEC9' },
            { id: 20, name: '位置记忆', icon: '📍', category: 'memory', difficulty: '简单', desc: '记住数字位置', color: '#0984E3' },
            
            // 空间想象类
            { id: 21, name: '立体几何', icon: '📐', category: 'visual', difficulty: '困难', desc: '计算立体图形', color: '#6C5CE7' },
            { id: 22, name: '图形计数', icon: '🔺', category: 'visual', difficulty: '中等', desc: '数出隐藏图形', color: '#A29BFE' },
            { id: 23, name: '对称图形', icon: '💠', category: 'visual', difficulty: '简单', desc: '找出对称轴', color: '#74B9FF' },
            { id: 24, name: '旋转方块', icon: '🔄', category: 'visual', difficulty: '中等', desc: '旋转匹配图形', color: '#0984E3' },
            { id: 25, name: '七巧板', icon: '🔷', category: 'visual', difficulty: '中等', desc: '拼出指定图形', color: '#00CEC9' },
            
            // 综合挑战类
            { id: 26, name: '数学大富翁', icon: '🎩', category: 'all', difficulty: '中等', desc: '答题赢金币', color: '#FDCB6E' },
            { id: 27, name: '数字消消乐', icon: '💎', category: 'all', difficulty: '简单', desc: '消除相同数字', color: '#E17055' },
            { id: 28, name: '算术塔防', icon: '🏰', category: 'all', difficulty: '困难', desc: '计算防御敌人', color: '#00B894' },
            { id: 29, name: '数学闯关', icon: '🚀', category: 'all', difficulty: '中等', desc: '通过数学关卡', color: '#6C5CE7' },
            { id: 30, name: '脑力风暴', icon: '🌪️', category: 'all', difficulty: '困难', desc: '综合能力测试', color: '#FF6B6B' }
        ];
        const hidden = new Set(['脑力风暴','算术塔防','数字消消乐','七巧板','对称图形','数字接龙','数字雨','天平称重','翻牌配对']);
        return list.filter(g => !hidden.has(g.name));
    }
    
    // 显示游戏列表
    showGamesList(category = 'all') {
        const grid = document.getElementById('gamesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const filteredGames = category === 'all' 
            ? this.games 
            : this.games.filter(g => g.category === category);
        
        filteredGames.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.style.background = `linear-gradient(135deg, ${game.color}, ${this.lightenColor(game.color)})`;
            card.onclick = () => this.startGame(game.id);
            
            const difficultyColor = {
                '简单': '#4CAF50',
                '中等': '#FF9800',
                '困难': '#F44336'
            };

// 顶栏滚动效果：微收缩与阴影强化
MathGamesManager.prototype.initHeaderScrollEffect = function() {
    const header = document.querySelector('#gamePage .game-header');
    if (!header) return;
    // 先移除旧的监听
    if (this.headerScrollHandler) {
        try { window.removeEventListener('scroll', this.headerScrollHandler); } catch (e) {}
    }
    const handler = () => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (y > 8) header.classList.add('compact'); else header.classList.remove('compact');
    };
    this.headerScrollHandler = handler;
    window.addEventListener('scroll', handler, { passive: true });
    // 初始化一次
    handler();
};

// 分数变化微动画：MutationObserver监听数值变更
MathGamesManager.prototype.setupScoreObserver = function() {
    const pill = document.querySelector('#gamePage .game-score');
    const scoreNode = document.getElementById('gameScore');
    if (!pill || !scoreNode) return;
    if (this.scoreObserver) {
        try { this.scoreObserver.disconnect(); } catch (e) {}
        this.scoreObserver = null;
    }
    const obs = new MutationObserver(() => {
        pill.classList.remove('bump');
        // 触发重绘后再加class，确保动画可重复触发
        void pill.offsetWidth;
        pill.classList.add('bump');
        if (this.scoreBumpTimer) clearTimeout(this.scoreBumpTimer);
        this.scoreBumpTimer = setTimeout(() => pill.classList.remove('bump'), 320);
    });
    obs.observe(scoreNode, { childList: true, characterData: true, subtree: true });
    this.scoreObserver = obs;
};
            
            card.innerHTML = `
                <div class="game-icon">${game.icon}</div>
                <div class="game-name">${game.name}</div>
                <div class="game-desc">${game.desc}</div>
                <div class="game-difficulty" style="background: ${difficultyColor[game.difficulty]}">
                    ${game.difficulty}
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
    
    // 开始游戏
    startGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return;
        
        this.currentGame = game;
        this.gameScore = 0;
        
        // 显示游戏页面
        app.showPage('gamePage');
        // 设置标题与图标
        const titleEl = document.getElementById('gameTitle');
        if (titleEl) {
            titleEl.textContent = game.name;
            titleEl.setAttribute('data-icon', game.icon || '🎮');
            const catMap = { logic: '逻辑思维', speed: '速算挑战', puzzle: '益智解谜', memory: '记忆训练', visual: '空间想象', all: '综合挑战' };
            const subtitle = `${catMap[game.category] || '小游戏'} · 难度：${game.difficulty}`;
            titleEl.setAttribute('data-subtitle', subtitle);
        }
        // 设置标题栏渐变/芯片颜色（基于当前游戏主题色）
        const headerEl = document.querySelector('#gamePage .game-header');
        if (headerEl) {
            headerEl.style.setProperty('--header-start', game.color);
            headerEl.style.setProperty('--header-end', this.lightenColor(game.color));
            headerEl.style.setProperty('--chip-start', this.lightenColor(game.color));
            headerEl.style.setProperty('--chip-end', this.lightenColor(this.lightenColor(game.color)));
        }
        const scoreEl = document.getElementById('gameScore');
        if (scoreEl) scoreEl.textContent = '0';
        
        // 根据游戏ID加载对应的游戏
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = '';
        
        // 加载具体游戏（使用gameImplementations对象）
        if (gameImplementations[gameId]) {
            gameImplementations[gameId].call(this);
            setTimeout(() => this.applyMobilePolish(), 0);
            this.setupMobileObserver();
            this.initHeaderScrollEffect();
            this.setupScoreObserver();
        } else {
            this.loadComingSoon(game);
        }
    }
    
    // 即将推出
    loadComingSoon(game) {
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="coming-soon">
                <div class="game-icon-large">${game.icon}</div>
                <h2>${game.name}</h2>
                <p>${game.desc}</p>
                <div class="coming-soon-message">
                    <p>🚀 游戏正在开发中</p>
                    <p>敬请期待更多精彩内容！</p>
                </div>
                <button onclick="backToGameList()" class="btn-primary">返回游戏列表</button>
            </div>
        `;
        // 同步标题栏主题与图标
        const titleEl = document.getElementById('gameTitle');
        if (titleEl) {
            titleEl.textContent = game.name;
            titleEl.setAttribute('data-icon', game.icon || '🎮');
            const catMap = { logic: '逻辑思维', speed: '速算挑战', puzzle: '益智解谜', memory: '记忆训练', visual: '空间想象', all: '综合挑战' };
            const subtitle = `${catMap[game.category] || '小游戏'} · 难度：${game.difficulty}`;
            titleEl.setAttribute('data-subtitle', subtitle);
        }
        const headerEl = document.querySelector('#gamePage .game-header');
        if (headerEl) {
            headerEl.style.setProperty('--header-start', game.color);
            headerEl.style.setProperty('--header-end', this.lightenColor(game.color));
            headerEl.style.setProperty('--chip-start', this.lightenColor(game.color));
            headerEl.style.setProperty('--chip-end', this.lightenColor(this.lightenColor(game.color)));
        }
        setTimeout(() => this.applyMobilePolish(), 0);
        this.setupMobileObserver();
        this.initHeaderScrollEffect();
        this.setupScoreObserver();
    }
    
    // 辅助函数
    lightenColor(color) {
        return color.replace(/[0-9A-F]/gi, (match) => {
            const val = parseInt(match, 16);
            return Math.min(15, val + 3).toString(16);
        });
    }
    
    getNumberColor(num) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        return colors[num - 1];
    }
    
    // 清理游戏资源
    cleanup() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        if (this.mobileObserver) {
            try { this.mobileObserver.disconnect(); } catch (e) {}
            this.mobileObserver = null;
        }
        if (this.headerScrollHandler) {
            try { window.removeEventListener('scroll', this.headerScrollHandler, { passive: true }); } catch (e) { window.removeEventListener('scroll', this.headerScrollHandler); }
            this.headerScrollHandler = null;
        }
        if (this.scoreObserver) {
            try { this.scoreObserver.disconnect(); } catch (e) {}
            this.scoreObserver = null;
        }
        if (this.scoreBumpTimer) {
            clearTimeout(this.scoreBumpTimer);
            this.scoreBumpTimer = null;
        }
    }
}

MathGamesManager.prototype.applyMobilePolish = function() {
    const container = document.getElementById('gameContainer');
    if (!container) return;
    // back buttons
    document.querySelectorAll('.game-header .back-btn, .page-header .back-btn').forEach(btn => btn.classList.add('tappable'));
    const btns = container.querySelectorAll('button');
    const map = [
        ['提交', '确定'],
        ['验证', '确定'],
        ['开始', '开始游戏'],
        ['新题目', '换一题'],
        ['新题', '换一题'],
        ['检查', '检查答案'],
        ['提示', '小提示'],
        ['重置', '重置']
    ];
    btns.forEach(btn => {
        btn.classList.add('tappable');
        const t = btn.innerText.trim();
        map.forEach(([k, v]) => {
            if (t === k) {
                btn.innerText = v;
            }
        });
        const txt = btn.innerText;
        if ((/确定|提交|验证/).test(txt) && !txt.includes('✅')) btn.innerText = txt + ' ✅';
        else if ((/开始/).test(txt) && !txt.includes('▶️')) btn.innerText = txt + ' ▶️';
        else if ((/提示/).test(txt) && !txt.includes('💡')) btn.innerText = txt + ' 💡';
        else if ((/换一题|新题/).test(txt) && !txt.includes('🔄')) btn.innerText = txt + ' 🔄';
        else if ((/检查/).test(txt) && !txt.includes('🔍')) btn.innerText = txt + ' 🔍';
    });
    const nums = container.querySelectorAll('input[type="number"]');
    nums.forEach(inp => {
        const skip = inp.classList.contains('sudoku-cell') || inp.classList.contains('magic-cell');
        inp.setAttribute('inputmode', 'numeric');
        inp.setAttribute('pattern', '[0-9]*');
        inp.setAttribute('autocomplete', 'off');
        if (!skip) {
            inp.classList.add('mobile-input');
            if (!inp.placeholder || inp.placeholder === '输入答案') inp.placeholder = '请输入答案';
            inp.style.fontSize = '16px';
        }
    });
    const texts = container.querySelectorAll('input[type="text"]');
    texts.forEach(inp => {
        inp.classList.add('mobile-input');
        inp.setAttribute('autocomplete', 'off');
        inp.style.fontSize = '16px';
        const ph = inp.getAttribute('placeholder') || '';
        if (ph.startsWith('输入')) {
            inp.setAttribute('placeholder', '请输入' + ph.slice(2));
        }
    });
};

MathGamesManager.prototype.setupMobileObserver = function() {
    const target = document.getElementById('gameContainer');
    if (!target) return;
    if (this.mobileObserver) {
        try { this.mobileObserver.disconnect(); } catch (e) {}
        this.mobileObserver = null;
    }
    let scheduled = false;
    this.mobileObserver = new MutationObserver((mutations) => {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(() => {
                this.applyMobilePolish();
                scheduled = false;
            });
        }
    });
    this.mobileObserver.observe(target, { childList: true, subtree: true });
};

// 游戏实现对象
const gameImplementations = {
    // 游戏1: 数字推理
    1: function() {
        const patterns = [
            { sequence: [2, 4, 6, 8], answer: 10, rule: '等差数列 +2' },
            { sequence: [1, 2, 4, 8], answer: 16, rule: '等比数列 ×2' },
            { sequence: [1, 1, 2, 3, 5], answer: 8, rule: '斐波那契数列' },
            { sequence: [3, 6, 9, 12], answer: 15, rule: '3的倍数' },
            { sequence: [5, 10, 15, 20], answer: 25, rule: '5的倍数' }
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="pattern-game">
                <h3>找出数字规律，填入下一个数字</h3>
                <div class="pattern-sequence">
                    ${pattern.sequence.map(n => `<span class="pattern-number">${n}</span>`).join('')}
                    <span class="pattern-answer">?</span>
                </div>
                <div class="pattern-input">
                    <input type="number" id="patternAnswer" placeholder="输入答案">
                    <button onclick="checkPatternAnswer(${pattern.answer}, '${pattern.rule}')">提交</button>
                </div>
                <div id="patternFeedback"></div>
            </div>
        `;
    },
    
    // 游戏6: 心算大师
    6: function() {
        let score = 0;
        let timeLeft = 60;
        
        const generateQuestion = () => {
            const ops = ['+', '-', '×'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            let a, b, answer;
            
            switch(op) {
                case '+':
                    a = Math.floor(Math.random() * 50) + 1;
                    b = Math.floor(Math.random() * 50) + 1;
                    answer = a + b;
                    break;
                case '-':
                    a = Math.floor(Math.random() * 50) + 20;
                    b = Math.floor(Math.random() * a);
                    answer = a - b;
                    break;
                case '×':
                    a = Math.floor(Math.random() * 12) + 1;
                    b = Math.floor(Math.random() * 12) + 1;
                    answer = a * b;
                    break;
            }
            
            return { question: `${a} ${op} ${b} = ?`, answer };
        };
        
        let currentQuestion = generateQuestion();
        
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="mental-math-game">
                <div class="game-timer">时间: <span id="timeLeft">60</span>秒</div>
                <div class="game-score">得分: <span id="mentalScore">0</span></div>
                <div class="math-question" id="mathQuestion">${currentQuestion.question}</div>
                <div class="math-input">
                    <input type="number" id="mathAnswer" placeholder="输入答案" onkeypress="if(event.key==='Enter')submitMathAnswer()">
                    <button onclick="submitMathAnswer()">提交</button>
                </div>
                <div id="mathFeedback"></div>
            </div>
        `;
        
        window.currentMathAnswer = currentQuestion.answer;
        window.generateNewQuestion = generateQuestion;
        
        this.gameTimer = setInterval(() => {
            timeLeft--;
            document.getElementById('timeLeft').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(this.gameTimer);
                showAlert(`游戏结束！得分: ${score}`, '心算大师');
            }
        }, 1000);
    }
};

// 创建游戏管理器实例
const gamesManager = new MathGamesManager();

// 全局函数
function showMathGames() {
    app.showPage('mathGamesPage');
    gamesManager.showGamesList();
    // polish category buttons for touch
    document.querySelectorAll('#mathGamesPage .category-btn').forEach(b => b.classList.add('tappable'));
    
    // 初始化标签栏滚动效果
    initCategoryScroll();
}

// 标签栏滚动效果
function initCategoryScroll() {
    const categoriesContainer = document.querySelector('.games-categories');
    if (!categoriesContainer) return;
    
    // 更新渐变遮罩显示状态
    function updateScrollGradients() {
        const scrollLeft = categoriesContainer.scrollLeft;
        const scrollWidth = categoriesContainer.scrollWidth;
        const clientWidth = categoriesContainer.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        // 如果内容宽度小于容器宽度，不显示任何遮罩
        if (maxScroll <= 0) {
            categoriesContainer.style.setProperty('--left-fade-opacity', '0');
            categoriesContainer.style.setProperty('--right-fade-opacity', '0');
            return;
        }
        
        // 左侧遮罩：滚动位置 > 10px 时显示
        const leftOpacity = scrollLeft > 10 ? '1' : '0';
        categoriesContainer.style.setProperty('--left-fade-opacity', leftOpacity);
        
        // 右侧遮罩：未滚动到底部时显示
        const rightOpacity = scrollLeft < maxScroll - 10 ? '1' : '0';
        categoriesContainer.style.setProperty('--right-fade-opacity', rightOpacity);
    }
    
    // 监听滚动事件
    categoriesContainer.addEventListener('scroll', updateScrollGradients);
    
    // 初始化时更新一次
    setTimeout(updateScrollGradients, 100);
    
    // 窗口大小改变时重新计算
    window.addEventListener('resize', updateScrollGradients);
}

function filterGames(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    gamesManager.showGamesList(category);
}

function backToGameList() {
    gamesManager.cleanup();
    app.showPage('mathGamesPage');
}

// 游戏交互函数
function checkPatternAnswer(correctAnswer, rule) {
    const userAnswer = parseInt(document.getElementById('patternAnswer').value);
    const feedback = document.getElementById('patternFeedback');
    
    if (userAnswer === correctAnswer) {
        feedback.innerHTML = `<div class="success">✅ 正确！规律是：${rule}</div>`;
        gamesManager.gameScore += 100;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        
        setTimeout(() => {
            gameImplementations[1]();
        }, 2000);
    } else {
        feedback.innerHTML = `<div class="error">❌ 再想想看</div>`;
    }
}

function submitMathAnswer() {
    const userAnswer = parseInt(document.getElementById('mathAnswer').value);
    const feedback = document.getElementById('mathFeedback');
    
    if (userAnswer === window.currentMathAnswer) {
        feedback.innerHTML = '<div class="success">✅ 正确！</div>';
        const scoreElement = document.getElementById('mentalScore');
        const currentScore = parseInt(scoreElement.textContent);
        scoreElement.textContent = currentScore + 10;
        
        const newQuestion = window.generateNewQuestion();
        window.currentMathAnswer = newQuestion.answer;
        document.getElementById('mathQuestion').textContent = newQuestion.question;
        document.getElementById('mathAnswer').value = '';
        document.getElementById('mathAnswer').focus();
    } else {
        feedback.innerHTML = '<div class="error">❌ 错误</div>';
    }
}
