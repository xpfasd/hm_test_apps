// 速算挑战类游戏实现

// 游戏6: 心算大师
function loadMentalMath() {
    let timeLeft = 60;
    window.mentalMathGame = {
        score: 0,
        streak: 0,
        bestStreak: 0
    };
    
    const generateQuestion = () => {
        const ops = ['+', '-', '×', '÷'];
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
            case '÷':
                b = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                a = b * answer;
                break;
        }
        
        return { question: `${a} ${op} ${b} = ?`, answer };
    };
    
    let currentQuestion = generateQuestion();
    window.currentMathAnswer = currentQuestion.answer;
    window.generateNewQuestion = generateQuestion;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="mental-math-game">
            <div class="game-stats">
                <div class="game-timer">时间: <span id="timeLeft">60</span>秒</div>
                <div class="game-score">得分: <span id="mentalScore">0</span></div>
                <div class="game-streak">连击: <span id="streak">0</span></div>
            </div>
            <div class="math-question" id="mathQuestion">${currentQuestion.question}</div>
            <div class="math-input">
                <input type="number" id="mathAnswer" placeholder="输入答案" autofocus>
                <button onclick="submitMathAnswer()">提交</button>
            </div>
            <div id="mathFeedback"></div>
        </div>
    `;
    
    // 添加回车提交
    document.getElementById('mathAnswer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitMathAnswer();
    });
    
    // 启动计时器
    gamesManager.gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gamesManager.gameTimer);
            showAlert(`游戏结束！得分: ${window.mentalMathGame.score}\n最佳连击: ${window.mentalMathGame.bestStreak}`, '心算大师');
        }
    }, 1000);
}

function submitMathAnswer() {
    const mathAnswerEl = document.getElementById('mathAnswer');
    const feedback = document.getElementById('mathFeedback');
    const game = window.mentalMathGame;
    
    if (!mathAnswerEl || !feedback || !game) return;
    
    const userAnswer = parseInt(mathAnswerEl.value);
    
    if (userAnswer === window.currentMathAnswer) {
        game.streak++;
        game.bestStreak = Math.max(game.bestStreak, game.streak);
        
        // 连击加成
        const points = 10 * Math.min(game.streak, 10);
        game.score += points;
        
        feedback.innerHTML = `<div class="success">✅ 正确！+${points}分</div>`;
        
        const mentalScore = document.getElementById('mentalScore');
        const streakEl = document.getElementById('streak');
        if (mentalScore) mentalScore.textContent = game.score;
        if (streakEl) streakEl.textContent = game.streak;
        
        gamesManager.gameScore = game.score;
        const gameScore = document.getElementById('gameScore');
        if (gameScore) gameScore.textContent = game.score;
        
        // 生成新题目
        const newQuestion = window.generateNewQuestion();
        window.currentMathAnswer = newQuestion.answer;
        
        const mathQuestion = document.getElementById('mathQuestion');
        if (mathQuestion) mathQuestion.textContent = newQuestion.question;
        mathAnswerEl.value = '';
        mathAnswerEl.focus();
    } else {
        game.streak = 0;
        feedback.innerHTML = `<div class="error">❌ 错误，答案是 ${window.currentMathAnswer}</div>`;
        const streakEl = document.getElementById('streak');
        if (streakEl) streakEl.textContent = '0';
    }
}

// 游戏7: 24点游戏
function load24Points() {
    const generateCards = () => {
        const cards = [];
        for (let i = 0; i < 4; i++) {
            cards.push(Math.floor(Math.random() * 13) + 1);
        }
        return cards;
    };
    
    const cards = generateCards();
    window.cards24 = cards;
    window.attempts24 = 0;
    
    const container = document.getElementById('gameContainer');
    container.innerHTML = `
        <div class="points24-game">
            <h3>使用加减乘除，让4张牌的结果等于24</h3>
            <div class="cards-display">
                ${cards.map((c, i) => `
                    <div class="playing-card" id="card${i}">
                        ${c > 10 ? ['J','Q','K'][c-11] : c}
                    </div>
                `).join('')}
            </div>
            <div class="expression-input">
                <input type="text" id="expression" placeholder="输入算式，如: (1+2)*3*4">
                <button onclick="check24Expression()">验证</button>
            </div>
            <div class="game-controls">
                <button onclick="get24Hint()">提示</button>
                <button onclick="load24Points()">新题</button>
            </div>
            <div id="points24Feedback"></div>
            <div class="game-hint">
                提示：使用括号改变运算顺序，每张牌必须用且只能用一次
            </div>
        </div>
    `;
}

function check24Expression() {
    const expressionEl = document.getElementById('expression');
    const feedback = document.getElementById('points24Feedback');
    const cards = window.cards24;
    
    if (!expressionEl || !feedback || !cards) return;
    
    const expression = expressionEl.value;
    
    try {
        // 验证是否使用了所有牌
        const nums = expression.match(/\d+/g);
        if (!nums || nums.length !== 4) {
            feedback.innerHTML = '<div class="error">请使用所有4张牌</div>';
            return;
        }
        
        // 检查数字是否匹配
        const sortedCards = [...cards].sort();
        const sortedNums = nums.map(n => parseInt(n)).sort();
        
        if (JSON.stringify(sortedCards) !== JSON.stringify(sortedNums)) {
            feedback.innerHTML = '<div class="error">请使用给定的牌面数字</div>';
            return;
        }
        
        // 计算结果
        const result = eval(expression);
        if (Math.abs(result - 24) < 0.001) {
            feedback.innerHTML = '<div class="success">🎉 太棒了！答案正确！</div>';
            const score = Math.max(100, 500 - window.attempts24 * 50);
            gamesManager.gameScore += score;
            const gameScore = document.getElementById('gameScore');
            if (gameScore) gameScore.textContent = gamesManager.gameScore;
            setTimeout(() => load24Points(), 2000);
        } else {
            window.attempts24++;
            feedback.innerHTML = `<div class="error">结果是 ${result}，不等于 24</div>`;
        }
    } catch (e) {
        feedback.innerHTML = '<div class="error">表达式格式错误</div>';
    }
}

function get24Hint() {
    const feedback = document.getElementById('points24Feedback');
    feedback.innerHTML = '<div class="info">💡 试试不同的运算组合和括号位置</div>';
    window.attempts24 += 2;
}

// 游戏8: 速算接力
function loadSpeedRelay() {
    const container = document.getElementById('gameContainer');
    window.relayGame = {
        level: 1,
        score: 0,
        timePerQuestion: 5,
        questionsPerLevel: 5,
        currentQuestion: 0
    };
    
    container.innerHTML = `
        <div class="relay-game">
            <h3>速算接力赛</h3>
            <div class="relay-stats">
                <div>关卡: <span id="relayLevel">1</span></div>
                <div>得分: <span id="relayScore">0</span></div>
                <div>进度: <span id="relayProgress">0</span>/${window.relayGame.questionsPerLevel}</div>
            </div>
            <div class="relay-timer-bar">
                <div id="relayTimerFill" class="timer-fill"></div>
            </div>
            <div class="relay-question" id="relayQuestion"></div>
            <div class="relay-answers" id="relayAnswers"></div>
            <div id="relayFeedback"></div>
        </div>
    `;
    
    generateRelayQuestion();
}

function generateRelayQuestion() {
    const game = window.relayGame;
    if (!game) return;
    
    const level = game.level;
    
    // 根据关卡生成题目难度
    let a = Math.floor(Math.random() * (10 * level)) + level;
    let b = Math.floor(Math.random() * (10 * level)) + level;
    let answer;
    let question;
    
    if (level <= 2) {
        // 加减法
        if (Math.random() < 0.5) {
            answer = a + b;
            question = `${a} + ${b}`;
        } else {
            answer = a - b;
            question = `${a} - ${b}`;
        }
    } else {
        // 混合运算
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        
        switch(op) {
            case '+':
                answer = a + b;
                question = `${a} + ${b}`;
                break;
            case '-':
                answer = a - b;
                question = `${a} - ${b}`;
                break;
            case '×':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                question = `${a} × ${b}`;
                break;
        }
    }
    
    // 生成选项
    const options = [answer];
    while (options.length < 4) {
        const wrong = answer + Math.floor(Math.random() * 21) - 10;
        if (!options.includes(wrong)) {
            options.push(wrong);
        }
    }
    options.sort(() => Math.random() - 0.5);
    
    const questionEl = document.getElementById('relayQuestion');
    const answersEl = document.getElementById('relayAnswers');
    
    if (!questionEl || !answersEl) return;
    
    questionEl.textContent = question;
    answersEl.innerHTML = options.map(opt => 
        `<button class="relay-option" onclick="checkRelayAnswer(${opt}, ${answer})">${opt}</button>`
    ).join('');
    
    // 启动计时器
    startRelayTimer();
}

function startRelayTimer() {
    const game = window.relayGame;
    if (!game) return;
    
    const fill = document.getElementById('relayTimerFill');
    if (!fill) return;
    
    fill.style.width = '100%';
    fill.style.transition = `width ${game.timePerQuestion}s linear`;
    
    setTimeout(() => {
        if (fill) fill.style.width = '0%';
    }, 50);
    
    clearTimeout(window.relayTimeout);
    window.relayTimeout = setTimeout(() => {
        checkRelayAnswer(null, null);
    }, game.timePerQuestion * 1000);
}

function checkRelayAnswer(selected, correct) {
    clearTimeout(window.relayTimeout);
    const game = window.relayGame;
    if (!game) return;
    
    const feedback = document.getElementById('relayFeedback');
    const relayScore = document.getElementById('relayScore');
    const relayProgress = document.getElementById('relayProgress');
    const relayLevel = document.getElementById('relayLevel');
    
    // 检查必要元素是否存在
    if (!feedback || !relayScore || !relayProgress) return;
    
    if (selected === correct) {
        game.score += 10 * game.level;
        game.currentQuestion++;
        feedback.innerHTML = '<div class="success">✅ 正确！</div>';
    } else {
        feedback.innerHTML = `<div class="error">❌ ${selected === null ? '时间到！' : '错误！'}</div>`;
        game.currentQuestion++;
    }
    
    relayScore.textContent = game.score;
    relayProgress.textContent = game.currentQuestion;
    
    gamesManager.gameScore = game.score;
    const gameScore = document.getElementById('gameScore');
    if (gameScore) gameScore.textContent = game.score;
    
    if (game.currentQuestion >= game.questionsPerLevel) {
        // 进入下一关
        game.level++;
        game.currentQuestion = 0;
        game.timePerQuestion = Math.max(2, 5 - game.level * 0.3);
        
        if (relayLevel) relayLevel.textContent = game.level;
        feedback.innerHTML = `<div class="success">🎉 进入第 ${game.level} 关！</div>`;
        
        setTimeout(() => {
            if (relayProgress) relayProgress.textContent = '0';
            generateRelayQuestion();
        }, 1500);
    } else {
        setTimeout(() => generateRelayQuestion(), 1000);
    }
}

// 游戏9: 口算PK
function loadMathPK() {
    const container = document.getElementById('gameContainer');
    window.pkGame = {
        playerScore: 0,
        aiScore: 0,
        round: 1,
        maxRounds: 10
    };
    
    container.innerHTML = `
        <div class="pk-game">
            <h3>口算PK - 与AI对战</h3>
            <div class="pk-scores">
                <div class="player-score">
                    <div>你</div>
                    <div id="playerScore">0</div>
                </div>
                <div class="vs">VS</div>
                <div class="ai-score">
                    <div>AI</div>
                    <div id="aiScore">0</div>
                </div>
            </div>
            <div class="pk-round">第 <span id="pkRound">1</span> / ${window.pkGame.maxRounds} 回合</div>
            <div class="pk-question" id="pkQuestion"></div>
            <div class="pk-input">
                <input type="number" id="pkAnswer" placeholder="快速输入答案">
                <button onclick="submitPKAnswer()">提交</button>
            </div>
            <div class="pk-timer">
                <div id="pkTimerFill" class="timer-fill"></div>
            </div>
            <div id="pkFeedback"></div>
        </div>
    `;
    
    startPKRound();
}

function startPKRound() {
    const game = window.pkGame;
    
    if (game.round > game.maxRounds) {
        endPKGame();
        return;
    }
    
    // 生成题目
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let answer;
    if (op === '+') {
        answer = a + b;
    } else {
        answer = Math.max(a, b) - Math.min(a, b);
    }
    
    window.pkAnswer = answer;
    window.pkStartTime = Date.now();
    
    document.getElementById('pkQuestion').textContent = 
        op === '-' ? `${Math.max(a, b)} - ${Math.min(a, b)} = ?` : `${a} + ${b} = ?`;
    document.getElementById('pkAnswer').value = '';
    document.getElementById('pkAnswer').focus();
    document.getElementById('pkRound').textContent = game.round;
    
    // AI随机答题时间(1-3秒)
    window.aiAnswerTime = Math.random() * 2000 + 1000;
    window.aiTimeout = setTimeout(() => {
        if (!window.pkAnswered) {
            // AI答对
            game.aiScore++;
            document.getElementById('aiScore').textContent = game.aiScore;
            document.getElementById('pkFeedback').innerHTML = '<div class="error">AI抢答成功！</div>';
            nextPKRound();
        }
    }, window.aiAnswerTime);
    
    // 启动计时条
    const fill = document.getElementById('pkTimerFill');
    fill.style.width = '100%';
    fill.style.transition = 'width 3s linear';
    setTimeout(() => fill.style.width = '0%', 50);
}

function submitPKAnswer() {
    const pkAnswerEl = document.getElementById('pkAnswer');
    const game = window.pkGame;
    const feedback = document.getElementById('pkFeedback');
    
    if (!pkAnswerEl || !game || !feedback) return;
    
    const userAnswer = parseInt(pkAnswerEl.value);
    const responseTime = Date.now() - window.pkStartTime;
    
    window.pkAnswered = true;
    clearTimeout(window.aiTimeout);
    
    if (userAnswer === window.pkAnswer) {
        if (responseTime < window.aiAnswerTime) {
            // 玩家赢
            game.playerScore++;
            feedback.innerHTML = `<div class="success">✅ 你赢了这回合！(${(responseTime/1000).toFixed(1)}秒)</div>`;
        } else {
            // AI赢
            game.aiScore++;
            feedback.innerHTML = '<div class="error">❌ AI更快！</div>';
        }
    } else {
        // 答错，AI得分
        game.aiScore++;
        feedback.innerHTML = '<div class="error">❌ 答案错误！</div>';
    }
    
    document.getElementById('playerScore').textContent = game.playerScore;
    document.getElementById('aiScore').textContent = game.aiScore;
    
    nextPKRound();
}

function nextPKRound() {
    window.pkGame.round++;
    window.pkAnswered = false;
    setTimeout(() => startPKRound(), 1500);
}

function endPKGame() {
    const game = window.pkGame;
    const result = game.playerScore > game.aiScore ? '胜利' : 
                  game.playerScore < game.aiScore ? '失败' : '平局';
    
    const score = Math.max(0, game.playerScore * 50 - game.aiScore * 20);
    gamesManager.gameScore += score;
    document.getElementById('gameScore').textContent = gamesManager.gameScore;
    
    showAlert(`比赛结束！\n你: ${game.playerScore} - AI: ${game.aiScore}\n结果: ${result}\n获得 ${score} 分`, '口算PK');
}

// 游戏10: 数字雨
function loadNumberRain() {
    const container = document.getElementById('gameContainer');
    window.rainGame = {
        score: 0,
        lives: 3,
        targetNumber: Math.floor(Math.random() * 9) + 1,
        speed: 3000,
        interval: null
    };
    
    container.innerHTML = `
        <div class="number-rain-game">
            <div class="rain-info">
                <div>目标: <span id="targetNumber">${window.rainGame.targetNumber}</span></div>
                <div>得分: <span id="rainScore">0</span></div>
                <div>生命: <span id="lives">❤️❤️❤️</span></div>
            </div>
            <div id="rainArea" class="rain-area"></div>
            <div class="rain-controls">
                <button onclick="startNumberRain()">开始游戏</button>
                <button onclick="changeRainTarget()">更换目标</button>
            </div>
        </div>
    `;
}

function startNumberRain() {
    const rainArea = document.getElementById('rainArea');
    const game = window.rainGame;
    
    // 清除之前的游戏
    clearInterval(game.interval);
    rainArea.innerHTML = '';
    
    // 创建下落的数字
    const createRaindrop = () => {
        if (game.lives <= 0) return;
        
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        const number = Math.floor(Math.random() * 9) + 1;
        drop.textContent = number;
        drop.dataset.number = number;
        drop.style.left = Math.random() * (rainArea.offsetWidth - 40) + 'px';
        drop.style.animationDuration = (game.speed / 1000) + 's';
        
        drop.onclick = () => {
            if (parseInt(drop.dataset.number) === game.targetNumber) {
                game.score += 10;
                document.getElementById('rainScore').textContent = game.score;
                gamesManager.gameScore = game.score;
                document.getElementById('gameScore').textContent = game.score;
                drop.remove();
                
                // 加速
                if (game.score % 50 === 0) {
                    game.speed = Math.max(1500, game.speed - 200);
                    changeRainTarget();
                }
            } else {
                game.lives--;
                updateRainLives();
                drop.remove();
                if (game.lives <= 0) {
                    endRainGame();
                }
            }
        };
        
        rainArea.appendChild(drop);
        
        // 自动移除
        setTimeout(() => {
            if (drop.parentNode) {
                drop.remove();
                if (parseInt(drop.dataset.number) === game.targetNumber) {
                    // 错过目标数字
                    game.lives--;
                    updateRainLives();
                    if (game.lives <= 0) {
                        endRainGame();
                    }
                }
            }
        }, game.speed);
    };
    
    // 定期创建数字
    game.interval = setInterval(createRaindrop, 800);
}

function changeRainTarget() {
    const game = window.rainGame;
    game.targetNumber = Math.floor(Math.random() * 9) + 1;
    document.getElementById('targetNumber').textContent = game.targetNumber;
}

function updateRainLives() {
    const game = window.rainGame;
    const hearts = '❤️'.repeat(Math.max(0, game.lives));
    document.getElementById('lives').textContent = hearts || '💔';
}

function endRainGame() {
    const game = window.rainGame;
    clearInterval(game.interval);
    showAlert(`游戏结束！\n最终得分: ${game.score}`, '数字雨');
}

// 注册游戏到gameImplementations
if (typeof gameImplementations !== 'undefined') {
    gameImplementations[6] = loadMentalMath;
    gameImplementations[7] = load24Points;
    gameImplementations[8] = loadSpeedRelay;
    gameImplementations[9] = loadMathPK;
    gameImplementations[10] = loadNumberRain;
}
