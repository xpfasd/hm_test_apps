// 益智解谜类游戏实现

// 游戏11: 数字华容道
function loadNumberSlide() {
    const size = 4;
    let tiles = [];
    for (let i = 1; i < size * size; i++) {
        tiles.push(i);
    }
    tiles.push(0); // 空格
    
    // 打乱拼图（确保可解）
    for (let i = 0; i < 100; i++) {
        const emptyIndex = tiles.indexOf(0);
        const row = Math.floor(emptyIndex / size);
        const col = emptyIndex % size;
        
        // 随机移动
        const moves = [];
        if (row > 0) moves.push(-size); // 上
        if (row < size - 1) moves.push(size); // 下
        if (col > 0) moves.push(-1); // 左
        if (col < size - 1) moves.push(1); // 右
        
        if (moves.length > 0) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            const newIndex = emptyIndex + move;
            [tiles[emptyIndex], tiles[newIndex]] = [tiles[newIndex], tiles[emptyIndex]];
        }
    }
    
    window.slideTiles = tiles;
    window.slideMoves = 0;
    window.slideStartTime = Date.now();
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="slide-game">
            <h3>数字华容道 - 按顺序排列1-15</h3>
            <div class="slide-stats">
                <span>移动: <span id="slideMoves">0</span></span>
                <span>时间: <span id="slideTime">00:00</span></span>
            </div>
            <div class="slide-board" id="slideBoard">
                ${tiles.map((tile, index) => `
                    <div class="slide-tile ${tile === 0 ? 'empty' : ''}" 
                         data-index="${index}"
                         onclick="moveSlide(${index})">
                        ${tile || ''}
                    </div>
                `).join('')}
            </div>
            <div class="slide-controls">
                <button onclick="loadNumberSlide()">重新开始</button>
                <button onclick="showSlideSolution()">查看目标</button>
            </div>
            <div id="slideFeedback"></div>
        </div>
    `;
    
    // 更新时间
    window.slideTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - window.slideStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('slideTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function moveSlide(index) {
    const tiles = window.slideTiles;
    const emptyIndex = tiles.indexOf(0);
    const size = 4;
    
    // 检查是否相邻
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
        // 交换
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        window.slideTiles = tiles;
        window.slideMoves++;
        
        // 更新显示
        document.getElementById('slideMoves').textContent = window.slideMoves;
        refreshSlideBoard();
        
        // 检查是否完成
        if (checkSlideComplete()) {
            clearInterval(window.slideTimer);
            const time = Math.floor((Date.now() - window.slideStartTime) / 1000);
            const score = Math.max(100, 1000 - window.slideMoves * 5 - time);
            
            gamesManager.gameScore += score;
            document.getElementById('gameScore').textContent = gamesManager.gameScore;
            
            document.getElementById('slideFeedback').innerHTML = 
                `<div class="success">🎉 完成！用时${time}秒，移动${window.slideMoves}次，得分${score}</div>`;
        }
    }
}

function refreshSlideBoard() {
    const board = document.getElementById('slideBoard');
    board.innerHTML = window.slideTiles.map((tile, index) => `
        <div class="slide-tile ${tile === 0 ? 'empty' : ''}" 
             data-index="${index}"
             onclick="moveSlide(${index})">
            ${tile || ''}
        </div>
    `).join('');
}

function checkSlideComplete() {
    const tiles = window.slideTiles;
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return tiles[tiles.length - 1] === 0;
}

function showSlideSolution() {
    const feedback = document.getElementById('slideFeedback');
    feedback.innerHTML = '<div class="info">目标: 1 2 3 4 | 5 6 7 8 | 9 10 11 12 | 13 14 15 空</div>';
}

// 游戏12: 魔方数字
function loadMagicCube() {
    // 3x3魔方阵
    const target = 15; // 每行、列、对角线的和
    const grid = [
        [0, 0, 0],
        [0, 5, 0],  // 中心固定为5
        [0, 0, 0]
    ];
    
    window.magicGrid = grid;
    window.magicTarget = target;
    window.usedNumbers = [5];
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="magic-cube-game">
            <h3>魔方数字 - 每行、列、对角线的和都等于 ${target}</h3>
            <div class="magic-grid">
                ${grid.map((row, i) => 
                    row.map((cell, j) => {
                        const isCenter = i === 1 && j === 1;
                        return `
                            <input type="number" 
                                   class="magic-cell ${isCenter ? 'fixed' : ''}"
                                   value="${cell || ''}"
                                   ${isCenter ? 'readonly' : ''}
                                   min="1" max="9"
                                   data-row="${i}" 
                                   data-col="${j}"
                                   onchange="updateMagicCube(${i}, ${j}, this.value)">
                        `;
                    }).join('')
                ).join('')}
            </div>
            <div class="magic-available">
                可用数字: <span id="availableNumbers">1, 2, 3, 4, 6, 7, 8, 9</span>
            </div>
            <div class="magic-controls">
                <button onclick="checkMagicCube()">检查答案</button>
                <button onclick="getMagicHint()">提示</button>
                <button onclick="loadMagicCube()">重置</button>
            </div>
            <div class="magic-sums">
                <div id="rowSums"></div>
                <div id="colSums"></div>
                <div id="diagSums"></div>
            </div>
            <div id="magicFeedback"></div>
        </div>
    `;
    
    updateMagicSums();
}

