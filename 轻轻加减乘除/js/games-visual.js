// 空间想象类游戏实现

// 游戏21: 立体几何
function loadGeometry3D() {
    const problems = [
        {
            shape: '正方体',
            edge: 4,
            question: '棱长为4的正方体，表面积是多少？',
            answer: 96,
            formula: '6 × 4² = 96'
        },
        {
            shape: '正方体',
            edge: 3,
            question: '棱长为3的正方体，体积是多少？',
            answer: 27,
            formula: '3³ = 27'
        },
        {
            shape: '长方体',
            dimensions: [2, 3, 4],
            question: '长2、宽3、高4的长方体，表面积是多少？',
            answer: 52,
            formula: '2×(2×3 + 2×4 + 3×4) = 52'
        },
        {
            shape: '长方体',
            dimensions: [2, 3, 4],
            question: '长2、宽3、高4的长方体，体积是多少？',
            answer: 24,
            formula: '2 × 3 × 4 = 24'
        }
    ];
    
    const problem = problems[Math.floor(Math.random() * problems.length)];
    window.geoProblem = problem;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="geometry-game">
            <h3>立体几何</h3>
            <div class="geo-shape">
                <div class="shape-display">
                    ${drawShape(problem)}
                </div>
                <div class="shape-info">
                    ${problem.shape}
                    ${problem.edge ? `<br>棱长: ${problem.edge}` : ''}
                    ${problem.dimensions ? `<br>长: ${problem.dimensions[0]}, 宽: ${problem.dimensions[1]}, 高: ${problem.dimensions[2]}` : ''}
                </div>
            </div>
            <div class="geo-question">
                ${problem.question}
            </div>
            <div class="geo-input">
                <input type="number" id="geoAnswer" placeholder="输入答案">
                <button onclick="checkGeoAnswer()">提交</button>
            </div>
            <div class="geo-controls">
                <button onclick="getGeoHint()">提示</button>
                <button onclick="loadGeometry3D()">新题目</button>
            </div>
            <div id="geoFeedback"></div>
        </div>
    `;
}

function drawShape(problem) {
    if (problem.shape === '正方体') {
        return `
            <div class="cube">
                <div class="cube-face front">${problem.edge}</div>
                <div class="cube-face back"></div>
                <div class="cube-face left"></div>
                <div class="cube-face right"></div>
                <div class="cube-face top"></div>
                <div class="cube-face bottom"></div>
            </div>
        `;
    } else if (problem.shape === '长方体') {
        return `
            <div class="cuboid">
                <div class="cuboid-face front">${problem.dimensions[0]}×${problem.dimensions[1]}</div>
                <div class="cuboid-face back"></div>
                <div class="cuboid-face left">${problem.dimensions[1]}×${problem.dimensions[2]}</div>
                <div class="cuboid-face right"></div>
                <div class="cuboid-face top">${problem.dimensions[0]}×${problem.dimensions[2]}</div>
                <div class="cuboid-face bottom"></div>
            </div>
        `;
    }
    return '<div class="shape-placeholder">📐</div>';
}

function checkGeoAnswer() {
    const userAnswer = parseInt(document.getElementById('geoAnswer').value);
    const feedback = document.getElementById('geoFeedback');
    const problem = window.geoProblem;
    
    if (userAnswer === problem.answer) {
        feedback.innerHTML = `<div class="success">✅ 正确！计算过程：${problem.formula}</div>`;
        gamesManager.gameScore += 200;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        setTimeout(() => loadGeometry3D(), 2000);
    } else {
        feedback.innerHTML = '<div class="error">❌ 不对，再算算看</div>';
    }
}

function getGeoHint() {
    const problem = window.geoProblem;
    const feedback = document.getElementById('geoFeedback');
    
    if (problem.question.includes('表面积')) {
        if (problem.shape === '正方体') {
            feedback.innerHTML = '<div class="info">💡 正方体表面积 = 6 × 棱长²</div>';
        } else {
            feedback.innerHTML = '<div class="info">💡 长方体表面积 = 2×(长×宽 + 长×高 + 宽×高)</div>';
        }
    } else {
        if (problem.shape === '正方体') {
            feedback.innerHTML = '<div class="info">💡 正方体体积 = 棱长³</div>';
        } else {
            feedback.innerHTML = '<div class="info">💡 长方体体积 = 长 × 宽 × 高</div>';
        }
    }
}

// 游戏22: 图形计数
function loadShapeCount() {
    const problems = [
        {
            type: 'triangles',
            image: '大三角形中包含小三角形',
            answer: 13,
            hint: '注意：不同大小的三角形都要数'
        },
        {
            type: 'squares',
            image: '3×3网格',
            answer: 14,
            hint: '1×1有9个，2×2有4个，3×3有1个'
        },
        {
            type: 'rectangles',
            image: '2×3网格',
            answer: 18,
            hint: '包括正方形和长方形'
        }
    ];
    
    const problem = problems[Math.floor(Math.random() * problems.length)];
    window.countProblem = problem;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="shape-count-game">
            <h3>图形计数</h3>
            <div class="count-display">
                ${drawCountingShape(problem.type)}
            </div>
            <div class="count-question">
                数一数：上面图形中总共有多少个${
                    problem.type === 'triangles' ? '三角形' :
                    problem.type === 'squares' ? '正方形' :
                    '矩形'
                }？
            </div>
            <div class="count-input">
                <input type="number" id="countAnswer" placeholder="输入数量">
                <button onclick="checkCountAnswer()">提交</button>
            </div>
            <div class="count-controls">
                <button onclick="getCountHint()">提示</button>
                <button onclick="loadShapeCount()">新题目</button>
            </div>
            <div id="countFeedback"></div>
        </div>
    `;
}

