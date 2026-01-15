// 综合挑战类游戏实现

// 游戏26: 数学大富翁
function loadMathMonopoly() {
    window.monopolyGame = {
        position: 0,
        money: 1000,
        properties: [],
        round: 0,
        boardSize: 20
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="monopoly-game">
            <h3>数学大富翁 - 答题赢金币</h3>
            <div class="monopoly-info">
                <span>💰 金币: <span id="moneyCount">${window.monopolyGame.money}</span></span>
                <span>📍 位置: <span id="position">0</span></span>
                <span>🏠 财产: <span id="properties">0</span></span>
            </div>
            <div class="monopoly-board" id="monopolyBoard"></div>
            <div class="monopoly-center">
                <div id="diceResult"></div>
                <button onclick="rollDice()" id="rollBtn">🎲 掷骰子</button>
                <div id="questionArea"></div>
            </div>
            <div id="monopolyFeedback"></div>
        </div>
    `;
    
    createMonopolyBoard();
}

function createMonopolyBoard() {
    const board = document.getElementById('monopolyBoard');
    const size = window.monopolyGame.boardSize;
    
    for (let i = 0; i < size; i++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.position = i;
        
        // 特殊格子
        if (i === 0) {
            cell.innerHTML = '🏁 起点';
            cell.classList.add('start');
        } else if (i % 5 === 0) {
            cell.innerHTML = '💎 奖励';
            cell.classList.add('bonus');
        } else if (i % 7 === 0) {
            cell.innerHTML = '⚡ 挑战';
            cell.classList.add('challenge');
        } else {
            cell.innerHTML = `${i}`;
        }
        
        board.appendChild(cell);
    }
    
    // 放置玩家
    updatePlayerPosition();
}

function rollDice() {
    const game = window.monopolyGame;
    const dice = Math.floor(Math.random() * 6) + 1;
    
    document.getElementById('diceResult').innerHTML = `🎲 掷出了 ${dice}`;
    document.getElementById('rollBtn').disabled = true;
    
    // 移动玩家
    const oldPos = game.position;
    game.position = (game.position + dice) % game.boardSize;
    
    // 动画移动
    animateMove(oldPos, game.position);
    
    setTimeout(() => {
        landOnCell();
    }, 1000);
}

function animateMove(from, to) {
    const game = window.monopolyGame;
    let current = from;
    
    const moveStep = () => {
        // 清除旧位置
        document.querySelector('.player-token')?.classList.remove('player-token');
        
        current = (current + 1) % game.boardSize;
        document.querySelector(`[data-position="${current}"]`).classList.add('player-token');
        
        if (current !== to) {
            setTimeout(moveStep, 200);
        }
    };
    
    moveStep();
}

function updatePlayerPosition() {
    document.querySelectorAll('.player-token').forEach(el => {
        el.classList.remove('player-token');
    });
    
    const pos = window.monopolyGame.position;
    document.querySelector(`[data-position="${pos}"]`).classList.add('player-token');
    document.getElementById('position').textContent = pos;
}

function landOnCell() {
    const game = window.monopolyGame;
    const cell = document.querySelector(`[data-position="${game.position}"]`);
    
    if (cell.classList.contains('bonus')) {
        // 奖励格
        game.money += 200;
        document.getElementById('moneyCount').textContent = game.money;
        document.getElementById('monopolyFeedback').innerHTML = 
            '<div class="success">🎁 获得200金币奖励！</div>';
        document.getElementById('rollBtn').disabled = false;
    } else if (cell.classList.contains('challenge')) {
        // 挑战格
        showMonopolyQuestion();
    } else {
        // 普通格
        showMonopolyQuestion();
    }
}

function showMonopolyQuestion() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let answer;
    let question;
    
    switch(op) {
        case '+':
            answer = a + b;
            question = `${a} + ${b}`;
            break;
        case '-':
            answer = Math.max(a, b) - Math.min(a, b);
            question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
            break;
        case '×':
            const x = Math.min(a, 12);
            const y = Math.min(b, 12);
            answer = x * y;
            question = `${x} × ${y}`;
            break;
    }
    
    window.monopolyAnswer = answer;
    
    document.getElementById('questionArea').innerHTML = `
        <div class="monopoly-question">
            <h4>答题赢金币: ${question} = ?</h4>
            <input type="number" id="monopolyAnswerInput" placeholder="答案">
            <button onclick="checkMonopolyAnswer()">提交</button>
        </div>
    `;
}

function checkMonopolyAnswer() {
    const game = window.monopolyGame;
    const userAnswer = parseInt(document.getElementById('monopolyAnswerInput').value);
    const feedback = document.getElementById('monopolyFeedback');
    
    if (userAnswer === window.monopolyAnswer) {
        const reward = 100;
        game.money += reward;
        feedback.innerHTML = `<div class="success">✅ 正确！获得${reward}金币</div>`;
        
        gamesManager.gameScore = game.money;
        document.getElementById('gameScore').textContent = game.money;
    } else {
        const penalty = 50;
        game.money = Math.max(0, game.money - penalty);
        feedback.innerHTML = `<div class="error">❌ 错误！损失${penalty}金币</div>`;
    }
    
    document.getElementById('moneyCount').textContent = game.money;
    document.getElementById('questionArea').innerHTML = '';
    document.getElementById('rollBtn').disabled = false;
}

// 游戏27: 数字消消乐
function loadNumberCrush() {
    const size = 8;
    const board = [];
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = Math.floor(Math.random() * 5) + 1;
        }
    }
    
    window.crushGame = {
        board: board,
        score: 0,
        moves: 30,
        selected: null
    };
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="crush-game">
            <h3>数字消消乐 - 连接相同数字消除</h3>
            <div class="crush-info">
                <span>得分: <span id="crushScore">0</span></span>
                <span>步数: <span id="movesLeft">30</span></span>
                <span>目标: <span id="crushTarget">1000</span></span>
            </div>
            <div class="crush-board" id="crushBoard"></div>
            <div class="crush-controls">
                <button onclick="shuffleCrush()">洗牌</button>
                <button onclick="getCrushHint()">提示</button>
            </div>
            <div id="crushFeedback"></div>
        </div>
    `;
    
    drawCrushBoard();
}

function drawCrushBoard() {
    const game = window.crushGame;
    const board = document.getElementById('crushBoard');
    board.innerHTML = '';
    
    game.board.forEach((row, i) => {
        row.forEach((num, j) => {
            const tile = document.createElement('div');
            tile.className = 'crush-tile';
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.textContent = num;
            tile.style.background = getNumberGradient(num);
            tile.onclick = () => selectCrushTile(i, j);
            board.appendChild(tile);
        });
    });
}

function getNumberGradient(num) {
    const gradients = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)'
    ];
    return gradients[num - 1];
}