function updateMagicCube(row, col, value) {
    const num = parseInt(value) || 0;
    const oldValue = window.magicGrid[row][col];
    
    // 检查数字是否重复
    if (num > 0 && num <= 9 && num !== oldValue) {
        if (window.usedNumbers.includes(num)) {
            document.getElementById('magicFeedback').innerHTML = 
                '<div class="error">这个数字已经使用过了</div>';
            document.querySelector(`[data-row="${row}"][data-col="${col}"]`).value = oldValue || '';
            return;
        }
        
        // 更新使用的数字
        if (oldValue) {
            const index = window.usedNumbers.indexOf(oldValue);
            window.usedNumbers.splice(index, 1);
        }
        window.usedNumbers.push(num);
    } else if (num === 0 && oldValue) {
        const index = window.usedNumbers.indexOf(oldValue);
        window.usedNumbers.splice(index, 1);
    }
    
    window.magicGrid[row][col] = num;
    
    // 更新可用数字显示
    const available = [];
    for (let i = 1; i <= 9; i++) {
        if (!window.usedNumbers.includes(i)) {
            available.push(i);
        }
    }
    document.getElementById('availableNumbers').textContent = available.join(', ') || '无';
    
    updateMagicSums();
}

function updateMagicSums() {
    const grid = window.magicGrid;
    const target = window.magicTarget;
    
    // 计算行和
    const rowSums = grid.map(row => row.reduce((a, b) => a + b, 0));
    
    // 计算列和
    const colSums = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            colSums[j] += grid[i][j];
        }
    }
    
    // 计算对角线和
    const diag1 = grid[0][0] + grid[1][1] + grid[2][2];
    const diag2 = grid[0][2] + grid[1][1] + grid[2][0];
    
    // 显示和
    document.getElementById('rowSums').innerHTML = 
        `行和: ${rowSums.map((s, i) => `<span class="${s === target ? 'correct' : ''}">${s}</span>`).join(', ')}`;
    document.getElementById('colSums').innerHTML = 
        `列和: ${colSums.map((s, i) => `<span class="${s === target ? 'correct' : ''}">${s}</span>`).join(', ')}`;
    document.getElementById('diagSums').innerHTML = 
        `对角线: <span class="${diag1 === target ? 'correct' : ''}">${diag1}</span>, 
         <span class="${diag2 === target ? 'correct' : ''}">${diag2}</span>`;
}

function checkMagicCube() {
    const grid = window.magicGrid;
    const target = window.magicTarget;
    
    // 检查是否填满
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === 0) {
                document.getElementById('magicFeedback').innerHTML = 
                    '<div class="error">请填满所有格子</div>';
                return;
            }
        }
    }
    
    // 检查和
    let correct = true;
    
    // 行
    for (let i = 0; i < 3; i++) {
        if (grid[i].reduce((a, b) => a + b, 0) !== target) correct = false;
    }
    
    // 列
    for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            sum += grid[i][j];
        }
        if (sum !== target) correct = false;
    }
    
    // 对角线
    if (grid[0][0] + grid[1][1] + grid[2][2] !== target) correct = false;
    if (grid[0][2] + grid[1][1] + grid[2][0] !== target) correct = false;
    
    if (correct) {
        document.getElementById('magicFeedback').innerHTML = 
            '<div class="success">🎉 完美！你解开了魔方数字！</div>';
        gamesManager.gameScore += 500;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
    } else {
        document.getElementById('magicFeedback').innerHTML = 
            '<div class="error">还不对，请继续尝试</div>';
    }
}

function getMagicHint() {
    // 魔方阵答案: 2,7,6 / 9,5,1 / 4,3,8
    const hints = [
        '提示：对角的两个数字相加等于10',
        '提示：最小的数字1在右边',
        '提示：最大的数字9在左边'
    ];
    const hint = hints[Math.floor(Math.random() * hints.length)];
    document.getElementById('magicFeedback').innerHTML = `<div class="info">${hint}</div>`;
}

