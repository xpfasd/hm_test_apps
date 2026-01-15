// 逻辑思维类游戏实现

// 游戏1: 数字推理
function loadNumberPattern() {
    const patterns = [
        { sequence: [2, 4, 6, 8], answer: 10, rule: '等差数列 +2' },
        { sequence: [1, 2, 4, 8], answer: 16, rule: '等比数列 ×2' },
        { sequence: [1, 1, 2, 3, 5], answer: 8, rule: '斐波那契数列' },
        { sequence: [3, 6, 9, 12], answer: 15, rule: '3的倍数' },
        { sequence: [5, 10, 15, 20], answer: 25, rule: '5的倍数' },
        { sequence: [1, 4, 9, 16], answer: 25, rule: '平方数列' },
        { sequence: [2, 3, 5, 7, 11], answer: 13, rule: '质数数列' },
        { sequence: [1, 3, 6, 10, 15], answer: 21, rule: '三角数列' },
        { sequence: [2, 5, 10, 17, 26], answer: 37, rule: 'n² + 1' },
        { sequence: [3, 7, 13, 21, 31], answer: 43, rule: 'n² + n + 1' }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    window.currentPattern = pattern;
    
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
                <button onclick="checkPatternAnswer()">提交</button>
            </div>
            <div id="patternFeedback"></div>
            <div class="pattern-score">
                <span>连续答对: <span id="patternStreak">0</span></span>
                <span>总得分: <span id="patternTotal">0</span></span>
            </div>
        </div>
    `;
}

function checkPatternAnswer() {
    const userAnswer = parseInt(document.getElementById('patternAnswer').value);
    const feedback = document.getElementById('patternFeedback');
    const pattern = window.currentPattern;
    
    if (userAnswer === pattern.answer) {
        feedback.innerHTML = `<div class="success">✅ 正确！规律是：${pattern.rule}</div>`;
        
        // 更新连续答对和得分
        const streak = parseInt(document.getElementById('patternStreak').textContent) + 1;
        const total = parseInt(document.getElementById('patternTotal').textContent) + 100 * Math.min(streak, 5);
        document.getElementById('patternStreak').textContent = streak;
        document.getElementById('patternTotal').textContent = total;
        
        gamesManager.gameScore = total;
        document.getElementById('gameScore').textContent = total;
        
        setTimeout(() => {
            loadNumberPattern();
        }, 2000);
    } else {
        feedback.innerHTML = `<div class="error">❌ 再想想看</div>`;
        document.getElementById('patternStreak').textContent = '0';
    }
}

// 游戏2: 数独挑战
function loadSudoku() {
    // 简化版4x4数独
    const puzzles = [
        {
            grid: [
                [1, 0, 3, 0],
                [0, 3, 0, 1],
                [3, 0, 1, 0],
                [0, 1, 0, 3]
            ],
            solution: [
                [1, 2, 3, 4],
                [4, 3, 2, 1],
                [3, 4, 1, 2],
                [2, 1, 4, 3]
            ]
        },
        {
            grid: [
                [0, 2, 0, 1],
                [3, 0, 0, 4],
                [1, 0, 0, 3],
                [4, 0, 1, 0]
            ],
            solution: [
                [4, 2, 3, 1],
                [3, 1, 2, 4],
                [1, 4, 2, 3],
                [4, 3, 1, 2]
            ]
        }
    ];
    
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    window.currentSudoku = JSON.parse(JSON.stringify(puzzle.grid));
    window.sudokuSolution = puzzle.solution;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="sudoku-game">
            <h3>填充数独 (1-4)</h3>
            <div class="sudoku-grid" id="sudokuGrid">
                ${puzzle.grid.map((row, i) => 
                    row.map((cell, j) => `
                        <input type="number" 
                               class="sudoku-cell ${cell ? 'given' : ''}" 
                               value="${cell || ''}" 
                               ${cell ? 'readonly' : ''}
                               min="1" max="4"
                               data-row="${i}" 
                               data-col="${j}"
                               onchange="updateSudoku(${i}, ${j}, this.value)">
                    `).join('')
                ).join('')}
            </div>
            <div class="sudoku-controls">
                <button onclick="checkSudoku()">检查答案</button>
                <button onclick="getSudokuHint()">提示</button>
                <button onclick="loadSudoku()">新题目</button>
            </div>
            <div id="sudokuFeedback"></div>
        </div>
    `;
}

function updateSudoku(row, col, value) {
    window.currentSudoku[row][col] = parseInt(value) || 0;
}

function checkSudoku() {
    const feedback = document.getElementById('sudokuFeedback');
    let correct = true;
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (window.currentSudoku[i][j] !== window.sudokuSolution[i][j]) {
                correct = false;
                break;
            }
        }
    }
    
    if (correct) {
        feedback.innerHTML = '<div class="success">🎉 完美解答！</div>';
        gamesManager.gameScore += 500;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        setTimeout(() => loadSudoku(), 2000);
    } else {
        feedback.innerHTML = '<div class="error">还有错误，请继续尝试</div>';
    }
}