function selectCrushTile(row, col) {
    const game = window.crushGame;
    
    if (game.selected === null) {
        // 第一次选择
        game.selected = {row, col};
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
    } else {
        // 第二次选择
        const first = game.selected;
        
        // 检查是否相邻
        const isAdjacent = 
            (Math.abs(first.row - row) === 1 && first.col === col) ||
            (Math.abs(first.col - col) === 1 && first.row === row);
        
        if (isAdjacent) {
            // 交换
            swapAndCheck(first, {row, col});
        }
        
        // 清除选择
        document.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });
        game.selected = null;
    }
}

function swapAndCheck(pos1, pos2) {
    const game = window.crushGame;
    const board = game.board;
    
    // 交换
    [board[pos1.row][pos1.col], board[pos2.row][pos2.col]] = 
    [board[pos2.row][pos2.col], board[pos1.row][pos1.col]];
    
    // 检查消除
    const matches = findMatches();
    
    if (matches.length > 0) {
        // 有消除
        removeMatches(matches);
        game.moves--;
        document.getElementById('movesLeft').textContent = game.moves;
        
        // 下落和填充
        setTimeout(() => {
            dropTiles();
            fillBoard();
            drawCrushBoard();
            
            // 检查游戏结束
            if (game.moves <= 0) {
                endCrushGame();
            }
        }, 500);
    } else {
        // 没有消除，换回来
        [board[pos1.row][pos1.col], board[pos2.row][pos2.col]] = 
        [board[pos2.row][pos2.col], board[pos1.row][pos1.col]];
        drawCrushBoard();
    }
}