// 游戏13: 数字拼图
function loadNumberPuzzle() {
    const size = 3;
    let tiles = [];
    for (let i = 1; i < size * size; i++) {
        tiles.push(i);
    }
    tiles.push(0); // 空格
    
    // 打乱拼图
    for (let i = 0; i < 50; i++) {
        const emptyIndex = tiles.indexOf(0);
        const moves = [];
        
        if (emptyIndex % size !== 0) moves.push(-1); // 左
        if (emptyIndex % size !== size - 1) moves.push(1); // 右
        if (emptyIndex >= size) moves.push(-size); // 上
        if (emptyIndex < size * (size - 1)) moves.push(size); // 下
        
        if (moves.length > 0) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            const newIndex = emptyIndex + move;
            [tiles[emptyIndex], tiles[newIndex]] = [tiles[newIndex], tiles[emptyIndex]];
        }
    }
    
    window.puzzleTiles = tiles;
    window.puzzleMoves = 0;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="puzzle-game">
            <h3>数字拼图 - 按顺序排列数字</h3>
            <div class="puzzle-moves">移动次数: <span id="puzzleMoveCount">0</span></div>
            <div class="puzzle-board" id="puzzleBoard">
                ${tiles.map((tile, index) => `
                    <div class="puzzle-tile ${tile === 0 ? 'empty' : ''}" 
                         data-index="${index}"
                         onclick="movePuzzleTile(${index})">
                        ${tile || ''}
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-actions">
                <button onclick="loadNumberPuzzle()">重置</button>
                <button onclick="solvePuzzle()">自动解决</button>
            </div>
            <div id="puzzleFeedback"></div>
        </div>
    `;
}

function movePuzzleTile(index) {
    const tiles = window.puzzleTiles;
    const emptyIndex = tiles.indexOf(0);
    const size = 3;
    
    // 检查是否相邻
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
        // 交换
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        window.puzzleTiles = tiles;
        window.puzzleMoves++;
        
        document.getElementById('puzzleMoveCount').textContent = window.puzzleMoves;
        
        // 更新显示
        refreshPuzzleBoard();
        
        // 检查是否完成
        if (tiles.slice(0, -1).every((tile, i) => tile === i + 1)) {
            const score = Math.max(50, 300 - window.puzzleMoves * 5);
            gamesManager.gameScore += score;
            document.getElementById('gameScore').textContent = gamesManager.gameScore;
            
            document.getElementById('puzzleFeedback').innerHTML = 
                `<div class="success">🎉 拼图完成！用了${window.puzzleMoves}步，得分${score}</div>`;
        }
    }
}

function refreshPuzzleBoard() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = window.puzzleTiles.map((tile, index) => `
        <div class="puzzle-tile ${tile === 0 ? 'empty' : ''}" 
             data-index="${index}"
             onclick="movePuzzleTile(${index})">
            ${tile || ''}
        </div>
    `).join('');
}

function solvePuzzle() {
    // 简单演示：直接显示答案
    window.puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    refreshPuzzleBoard();
    document.getElementById('puzzleFeedback').innerHTML = 
        '<div class="info">这是完成状态，但没有得分哦！</div>';
}