function getSudokuHint() {
    // 找到一个空格并填入正确答案
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (window.currentSudoku[i][j] === 0) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.value = window.sudokuSolution[i][j];
                window.currentSudoku[i][j] = window.sudokuSolution[i][j];
                cell.style.background = '#e8f5e9';
                return;
            }
        }
    }
}

// 游戏3: 数字迷宫
function loadNumberMaze() {
    // 创建一个5x5的迷宫
    const mazeSize = 5;
    const maze = Array(mazeSize).fill().map(() => Array(mazeSize).fill(0));
    
    // 生成路径
    const path = [];
    let x = 0, y = 0;
    path.push({x, y});
    
    while (x < mazeSize - 1 || y < mazeSize - 1) {
        if (x < mazeSize - 1 && Math.random() < 0.5) {
            x++;
        } else if (y < mazeSize - 1) {
            y++;
        } else {
            x++;
        }
        path.push({x, y});
    }
    
    // 在路径上放置数字
    path.forEach((pos, index) => {
        maze[pos.y][pos.x] = index + 1;
    });
    
    // 添加一些干扰数字
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            if (maze[i][j] === 0 && Math.random() < 0.3) {
                maze[i][j] = Math.floor(Math.random() * 20) + 100;
            }
        }
    }
    
    window.mazePath = path;
    window.currentMaze = maze;
    window.playerPath = [{x: 0, y: 0}];
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="maze-game">
            <h3>按照数字顺序找到出口 (1 → ${path.length})</h3>
            <div class="maze-grid">
                ${maze.map((row, y) => 
                    row.map((cell, x) => {
                        const isStart = x === 0 && y === 0;
                        const isEnd = x === mazeSize - 1 && y === mazeSize - 1;
                        const isOnPath = path.some(p => p.x === x && p.y === y);
                        return `
                            <div class="maze-cell ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}"
                                 data-x="${x}" data-y="${y}"
                                 onclick="moveMaze(${x}, ${y})">
                                ${cell < 100 ? cell : ''}
                            </div>
                        `;
                    }).join('')
                ).join('')}
            </div>
            <div class="maze-info">
                <span>当前位置: <span id="currentNum">1</span></span>
                <span>下一个数字: <span id="nextNum">2</span></span>
                <button onclick="resetMaze()">重置</button>
            </div>
            <div id="mazeFeedback"></div>
        </div>
    `;
    
    // 标记起点
    document.querySelector('[data-x="0"][data-y="0"]').classList.add('current');
}

function moveMaze(x, y) {
    const currentPath = window.playerPath;
    const lastPos = currentPath[currentPath.length - 1];
    const feedback = document.getElementById('mazeFeedback');
    
    // 检查是否相邻
    if (Math.abs(x - lastPos.x) + Math.abs(y - lastPos.y) !== 1) {
        feedback.innerHTML = '<div class="error">只能移动到相邻格子</div>';
        return;
    }
    
    // 检查数字是否正确
    const expectedNum = currentPath.length + 1;
    const cellValue = window.currentMaze[y][x];
    
    if (cellValue === expectedNum) {
        // 正确移动
        currentPath.push({x, y});
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).classList.add('visited');
        document.querySelector('.current')?.classList.remove('current');
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).classList.add('current');
        
        document.getElementById('currentNum').textContent = expectedNum;
        document.getElementById('nextNum').textContent = expectedNum + 1;
        
        // 检查是否到达终点
        if (x === 4 && y === 4) {
            feedback.innerHTML = '<div class="success">🎉 成功到达终点！</div>';
            gamesManager.gameScore += 300;
            document.getElementById('gameScore').textContent = gamesManager.gameScore;
            setTimeout(() => loadNumberMaze(), 2000);
        } else {
            feedback.innerHTML = '<div class="success">✅ 正确！</div>';
        }
    } else if (cellValue > 100) {
        feedback.innerHTML = '<div class="error">❌ 这不是正确的路径</div>';
    } else {
        feedback.innerHTML = `<div class="error">❌ 应该找数字 ${expectedNum}</div>`;
    }
}

function resetMaze() {
    window.playerPath = [{x: 0, y: 0}];
    document.querySelectorAll('.maze-cell').forEach(cell => {
        cell.classList.remove('visited', 'current');
    });
    document.querySelector('[data-x="0"][data-y="0"]').classList.add('current');
    document.getElementById('currentNum').textContent = '1';
    document.getElementById('nextNum').textContent = '2';
}

// 游戏4: 逻辑方阵
function loadLogicMatrix() {
    const matrices = [
        {
            grid: [
                [2, 4, 6],
                [3, 6, 9],
                [4, 8, '?']
            ],
            answer: 12,
            rule: '每行：第三个 = 第一个 × 第二个 ÷ 2'
        },
        {
            grid: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, '?']
            ],
            answer: 9,
            rule: '连续自然数'
        },
        {
            grid: [
                [5, 3, 8],
                [7, 2, 9],
                [4, 6, '?']
            ],
            answer: 10,
            rule: '每行：第三个 = 第一个 + 第二个'
        }
    ];
    
    const matrix = matrices[Math.floor(Math.random() * matrices.length)];
    window.currentMatrix = matrix;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="matrix-game">
            <h3>找出方阵的规律，填入缺失的数字</h3>
            <div class="matrix-grid">
                ${matrix.grid.map(row => 
                    `<div class="matrix-row">
                        ${row.map(cell => 
                            `<div class="matrix-cell ${cell === '?' ? 'missing' : ''}">${cell}</div>`
                        ).join('')}
                    </div>`
                ).join('')}
            </div>
            <div class="matrix-input">
                <input type="number" id="matrixAnswer" placeholder="输入答案">
                <button onclick="checkMatrixAnswer()">提交</button>
            </div>
            <div id="matrixFeedback"></div>
        </div>
    `;
}

