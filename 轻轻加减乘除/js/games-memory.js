// 记忆训练类游戏实现

// 游戏16: 数字记忆
function loadMemoryGame() {
    window.memoryGame = {
        level: 1,
        score: 0,
        sequence: [],
        userSequence: []
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="memory-game">
            <h3>数字记忆</h3>
            <div class="memory-level">等级: <span id="memoryLevel">1</span> (记住<span id="memoryLength">4</span>个数字)</div>
            <div class="memory-score">得分: <span id="memoryScore">0</span></div>
            <div class="memory-display" id="memoryDisplay"></div>
            <div class="memory-input" id="memoryInputArea" style="display: none;">
                <input type="text" id="memoryAnswer" placeholder="输入你记住的数字" maxlength="10">
                <button onclick="checkMemoryAnswer()">提交</button>
            </div>
            <div class="memory-controls">
                <button id="startMemoryBtn" onclick="startMemoryRound()">开始</button>
            </div>
            <div id="memoryFeedback"></div>
        </div>
    `;
}

function startMemoryRound() {
    const game = window.memoryGame;
    const length = 3 + game.level;
    
    // 生成随机数字序列
    game.sequence = [];
    for (let i = 0; i < length; i++) {
        game.sequence.push(Math.floor(Math.random() * 10));
    }
    
    // 显示序列
    const display = document.getElementById('memoryDisplay');
    const controls = document.querySelector('.memory-controls');
    const inputArea = document.getElementById('memoryInputArea');
    
    display.textContent = game.sequence.join('');
    display.style.fontSize = '3rem';
    controls.style.display = 'none';
    document.getElementById('memoryFeedback').innerHTML = '';
    
    // 根据等级调整显示时间
    const displayTime = Math.max(1000, 3000 - game.level * 200);
    
    // 隐藏序列
    setTimeout(() => {
        display.textContent = '?'.repeat(length);
        inputArea.style.display = 'block';
        document.getElementById('memoryAnswer').value = '';
        document.getElementById('memoryAnswer').focus();
        
        document.getElementById('memoryLength').textContent = length;
    }, displayTime);
}

function checkMemoryAnswer() {
    const game = window.memoryGame;
    const userAnswer = document.getElementById('memoryAnswer').value;
    const correctAnswer = game.sequence.join('');
    const feedback = document.getElementById('memoryFeedback');
    
    if (userAnswer === correctAnswer) {
        const points = 100 * game.level;
        game.score += points;
        game.level++;
        
        feedback.innerHTML = `<div class="success">✅ 正确！+${points}分</div>`;
        document.getElementById('memoryScore').textContent = game.score;
        document.getElementById('memoryLevel').textContent = game.level;
        
        gamesManager.gameScore = game.score;
        document.getElementById('gameScore').textContent = game.score;
        
        // 准备下一轮
        document.getElementById('memoryInputArea').style.display = 'none';
        document.querySelector('.memory-controls').style.display = 'block';
        document.getElementById('memoryDisplay').textContent = '';
    } else {
        feedback.innerHTML = `<div class="error">❌ 错误！正确答案是: ${correctAnswer}</div>`;
        game.level = Math.max(1, game.level - 1);
        document.getElementById('memoryLevel').textContent = game.level;
        
        // 重新开始
        document.getElementById('memoryInputArea').style.display = 'none';
        document.querySelector('.memory-controls').style.display = 'block';
        document.getElementById('memoryDisplay').textContent = '';
    }
}

// 游戏17: 翻牌配对
function loadMatchingCards() {
    const pairs = [];
    for (let i = 1; i <= 8; i++) {
        pairs.push(i, i);
    }
    
    // 打乱顺序
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    
    window.matchingGame = {
        cards: pairs,
        flipped: [],
        matched: [],
        moves: 0,
        startTime: Date.now()
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="matching-game">
            <h3>翻牌配对 - 找出相同的数字</h3>
            <div class="matching-info">
                <span>翻牌次数: <span id="flipCount">0</span></span>
                <span>配对成功: <span id="matchCount">0</span>/8</span>
                <span>时间: <span id="matchTime">00:00</span></span>
            </div>
            <div class="matching-board">
                ${pairs.map((num, index) => `
                    <div class="match-card" data-index="${index}" data-number="${num}" onclick="flipMatchCard(${index})">
                        <div class="card-front">?</div>
                        <div class="card-back">${num}</div>
                    </div>
                `).join('')}
            </div>
            <button onclick="loadMatchingCards()">重新开始</button>
            <div id="matchFeedback"></div>
        </div>
    `;
    
    // 更新时间
    window.matchTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - window.matchingGame.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('matchTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function flipMatchCard(index) {
    const game = window.matchingGame;
    const card = document.querySelector(`[data-index="${index}"]`);
    
    // 不能翻已经匹配的或已经翻开的牌
    if (game.matched.includes(index) || game.flipped.includes(index)) {
        return;
    }
    
    // 翻开牌
    card.classList.add('flipped');
    game.flipped.push(index);
    game.moves++;
    document.getElementById('flipCount').textContent = game.moves;
    
    // 检查是否有两张牌翻开
    if (game.flipped.length === 2) {
        const [first, second] = game.flipped;
        const firstNum = game.cards[first];
        const secondNum = game.cards[second];
        
        if (firstNum === secondNum) {
            // 配对成功
            game.matched.push(first, second);
            game.flipped = [];
            
            document.getElementById('matchCount').textContent = game.matched.length / 2;
            
            // 添加成功效果
            setTimeout(() => {
                document.querySelector(`[data-index="${first}"]`).classList.add('matched');
                document.querySelector(`[data-index="${second}"]`).classList.add('matched');
            }, 500);
            
            // 检查是否全部配对
            if (game.matched.length === 16) {
                clearInterval(window.matchTimer);
                const time = Math.floor((Date.now() - game.startTime) / 1000);
                const score = Math.max(100, 1000 - game.moves * 10 - time * 2);
                
                gamesManager.gameScore += score;
                document.getElementById('gameScore').textContent = gamesManager.gameScore;
                
                document.getElementById('matchFeedback').innerHTML = 
                    `<div class="success">🎉 全部配对成功！用时${time}秒，${game.moves}次翻牌，得分${score}</div>`;
            }
        } else {
            // 配对失败，翻回去
            setTimeout(() => {
                document.querySelector(`[data-index="${first}"]`).classList.remove('flipped');
                document.querySelector(`[data-index="${second}"]`).classList.remove('flipped');
                game.flipped = [];
            }, 1000);
        }
    }
}

// 游戏18: 闪电记忆
function loadFlashMemory() {
    window.flashGame = {
        level: 1,
        score: 0,
        gridSize: 3,
        targetCount: 3
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="flash-memory-game">
            <h3>闪电记忆 - 记住闪现的数字位置</h3>
            <div class="flash-info">
                <span>等级: <span id="flashLevel">1</span></span>
                <span>目标: 记住<span id="flashTarget">3</span>个位置</span>
                <span>得分: <span id="flashScore">0</span></span>
            </div>
            <div class="flash-grid" id="flashGrid"></div>
            <div class="flash-controls">
                <button onclick="startFlashRound()">开始</button>
            </div>
            <div id="flashFeedback"></div>
        </div>
    `;
    
    createFlashGrid();
}

function createFlashGrid() {
    const game = window.flashGame;
    const grid = document.getElementById('flashGrid');
    const size = game.gridSize;
    
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.innerHTML = '';
    
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'flash-cell';
        cell.dataset.index = i;
        cell.onclick = () => selectFlashCell(i);
        grid.appendChild(cell);
    }
}

function startFlashRound() {
    const game = window.flashGame;
    const totalCells = game.gridSize * game.gridSize;
    
    // 随机选择要显示的位置
    game.targetCells = [];
    while (game.targetCells.length < game.targetCount) {
        const index = Math.floor(Math.random() * totalCells);
        if (!game.targetCells.includes(index)) {
            game.targetCells.push(index);
        }
    }
    
    // 显示目标
    game.targetCells.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('flash-target');
        cell.textContent = Math.floor(Math.random() * 10);
    });
    
    // 隐藏控制按钮
    document.querySelector('.flash-controls').style.display = 'none';
    
    // 闪现时间根据等级调整
    const flashTime = Math.max(500, 2000 - game.level * 100);
    
    // 隐藏目标
    setTimeout(() => {
        document.querySelectorAll('.flash-cell').forEach(cell => {
            cell.classList.remove('flash-target');
            cell.textContent = '';
            cell.classList.add('clickable');
        });
        
        game.selectedCells = [];
        document.getElementById('flashFeedback').innerHTML = 
            `<div class="info">点击你记住的${game.targetCount}个位置</div>`;
    }, flashTime);
}

function selectFlashCell(index) {
    const game = window.flashGame;
    
    if (!game.selectedCells) return;
    if (game.selectedCells.includes(index)) return;
    
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add('selected');
    game.selectedCells.push(index);
    
    if (game.selectedCells.length === game.targetCount) {
        checkFlashAnswer();
    }
}

function checkFlashAnswer() {
    const game = window.flashGame;
    const feedback = document.getElementById('flashFeedback');
    
    // 显示正确答案
    game.targetCells.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('correct-flash');
    });
    
    // 检查正确率
    const correct = game.selectedCells.filter(i => game.targetCells.includes(i)).length;
    const accuracy = (correct / game.targetCount) * 100;
    
    if (accuracy === 100) {
        const points = 150 * game.level;
        game.score += points;
        game.level++;
        
        // 增加难度
        if (game.level % 3 === 0) {
            game.gridSize = Math.min(5, game.gridSize + 1);
            game.targetCount = Math.min(game.gridSize * game.gridSize - 1, game.targetCount + 1);
        }
        
        feedback.innerHTML = `<div class="success">✅ 完美！全部正确！+${points}分</div>`;
        document.getElementById('flashScore').textContent = game.score;
        document.getElementById('flashLevel').textContent = game.level;
        document.getElementById('flashTarget').textContent = game.targetCount;
        
        gamesManager.gameScore = game.score;
        document.getElementById('gameScore').textContent = game.score;
        
        setTimeout(() => {
            createFlashGrid();
            document.querySelector('.flash-controls').style.display = 'block';
        }, 2000);
    } else {
        feedback.innerHTML = `<div class="error">正确率: ${accuracy.toFixed(0)}%</div>`;
        game.level = Math.max(1, game.level - 1);
        
        setTimeout(() => {
            createFlashGrid();
            document.querySelector('.flash-controls').style.display = 'block';
        }, 2000);
    }
}

// 游戏19: 序列复现
function loadSequenceRepeat() {
    window.sequenceGame = {
        level: 1,
        score: 0,
        sequence: [],
        userIndex: 0
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="sequence-game">
            <h3>序列复现 - 按顺序重复数字序列</h3>
            <div class="sequence-info">
                <span>等级: <span id="seqLevel">1</span></span>
                <span>长度: <span id="seqLength">3</span></span>
                <span>得分: <span id="seqScore">0</span></span>
            </div>
            <div class="sequence-display" id="seqDisplay"></div>
            <div class="sequence-pad">
                ${[1,2,3,4,5,6,7,8,9].map(n => 
                    `<button class="seq-btn" onclick="inputSequence(${n})">${n}</button>`
                ).join('')}
            </div>
            <div class="sequence-controls">
                <button onclick="startSequence()">开始</button>
                <button onclick="resetSequence()">重置</button>
            </div>
            <div id="seqFeedback"></div>
        </div>
    `;
}

function startSequence() {
    const game = window.sequenceGame;
    const length = 2 + game.level;
    
    // 生成序列
    game.sequence = [];
    for (let i = 0; i < length; i++) {
        game.sequence.push(Math.floor(Math.random() * 9) + 1);
    }
    
    game.userIndex = 0;
    
    // 显示序列
    playSequence();
}

function playSequence() {
    const game = window.sequenceGame;
    const display = document.getElementById('seqDisplay');
    let index = 0;
    
    // 禁用按钮
    document.querySelectorAll('.seq-btn').forEach(btn => btn.disabled = true);
    document.querySelector('.sequence-controls').style.display = 'none';
    
    const showNext = () => {
        if (index < game.sequence.length) {
            display.textContent = game.sequence[index];
            display.className = 'sequence-display show';
            
            setTimeout(() => {
                display.className = 'sequence-display';
                index++;
                setTimeout(showNext, 300);
            }, 600);
        } else {
            // 序列播放完毕
            display.textContent = '你的回合';
            document.querySelectorAll('.seq-btn').forEach(btn => btn.disabled = false);
            document.getElementById('seqLength').textContent = game.sequence.length;
        }
    };
    
    showNext();
}

function inputSequence(num) {
    const game = window.sequenceGame;
    const feedback = document.getElementById('seqFeedback');
    
    if (num === game.sequence[game.userIndex]) {
        game.userIndex++;
        
        // 显示进度
        document.getElementById('seqDisplay').textContent = 
            `${game.userIndex} / ${game.sequence.length}`;
        
        if (game.userIndex === game.sequence.length) {
            // 完成序列
            const points = 100 * game.level;
            game.score += points;
            game.level++;
            
            feedback.innerHTML = `<div class="success">✅ 完美！+${points}分</div>`;
            document.getElementById('seqScore').textContent = game.score;
            document.getElementById('seqLevel').textContent = game.level;
            
            gamesManager.gameScore = game.score;
            document.getElementById('gameScore').textContent = game.score;
            
            // 禁用按钮
            document.querySelectorAll('.seq-btn').forEach(btn => btn.disabled = true);
            document.querySelector('.sequence-controls').style.display = 'block';
        }
    } else {
        // 错误
        feedback.innerHTML = 
            `<div class="error">❌ 错误！正确序列: ${game.sequence.join(' ')}</div>`;
        game.level = Math.max(1, game.level - 1);
        document.getElementById('seqLevel').textContent = game.level;
        
        // 禁用按钮
        document.querySelectorAll('.seq-btn').forEach(btn => btn.disabled = true);
        document.querySelector('.sequence-controls').style.display = 'block';
    }
}

function resetSequence() {
    document.getElementById('seqDisplay').textContent = '';
    document.getElementById('seqFeedback').innerHTML = '';
    document.querySelectorAll('.seq-btn').forEach(btn => btn.disabled = true);
}

// 游戏20: 位置记忆
function loadPositionMemory() {
    window.positionGame = {
        level: 1,
        score: 0,
        grid: [],
        targets: []
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="position-memory-game">
            <h3>位置记忆 - 记住数字出现的位置</h3>
            <div class="position-info">
                <span>等级: <span id="posLevel">1</span></span>
                <span>得分: <span id="posScore">0</span></span>
            </div>
            <div class="position-grid" id="posGrid"></div>
            <div class="position-question" id="posQuestion"></div>
            <div class="position-controls">
                <button onclick="startPositionRound()">开始</button>
            </div>
            <div id="posFeedback"></div>
        </div>
    `;
    
    createPositionGrid();
}

function createPositionGrid() {
    const grid = document.getElementById('posGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'pos-cell';
        cell.dataset.index = i;
        cell.onclick = () => selectPosition(i);
        grid.appendChild(cell);
    }
}

function startPositionRound() {
    const game = window.positionGame;
    const numCount = Math.min(2 + game.level, 8);
    
    // 生成数字和位置
    game.targets = [];
    const usedPositions = [];
    
    for (let i = 0; i < numCount; i++) {
        let pos;
        do {
            pos = Math.floor(Math.random() * 16);
        } while (usedPositions.includes(pos));
        
        usedPositions.push(pos);
        game.targets.push({
            number: i + 1,
            position: pos
        });
    }
    
    // 显示数字
    game.targets.forEach(target => {
        const cell = document.querySelector(`[data-index="${target.position}"]`);
        cell.textContent = target.number;
        cell.classList.add('show-number');
    });
    
    document.querySelector('.position-controls').style.display = 'none';
    
    // 隐藏数字
    const hideTime = Math.max(1000, 3000 - game.level * 100);
    setTimeout(() => {
        document.querySelectorAll('.pos-cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('show-number');
        });
        
        askPosition();
    }, hideTime);
}

function askPosition() {
    const game = window.positionGame;
    
    // 随机选一个数字询问
    game.currentTarget = game.targets[Math.floor(Math.random() * game.targets.length)];
    
    document.getElementById('posQuestion').innerHTML = 
        `<div class="question">数字 ${game.currentTarget.number} 在哪里？</div>`;
    
    game.answering = true;
}

function selectPosition(index) {
    const game = window.positionGame;
    
    if (!game.answering) return;
    
    const feedback = document.getElementById('posFeedback');
    
    if (index === game.currentTarget.position) {
        const points = 50 * game.level;
        game.score += points;
        game.level++;
        
        feedback.innerHTML = `<div class="success">✅ 正确！+${points}分</div>`;
        document.getElementById('posScore').textContent = game.score;
        document.getElementById('posLevel').textContent = game.level;
        
        gamesManager.gameScore = game.score;
        document.getElementById('gameScore').textContent = game.score;
        
        // 显示所有答案
        game.targets.forEach(target => {
            const cell = document.querySelector(`[data-index="${target.position}"]`);
            cell.textContent = target.number;
            cell.classList.add('show-answer');
        });
    } else {
        feedback.innerHTML = '<div class="error">❌ 错误！</div>';
        game.level = Math.max(1, game.level - 1);
        document.getElementById('posLevel').textContent = game.level;
        
        // 显示正确答案
        const correctCell = document.querySelector(`[data-index="${game.currentTarget.position}"]`);
        correctCell.textContent = game.currentTarget.number;
        correctCell.classList.add('correct-answer');
    }
    
    game.answering = false;
    document.getElementById('posQuestion').innerHTML = '';
    
    setTimeout(() => {
        createPositionGrid();
        document.querySelector('.position-controls').style.display = 'block';
    }, 2000);
}

// 注册游戏到gameImplementations
if (typeof gameImplementations !== 'undefined') {
    gameImplementations[16] = loadMemoryGame;
    gameImplementations[17] = loadMatchingCards;
    gameImplementations[18] = loadFlashMemory;
    gameImplementations[19] = loadSequenceRepeat;
    gameImplementations[20] = loadPositionMemory;
}