function drawCountingShape(type) {
    if (type === 'triangles') {
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <polygon points="100,20 180,180 20,180" fill="none" stroke="#667eea" stroke-width="2"/>
                <line x1="100" y1="20" x2="100" y2="180" stroke="#667eea" stroke-width="2"/>
                <line x1="60" y1="100" x2="140" y2="100" stroke="#667eea" stroke-width="2"/>
                <line x1="50" y1="150" x2="150" y2="150" stroke="#667eea" stroke-width="2"/>
            </svg>
        `;
    } else if (type === 'squares') {
        return `
            <div class="grid-3x3">
                ${Array(9).fill().map((_, i) => 
                    `<div class="grid-cell">${i + 1}</div>`
                ).join('')}
            </div>
        `;
    } else {
        return `
            <div class="grid-2x3">
                ${Array(6).fill().map((_, i) => 
                    `<div class="grid-cell">${i + 1}</div>`
                ).join('')}
            </div>
        `;
    }
}

function checkCountAnswer() {
    const userAnswer = parseInt(document.getElementById('countAnswer').value);
    const feedback = document.getElementById('countFeedback');
    const problem = window.countProblem;
    
    if (userAnswer === problem.answer) {
        feedback.innerHTML = '<div class="success">✅ 正确！你的观察力真棒！</div>';
        gamesManager.gameScore += 150;
        document.getElementById('gameScore').textContent = gamesManager.gameScore;
        setTimeout(() => loadShapeCount(), 2000);
    } else if (Math.abs(userAnswer - problem.answer) <= 2) {
        feedback.innerHTML = '<div class="warning">很接近了！再仔细数数</div>';
    } else {
        feedback.innerHTML = '<div class="error">❌ 不对，再仔细观察</div>';
    }
}

function getCountHint() {
    const feedback = document.getElementById('countFeedback');
    feedback.innerHTML = `<div class="info">💡 ${window.countProblem.hint}</div>`;
}

// 游戏23: 对称图形
function loadSymmetry() {
    window.symmetryGame = {
        score: 0,
        level: 1
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="symmetry-game">
            <h3>对称图形 - 完成对称的另一半</h3>
            <div class="symmetry-info">
                <span>等级: <span id="symLevel">1</span></span>
                <span>得分: <span id="symScore">0</span></span>
            </div>
            <div class="symmetry-grid" id="symGrid"></div>
            <div class="symmetry-controls">
                <button onclick="checkSymmetry()">检查</button>
                <button onclick="clearSymmetry()">清空</button>
                <button onclick="newSymmetryProblem()">新题目</button>
            </div>
            <div id="symFeedback"></div>
        </div>
    `;
    
    newSymmetryProblem();
}

function newSymmetryProblem() {
    const size = 8;
    const grid = [];
    
    // 生成左半边图案
    for (let i = 0; i < size; i++) {
        grid[i] = [];
        for (let j = 0; j < size; j++) {
            if (j < size / 2) {
                // 左半边随机
                grid[i][j] = Math.random() < 0.3 ? 1 : 0;
            } else {
                // 右半边初始为空
                grid[i][j] = -1;
            }
        }
    }
    
    window.symmetryGrid = grid;
    drawSymmetryGrid();
}

function drawSymmetryGrid() {
    const grid = window.symmetryGrid;
    const container = document.getElementById('symGrid');
    container.innerHTML = '';
    
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            const div = document.createElement('div');
            div.className = 'sym-cell';
            
            if (j === 4) {
                div.classList.add('axis');
            }
            
            if (cell === 1) {
                div.classList.add('filled');
            } else if (cell === -1) {
                div.classList.add('empty');
                div.onclick = () => toggleSymCell(i, j);
            }
            
            div.dataset.row = i;
            div.dataset.col = j;
            container.appendChild(div);
        });
    });
}