function checkMatrixAnswer() {
    const userAnswer = parseInt(document.getElementById('matrixAnswer').value);
    const feedback = document.getElementById('matrixFeedback');
    const matrix = window.currentMatrix;
    
    if (userAnswer === matrix.answer) {
        feedback.innerHTML = `<div class="success">✅ 正确！规律是：${matrix.rule}</div>`;
        gamesManager.gameScore += 200;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        setTimeout(() => loadLogicMatrix(), 3000);
    } else {
        feedback.innerHTML = '<div class="error">❌ 再想想看</div>';
    }
}

// 游戏5: 数字接龙
function loadNumberChain() {
    const container = document.getElementById('gameContainer');
    
    // 生成起始数字和目标数字
    const start = Math.floor(Math.random() * 10) + 1;
    const target = start + Math.floor(Math.random() * 20) + 10;
    
    // 生成可用的操作
    const operations = ['+2', '+3', '+5', '×2', '-1'];
    
    window.chainGame = {
        current: start,
        target: target,
        moves: 0,
        maxMoves: 8,
        history: [start]
    };
    
    container.innerHTML = `
        <div class="chain-game">
            <h3>通过运算从 ${start} 到达 ${target}</h3>
            <div class="chain-display">
                <div class="chain-current">
                    当前: <span id="chainCurrent">${start}</span>
                </div>
                <div class="chain-target">
                    目标: <span>${target}</span>
                </div>
                <div class="chain-moves">
                    步数: <span id="chainMoves">0</span> / ${window.chainGame.maxMoves}
                </div>
            </div>
            <div class="chain-operations">
                ${operations.map(op => 
                    `<button class="op-btn" onclick="applyOperation('${op}')">${op}</button>`
                ).join('')}
            </div>
            <div class="chain-history">
                <h4>历史记录:</h4>
                <div id="chainHistory">${start}</div>
            </div>
            <button onclick="resetChain()">重置</button>
            <div id="chainFeedback"></div>
        </div>
    `;
}

function applyOperation(op) {
    const game = window.chainGame;
    const feedback = document.getElementById('chainFeedback');
    
    if (game.moves >= game.maxMoves) {
        feedback.innerHTML = '<div class="error">步数用完了！请重置</div>';
        return;
    }
    
    let newValue = game.current;
    if (op === '+2') newValue += 2;
    else if (op === '+3') newValue += 3;
    else if (op === '+5') newValue += 5;
    else if (op === '×2') newValue *= 2;
    else if (op === '-1') newValue -= 1;
    
    game.current = newValue;
    game.moves++;
    game.history.push(newValue);
    
    document.getElementById('chainCurrent').textContent = newValue;
    document.getElementById('chainMoves').textContent = game.moves;
    document.getElementById('chainHistory').textContent = game.history.join(' → ');
    
    if (newValue === game.target) {
        feedback.innerHTML = `<div class="success">🎉 成功！用了 ${game.moves} 步</div>`;
        const bonus = Math.max(0, (game.maxMoves - game.moves) * 50);
        gamesManager.gameScore += 200 + bonus;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        setTimeout(() => loadNumberChain(), 2000);
    } else if (game.moves >= game.maxMoves) {
        feedback.innerHTML = '<div class="error">步数用完了！请重置</div>';
    }
}

function resetChain() {
    const game = window.chainGame;
    game.current = game.history[0];
    game.moves = 0;
    game.history = [game.current];
    
    document.getElementById('chainCurrent').textContent = game.current;
    document.getElementById('chainMoves').textContent = '0';
    document.getElementById('chainHistory').textContent = game.current;
    document.getElementById('chainFeedback').innerHTML = '';
}

// 注册游戏到gameImplementations
if (typeof gameImplementations !== 'undefined') {
    gameImplementations[1] = loadNumberPattern;
    gameImplementations[2] = loadSudoku;
    gameImplementations[3] = loadNumberMaze;
    gameImplementations[4] = loadLogicMatrix;
    gameImplementations[5] = loadNumberChain;
}