// 游戏14: 算式填空
function loadEquationFill() {
    const equations = [
        { equation: '? + 5 = 12', answer: 7, hint: '12 - 5 = ?' },
        { equation: '8 × ? = 24', answer: 3, hint: '24 ÷ 8 = ?' },
        { equation: '? - 7 = 15', answer: 22, hint: '15 + 7 = ?' },
        { equation: '36 ÷ ? = 6', answer: 6, hint: '36 ÷ 6 = ?' },
        { equation: '? + ? = 10', answer: [5, 5], hint: '两个相同的数' },
        { equation: '? × ? = 25', answer: [5, 5], hint: '5的平方' },
        { equation: '(? + 3) × 2 = 14', answer: 4, hint: '先算括号：14÷2-3' },
        { equation: '? × 4 + 5 = 21', answer: 4, hint: '(21-5)÷4' }
    ];
    
    const problem = equations[Math.floor(Math.random() * equations.length)];
    window.currentEquation = problem;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="equation-game">
            <h3>算式填空</h3>
            <div class="equation-display">
                ${problem.equation}
            </div>
            <div class="equation-input">
                ${Array.isArray(problem.answer) ? 
                    problem.answer.map((_, i) => 
                        `<input type="number" id="eqAnswer${i}" placeholder="?">`
                    ).join(' 和 ') :
                    `<input type="number" id="eqAnswer" placeholder="填入数字">`
                }
                <button onclick="checkEquation()">提交</button>
            </div>
            <div class="equation-controls">
                <button onclick="getEquationHint()">提示</button>
                <button onclick="loadEquationFill()">换一题</button>
            </div>
            <div id="equationFeedback"></div>
        </div>
    `;
}

function checkEquation() {
    const equation = window.currentEquation;
    const feedback = document.getElementById('equationFeedback');
    
    if (Array.isArray(equation.answer)) {
        const answers = equation.answer.map((_, i) => 
            parseInt(document.getElementById(`eqAnswer${i}`).value)
        );
        
        if (answers.every((a, i) => a === equation.answer[i])) {
            feedback.innerHTML = '<div class="success">✅ 正确！</div>';
            gamesManager.gameScore += 150;
            document.getElementById('gameScore').textContent = gamesManager.gameScore;
            setTimeout(() => loadEquationFill(), 1500);
        } else {
            feedback.innerHTML = '<div class="error">❌ 不对，再想想</div>';
        }
    } else {
        const userAnswer = parseInt(document.getElementById('eqAnswer').value);
        
        if (userAnswer === equation.answer) {
            feedback.innerHTML = '<div class="success">✅ 正确！</div>';
            gamesManager.gameScore += 100;
            document.getElementById('gameScore').textContent = gamesManager.gameScore;
            setTimeout(() => loadEquationFill(), 1500);
        } else {
            feedback.innerHTML = '<div class="error">❌ 不对，再想想</div>';
        }
    }
}

function getEquationHint() {
    const feedback = document.getElementById('equationFeedback');
    feedback.innerHTML = `<div class="info">💡 ${window.currentEquation.hint}</div>`;
}

// 游戏15: 天平称重
function loadBalance() {
    const problems = [
        {
            left: [3, 5],
            right: [2, '?'],
            answer: 6,
            hint: '左边 = 8，右边需要平衡'
        },
        {
            left: [4, 4],
            right: ['?', 3],
            answer: 5,
            hint: '两边要相等'
        },
        {
            left: [10],
            right: [3, '?'],
            answer: 7,
            hint: '10 = 3 + ?'
        }
    ];
    
    const problem = problems[Math.floor(Math.random() * problems.length)];
    window.balanceProblem = problem;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="balance-game">
            <h3>天平称重 - 让两边平衡</h3>
            <div class="balance-display">
                <div class="balance-left">
                    <div class="balance-pan">
                        ${problem.left.map(w => `<span class="weight">${w}</span>`).join(' + ')}
                    </div>
                    <div class="balance-sum">= ${problem.left.reduce((a, b) => a + b, 0)}</div>
                </div>
                <div class="balance-center">⚖️</div>
                <div class="balance-right">
                    <div class="balance-pan">
                        ${problem.right.map(w => 
                            w === '?' ? '<input type="number" id="balanceAnswer" placeholder="?">' :
                            `<span class="weight">${w}</span>`
                        ).join(' + ')}
                    </div>
                    <div class="balance-sum" id="rightSum">= ?</div>
                </div>
            </div>
            <div class="balance-controls">
                <button onclick="checkBalance()">检查平衡</button>
                <button onclick="getBalanceHint()">提示</button>
                <button onclick="loadBalance()">新题目</button>
            </div>
            <div id="balanceFeedback"></div>
        </div>
    `;
    
    // 监听输入变化
    document.getElementById('balanceAnswer').addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || 0;
        const otherWeights = problem.right.filter(w => w !== '?').reduce((a, b) => a + b, 0);
        document.getElementById('rightSum').textContent = `= ${value + otherWeights}`;
    });
}

function checkBalance() {
    const userAnswer = parseInt(document.getElementById('balanceAnswer').value);
    const feedback = document.getElementById('balanceFeedback');
    
    if (userAnswer === window.balanceProblem.answer) {
        feedback.innerHTML = '<div class="success">✅ 完美平衡！</div>';
        gamesManager.gameScore += 120;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        setTimeout(() => loadBalance(), 1500);
    } else {
        const leftSum = window.balanceProblem.left.reduce((a, b) => a + b, 0);
        const rightSum = window.balanceProblem.right
            .map(w => w === '?' ? userAnswer : w)
            .reduce((a, b) => a + b, 0);
        
        if (rightSum < leftSum) {
            feedback.innerHTML = '<div class="error">右边太轻了</div>';
        } else {
            feedback.innerHTML = '<div class="error">右边太重了</div>';
        }
    }
}

function getBalanceHint() {
    const feedback = document.getElementById('balanceFeedback');
    feedback.innerHTML = `<div class="info">💡 ${window.balanceProblem.hint}</div>`;
}

// 注册游戏到gameImplementations
if (typeof gameImplementations !== 'undefined') {
    gameImplementations[11] = loadNumberSlide;
    gameImplementations[12] = loadMagicCube;
    gameImplementations[13] = loadNumberPuzzle;
    gameImplementations[14] = loadEquationFill;
    gameImplementations[15] = loadBalance;
}