function toggleSymCell(row, col) {
    const grid = window.symmetryGrid;
    grid[row][col] = grid[row][col] === -1 ? 1 : -1;
    
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (grid[row][col] === 1) {
        cell.classList.add('user-filled');
    } else {
        cell.classList.remove('user-filled');
    }
}

function checkSymmetry() {
    const grid = window.symmetryGrid;
    const size = grid.length;
    let correct = true;
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size / 2; j++) {
            const mirrorJ = size - 1 - j;
            const left = grid[i][j];
            const right = grid[i][mirrorJ] === -1 ? 0 : grid[i][mirrorJ];
            
            if (left !== right) {
                correct = false;
                // 标记错误
                const cell = document.querySelector(`[data-row="${i}"][data-col="${mirrorJ}"]`);
                cell.classList.add('wrong');
            }
        }
    }
    
    const feedback = document.getElementById('symFeedback');
    if (correct) {
        const game = window.symmetryGame;
        const points = 100 * game.level;
        game.score += points;
        game.level++;
        
        feedback.innerHTML = `<div class="success">✅ 完美对称！+${points}分</div>`;
        document.getElementById('symScore').textContent = game.score;
        document.getElementById('symLevel').textContent = game.level;
        
        gamesManager.gameScore = game.score;
        document.getElementById('gameScore').textContent = game.score;
        
        setTimeout(() => newSymmetryProblem(), 1500);
    } else {
        feedback.innerHTML = '<div class="error">❌ 还不完全对称</div>';
        setTimeout(() => {
            document.querySelectorAll('.wrong').forEach(cell => {
                cell.classList.remove('wrong');
            });
        }, 1000);
    }
}

function clearSymmetry() {
    const grid = window.symmetryGrid;
    const size = grid.length;
    
    for (let i = 0; i < size; i++) {
        for (let j = size / 2; j < size; j++) {
            grid[i][j] = -1;
        }
    }
    
    drawSymmetryGrid();
}