function findMatches() {
    const game = window.crushGame;
    const board = game.board;
    const matches = [];
    
    // 检查横向
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] === board[i][j+1] && board[i][j] === board[i][j+2]) {
                matches.push({row: i, col: j}, {row: i, col: j+1}, {row: i, col: j+2});
            }
        }
    }
    
    // 检查纵向
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === board[i+1][j] && board[i][j] === board[i+2][j]) {
                matches.push({row: i, col: j}, {row: i+1, col: j}, {row: i+2, col: j});
            }
        }
    }
    
    // 去重
    const unique = [];
    matches.forEach(m => {
        if (!unique.some(u => u.row === m.row && u.col === m.col)) {
            unique.push(m);
        }
    });
    
    return unique;
}

function removeMatches(matches) {
    const game = window.crushGame;
    
    matches.forEach(m => {
        game.board[m.row][m.col] = 0;
        game.score += 10;
    });
    
    document.getElementById('crushScore').textContent = game.score;
    gamesManager.gameScore = game.score;
    document.getElementById('gameScore').textContent = game.score;
    
    if (game.score >= 1000) {
        document.getElementById('crushFeedback').innerHTML = 
            '<div class="success">🎉 达成目标分数！</div>';
    }
}

function dropTiles() {
    const game = window.crushGame;
    const board = game.board;
    
    for (let j = 0; j < 8; j++) {
        let writePos = 7;
        for (let i = 7; i >= 0; i--) {
            if (board[i][j] !== 0) {
                board[writePos][j] = board[i][j];
                if (writePos !== i) board[i][j] = 0;
                writePos--;
            }
        }
    }
}

function fillBoard() {
    const game = window.crushGame;
    const board = game.board;
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 0) {
                board[i][j] = Math.floor(Math.random() * 5) + 1;
            }
        }
    }
}

function shuffleCrush() {
    const game = window.crushGame;
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            game.board[i][j] = Math.floor(Math.random() * 5) + 1;
        }
    }
    
    drawCrushBoard();
}

function getCrushHint() {
    document.getElementById('crushFeedback').innerHTML = 
        '<div class="info">💡 寻找可以形成3个相同数字的交换</div>';
}

function endCrushGame() {
    const game = window.crushGame;
    const feedback = document.getElementById('crushFeedback');
    
    if (game.score >= 1000) {
        feedback.innerHTML = `<div class="success">🎉 游戏胜利！最终得分: ${game.score}</div>`;
    } else {
        feedback.innerHTML = `<div class="error">游戏结束！最终得分: ${game.score}</div>`;
    }
}

// 游戏28-30 简化实现
function loadArithmeticTower() {
    showComingSoon('算术塔防', '计算防御敌人', '🏰');
}

function loadMathAdventure() {
    showComingSoon('数学闯关', '通过数学关卡', '🚀');
}

function loadBrainStorm() {
    showComingSoon('脑力风暴', '综合能力测试', '🌪️');
}

function showComingSoon(name, desc, icon) {
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="coming-soon">
            <div class="game-icon-large">${icon}</div>
            <h2>${name}</h2>
            <p>${desc}</p>
            <div class="coming-soon-message">
                <p>🚀 游戏正在开发中</p>
                <p>敬请期待更多精彩内容！</p>
            </div>
            <button onclick="backToGameList()" class="btn-primary">返回游戏列表</button>
        </div>
    `;
}

// 注册游戏到gameImplementations
if (typeof gameImplementations !== 'undefined') {
    gameImplementations[26] = loadMathMonopoly;
    gameImplementations[27] = loadNumberCrush;
    gameImplementations[28] = loadArithmeticTower;
    gameImplementations[29] = loadMathAdventure;
    gameImplementations[30] = loadBrainStorm;
}