// 游戏24: 旋转方块
function loadRotateBlocks() {
    window.rotateGame = {
        score: 0,
        currentRotation: 0,
        targetRotation: 0
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="rotate-game">
            <h3>旋转方块 - 旋转到目标角度</h3>
            <div class="rotate-info">
                <span>得分: <span id="rotateScore">0</span></span>
            </div>
            <div class="rotate-display">
                <div class="rotate-source">
                    <h4>当前状态</h4>
                    <div class="rotate-block" id="currentBlock"></div>
                    <div class="angle-display">角度: <span id="currentAngle">0</span>°</div>
                </div>
                <div class="rotate-target">
                    <h4>目标状态</h4>
                    <div class="rotate-block" id="targetBlock"></div>
                    <div class="angle-display">角度: <span id="targetAngle">90</span>°</div>
                </div>
            </div>
            <div class="rotate-controls">
                <button onclick="rotateBlock(-90)">↺ 左转90°</button>
                <button onclick="rotateBlock(90)">↻ 右转90°</button>
                <button onclick="rotateBlock(45)">↻ 右转45°</button>
                <button onclick="checkRotation()">检查</button>
            </div>
            <button onclick="newRotateProblem()">新题目</button>
            <div id="rotateFeedback"></div>
        </div>
    `;
    
    newRotateProblem();
}

function newRotateProblem() {
    const game = window.rotateGame;
    
    // 随机目标角度
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    game.targetRotation = angles[Math.floor(Math.random() * angles.length)];
    game.currentRotation = 0;
    
    // 创建图案
    const pattern = createBlockPattern();
    
    document.getElementById('currentBlock').innerHTML = pattern;
    document.getElementById('targetBlock').innerHTML = pattern;
    
    document.getElementById('currentBlock').style.transform = `rotate(0deg)`;
    document.getElementById('targetBlock').style.transform = `rotate(${game.targetRotation}deg)`;
    
    document.getElementById('currentAngle').textContent = '0';
    document.getElementById('targetAngle').textContent = game.targetRotation;
}

function createBlockPattern() {
    return `
        <div class="block-pattern">
            <div class="block-quarter top-left" style="background: #FF6B6B;"></div>
            <div class="block-quarter top-right" style="background: #4ECDC4;"></div>
            <div class="block-quarter bottom-left" style="background: #45B7D1;"></div>
            <div class="block-quarter bottom-right" style="background: #FFEAA7;"></div>
            <div class="block-arrow">↑</div>
        </div>
    `;
}

function rotateBlock(degrees) {
    const game = window.rotateGame;
    game.currentRotation = (game.currentRotation + degrees + 360) % 360;
    
    document.getElementById('currentBlock').style.transform = `rotate(${game.currentRotation}deg)`;
    document.getElementById('currentAngle').textContent = game.currentRotation;
}

function checkRotation() {
    const game = window.rotateGame;
    const feedback = document.getElementById('rotateFeedback');
    
    if (game.currentRotation === game.targetRotation) {
        game.score += 100;
        feedback.innerHTML = '<div class="success">✅ 完美匹配！</div>';
        document.getElementById('rotateScore').textContent = game.score;
        
        gamesManager.gameScore = game.score;
        document.getElementById('gameScore').textContent = game.score;
        
        setTimeout(() => newRotateProblem(), 1500);
    } else {
        const diff = Math.abs(game.currentRotation - game.targetRotation);
        const minDiff = Math.min(diff, 360 - diff);
        
        if (minDiff <= 45) {
            feedback.innerHTML = `<div class="warning">很接近了！还差${minDiff}°</div>`;
        } else {
            feedback.innerHTML = '<div class="error">❌ 角度不对</div>';
        }
    }
}

// 游戏25: 七巧板
function loadTangram() {
    const puzzles = [
        { name: '正方形', difficulty: '简单', pieces: 7 },
        { name: '三角形', difficulty: '简单', pieces: 7 },
        { name: '房子', difficulty: '中等', pieces: 7 },
        { name: '小鸟', difficulty: '困难', pieces: 7 }
    ];
    
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    window.tangramPuzzle = puzzle;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="tangram-game">
            <h3>七巧板 - 拼出${puzzle.name}</h3>
            <div class="tangram-info">
                难度: ${puzzle.difficulty} | 使用${puzzle.pieces}块板
            </div>
            <div class="tangram-board">
                <div class="tangram-target">
                    <h4>目标图形</h4>
                    <div class="target-shape">${drawTangramTarget(puzzle.name)}</div>
                </div>
                <div class="tangram-workspace">
                    <h4>工作区</h4>
                    <div id="workspace"></div>
                </div>
            </div>
            <div class="tangram-pieces" id="tangramPieces">
                ${createTangramPieces()}
            </div>
            <div class="tangram-controls">
                <button onclick="resetTangram()">重置</button>
                <button onclick="showTangramSolution()">查看答案</button>
                <button onclick="loadTangram()">新题目</button>
            </div>
            <div id="tangramFeedback"></div>
        </div>
    `;
}

function drawTangramTarget(shape) {
    const shapes = {
        '正方形': '⬜',
        '三角形': '🔺',
        '房子': '🏠',
        '小鸟': '🐦'
    };
    
    return `<div class="target-icon">${shapes[shape] || '❓'}</div>`;
}

function createTangramPieces() {
    const pieces = [
        { type: 'triangle-large', color: '#FF6B6B' },
        { type: 'triangle-large', color: '#4ECDC4' },
        { type: 'triangle-medium', color: '#45B7D1' },
        { type: 'triangle-small', color: '#FFEAA7' },
        { type: 'triangle-small', color: '#96CEB4' },
        { type: 'square', color: '#DFE6E9' },
        { type: 'parallelogram', color: '#FDCB6E' }
    ];
    
    return pieces.map((piece, i) => `
        <div class="tangram-piece ${piece.type}" 
             style="background: ${piece.color};"
             draggable="true"
             data-piece="${i}"
             ondragstart="dragPiece(event)">
        </div>
    `).join('');
}

function dragPiece(event) {
    event.dataTransfer.setData('piece', event.target.dataset.piece);
}

function resetTangram() {
    document.getElementById('workspace').innerHTML = '';
    document.getElementById('tangramFeedback').innerHTML = '';
}

function showTangramSolution() {
    const feedback = document.getElementById('tangramFeedback');
    feedback.innerHTML = '<div class="info">💡 提示：先放大块，再填小块</div>';
}

// 注册游戏到gameImplementations
if (typeof gameImplementations !== 'undefined') {
    gameImplementations[21] = loadGeometry3D;
    gameImplementations[22] = loadShapeCount;
    gameImplementations[23] = loadSymmetry;
    gameImplementations[24] = loadRotateBlocks;
    gameImplementations[25] = loadTangram;
}
