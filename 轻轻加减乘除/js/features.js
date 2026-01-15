// 新功能管理系统
class FeatureManager {
    constructor() {
        this.userData = this.loadUserData();
        this.achievements = this.initAchievements();
        this.dailyTasks = this.initDailyTasks();
        this.wrongBook = this.loadWrongBook();
        this.statistics = this.loadStatistics();
        this.rankings = this.loadRankings();
    }
    
    // 初始化用户数据
    loadUserData() {
        const saved = localStorage.getItem('userData');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            name: '小朋友',
            avatar: '👦',
            level: 1,
            exp: 0,
            nextLevelExp: 100,
            totalQuestions: 0,
            correctQuestions: 0,
            studyDays: 1,
            lastStudyDate: new Date().toDateString(),
            studyStreak: 1,
            achievements: [],
            challengeRecords: {
                time60: 0,
                time180: 0,
                survival: 0
            }
        };
    }
    
    // 保存用户数据
    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.updateUserDisplay();
    }
    
    // 更新用户显示
    updateUserDisplay() {
        // 更新顶部导航栏
        const nameEl = document.getElementById('userName');
        if (nameEl) nameEl.textContent = this.userData.name;
        const avatarEl = document.getElementById('userAvatarEmoji');
        if (avatarEl) avatarEl.textContent = this.userData.avatar;
        const curExpEl = document.getElementById('currentExp');
        if (curExpEl) curExpEl.textContent = this.userData.exp;
        const nextExpEl = document.getElementById('nextExp');
        if (nextExpEl) nextExpEl.textContent = this.userData.nextLevelExp;
        
        const expPercent = (this.userData.exp / this.userData.nextLevelExp) * 100;
        const expBar = document.getElementById('expBar');
        if (expBar) expBar.style.width = expPercent + '%';
        
        // 更新等级称号
        const levelTitle = this.getLevelTitle(this.userData.level);
        const levelContainers = document.querySelectorAll('.user-level');
        levelContainers.forEach(el => {
            el.innerHTML = `Lv.<span id="userLevel">${this.userData.level}</span> ${levelTitle}`;
        });
    }
    
    // 获取等级称号
    getLevelTitle(level) {
        const titles = [
            '数学新手', '数字探索者', '计算小达人', '数学小能手', '算术专家',
            '数学小博士', '计算大师', '数学天才', '算术王者', '数学传奇'
        ];
        return titles[Math.min(Math.floor((level - 1) / 10), titles.length - 1)];
    }
    
    // 添加经验值
    addExp(amount) {
        this.userData.exp += amount;
        
        // 检查升级
        while (this.userData.exp >= this.userData.nextLevelExp) {
            this.userData.exp -= this.userData.nextLevelExp;
            this.userData.level++;
            this.userData.nextLevelExp = this.userData.level * 100;
            
            // 显示升级提示
            showSuccess(`恭喜升级到 Lv.${this.userData.level}！`, '等级提升');
            
            // 检查升级成就
            this.checkLevelAchievements();
        }
        
        this.saveUserData();
    }
    
    // 初始化成就系统
    initAchievements() {
        return [
            { id: 'first_answer', name: '初次答题', icon: '🌟', desc: '完成第一道题', unlocked: false },
            { id: 'first_perfect', name: '完美开始', icon: '💯', desc: '首次全部答对', unlocked: false },
            { id: 'speed_demon', name: '神速答题', icon: '⚡', desc: '30秒内答对10题', unlocked: false },
            { id: 'persistent', name: '坚持不懈', icon: '💪', desc: '连续学习7天', unlocked: false },
            { id: 'century', name: '百题斩', icon: '🗡️', desc: '累计答对100题', unlocked: false },
            { id: 'thousand', name: '千题王', icon: '👑', desc: '累计答对1000题', unlocked: false },
            { id: 'addition_master', name: '加法大师', icon: '➕', desc: '加法正确率达90%', unlocked: false },
            { id: 'subtraction_master', name: '减法大师', icon: '➖', desc: '减法正确率达90%', unlocked: false },
            { id: 'multiplication_master', name: '乘法大师', icon: '✖️', desc: '乘法正确率达90%', unlocked: false },
            { id: 'division_master', name: '除法大师', icon: '➗', desc: '除法正确率达90%', unlocked: false },
            { id: 'level_5', name: '小有成就', icon: '🎯', desc: '达到5级', unlocked: false },
            { id: 'level_10', name: '渐入佳境', icon: '🚀', desc: '达到10级', unlocked: false },
            { id: 'level_20', name: '数学达人', icon: '🏆', desc: '达到20级', unlocked: false },
            { id: 'challenger', name: '挑战者', icon: '⚔️', desc: '完成一次挑战模式', unlocked: false },
            { id: 'survivor', name: '生存专家', icon: '🛡️', desc: '生存模式答对20题', unlocked: false },
            { id: 'wrong_master', name: '错题克星', icon: '📝', desc: '复习50道错题', unlocked: false },
            { id: 'daily_hero', name: '每日英雄', icon: '☀️', desc: '完成所有每日任务', unlocked: false },
            { id: 'night_owl', name: '夜猫子', icon: '🦉', desc: '晚上10点后学习', unlocked: false },
            { id: 'early_bird', name: '早起鸟', icon: '🐦', desc: '早上7点前学习', unlocked: false },
            { id: 'perfectionist', name: '完美主义', icon: '✨', desc: '连续10次满分', unlocked: false }
        ];
    }
    
    // 解锁成就
    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.userData.achievements.push(achievementId);
            this.saveUserData();
            
            // 显示成就解锁提示
            showSuccess(`🎉 解锁成就：${achievement.name}`, '成就解锁');
            
            // 添加经验奖励
            this.addExp(50);
        }
    }
    
    // 检查等级相关成就
    checkLevelAchievements() {
        if (this.userData.level >= 5) this.unlockAchievement('level_5');
        if (this.userData.level >= 10) this.unlockAchievement('level_10');
        if (this.userData.level >= 20) this.unlockAchievement('level_20');
    }
    
    // 初始化每日任务
    initDailyTasks() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('dailyTasks');
        
        if (saved) {
            const tasks = JSON.parse(saved);
            if (tasks.date === today) {
                return tasks.tasks;
            }
        }
        
        // 生成新的每日任务
        const newTasks = [
            { id: 1, name: '完成10道加法题', type: 'addition', target: 10, current: 0, reward: 20, completed: false },
            { id: 2, name: '完成10道减法题', type: 'subtraction', target: 10, current: 0, reward: 20, completed: false },
            { id: 3, name: '连续答对5题', type: 'streak', target: 5, current: 0, reward: 30, completed: false },
            { id: 4, name: '获得50分', type: 'score', target: 50, current: 0, reward: 20, completed: false },
            { id: 5, name: '完成一次挑战', type: 'challenge', target: 1, current: 0, reward: 30, completed: false }
        ];
        
        localStorage.setItem('dailyTasks', JSON.stringify({
            date: today,
            tasks: newTasks
        }));
        
        return newTasks;
    }
    
    // 更新任务进度
    updateTaskProgress(type, value = 1) {
        const task = this.dailyTasks.find(t => t.type === type && !t.completed);
        if (task) {
            task.current = Math.min(task.current + value, task.target);
            if (task.current >= task.target) {
                task.completed = true;
                this.addExp(task.reward);
                showSuccess(`任务完成：${task.name} (+${task.reward} EXP)`, '任务完成');
            }
            this.saveDailyTasks();
        }
    }
    
    // 保存每日任务
    saveDailyTasks() {
        localStorage.setItem('dailyTasks', JSON.stringify({
            date: new Date().toDateString(),
            tasks: this.dailyTasks
        }));
    }
    
    // 加载错题本
    loadWrongBook() {
        const saved = localStorage.getItem('wrongBook');
        return saved ? JSON.parse(saved) : [];
    }
    
    // 添加错题
    addWrongQuestion(question) {
        const wrongItem = {
            ...question,
            id: Date.now(),
            date: new Date().toISOString(),
            reviewCount: 0,
            mastered: false
        };
        this.wrongBook.push(wrongItem);
        localStorage.setItem('wrongBook', JSON.stringify(this.wrongBook));
    }
    
    // 加载统计数据
    loadStatistics() {
        const saved = localStorage.getItem('statistics');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            daily: {},
            weekly: {},
            operationStats: {
                addition: { total: 0, correct: 0 },
                subtraction: { total: 0, correct: 0 },
                multiplication: { total: 0, correct: 0 },
                division: { total: 0, correct: 0 }
            }
        };
    }
    
    // 更新统计数据
    updateStatistics(operation, isCorrect) {
        const today = new Date().toDateString();
        
        // 更新每日统计
        if (!this.statistics.daily[today]) {
            this.statistics.daily[today] = { total: 0, correct: 0 };
        }
        this.statistics.daily[today].total++;
        if (isCorrect) this.statistics.daily[today].correct++;
        
        // 更新运算统计
        this.statistics.operationStats[operation].total++;
        if (isCorrect) this.statistics.operationStats[operation].correct++;
        
        // 更新用户总统计
        this.userData.totalQuestions++;
        if (isCorrect) this.userData.correctQuestions++;
        
        localStorage.setItem('statistics', JSON.stringify(this.statistics));
        this.saveUserData();
    }
    
    // 加载排行榜
    loadRankings() {
        const saved = localStorage.getItem('rankings');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 生成虚拟排行榜数据
        return {
            daily: this.generateVirtualRankings('daily'),
            weekly: this.generateVirtualRankings('weekly'),
            total: this.generateVirtualRankings('total')
        };
    }
    
    // 生成虚拟排行榜
    generateVirtualRankings(type) {
        const names = ['小明', '小红', '小华', '小强', '小美', '小刚', '小丽', '小军', '小芳', '小伟'];
        const avatars = ['👦', '👧', '🧒', '👶', '👨', '👩', '🧑', '👱', '👸', '🤴'];
        
        const rankings = [];
        for (let i = 0; i < 10; i++) {
            rankings.push({
                rank: i + 1,
                name: names[i],
                avatar: avatars[i],
                level: Math.floor(Math.random() * 10) + 1,
                score: Math.floor(Math.random() * 1000) + 100
            });
        }
        
        // 添加当前用户
        rankings.push({
            rank: 11,
            name: this.userData.name,
            avatar: this.userData.avatar,
            level: this.userData.level,
            score: this.userData.correctQuestions * 10,
            isCurrentUser: true
        });
        
        rankings.sort((a, b) => b.score - a.score);
        rankings.forEach((item, index) => {
            item.rank = index + 1;
        });
        
        return rankings.slice(0, 10);
    }
}

// 创建全局功能管理器实例
let featureManager;

// 初始化功能管理器
document.addEventListener('DOMContentLoaded', () => {
    featureManager = new FeatureManager();
    featureManager.updateUserDisplay();
    updateFeatureBadges();
});

// 更新功能徽章
function updateFeatureBadges() {
    // 更新错题数
    const wrongCount = featureManager.wrongBook.filter(q => !q.mastered).length;
    const wrongBadge = document.getElementById('wrongCount');
    if (wrongBadge) {
        wrongBadge.textContent = wrongCount;
        wrongBadge.style.display = wrongCount > 0 ? 'block' : 'none';
    }
    
    // 更新成就数
    const unlockedAchievements = featureManager.achievements.filter(a => a.unlocked).length;
    const achievementBadge = document.getElementById('achievementCount');
    if (achievementBadge) {
        achievementBadge.textContent = `${unlockedAchievements}/20`;
    }
    
    // 更新任务数
    const incompleteTasks = featureManager.dailyTasks.filter(t => !t.completed).length;
    const taskBadge = document.getElementById('taskBadge');
    if (taskBadge) {
        taskBadge.style.display = incompleteTasks > 0 ? 'flex' : 'none';
        taskBadge.textContent = incompleteTasks;
    }
    
    const newTaskBadge = document.getElementById('newTaskCount');
    if (newTaskBadge) {
        newTaskBadge.textContent = incompleteTasks;
        newTaskBadge.style.display = incompleteTasks > 0 ? 'block' : 'none';
    }
}

// 页面功能函数
function showUserProfile() {
    app.showPage('userProfilePage');
    
    // 更新档案页面数据
    document.getElementById('currentAvatar').textContent = featureManager.userData.avatar;
    document.getElementById('userNameInput').value = featureManager.userData.name;
    document.getElementById('profileLevel').textContent = featureManager.userData.level;
    document.getElementById('profileExp').textContent = featureManager.userData.exp;
    document.getElementById('profileNextExp').textContent = featureManager.userData.nextLevelExp;
    document.getElementById('profileTotalQuestions').textContent = featureManager.userData.totalQuestions;
    document.getElementById('profileStudyDays').textContent = featureManager.userData.studyDays;
    
    const correctRate = featureManager.userData.totalQuestions > 0 
        ? Math.round((featureManager.userData.correctQuestions / featureManager.userData.totalQuestions) * 100)
        : 0;
    document.getElementById('profileCorrectRate').textContent = correctRate + '%';
    
    const unlockedAchievements = featureManager.achievements.filter(a => a.unlocked).length;
    document.getElementById('profileAchievements').textContent = unlockedAchievements;
}

function saveProfile() {
    const newName = document.getElementById('userNameInput').value.trim();
    if (newName) {
        featureManager.userData.name = newName;
        featureManager.saveUserData();
        showSuccess('个人档案已保存', '保存成功');
    }
}

function showChallengeMode() {
    // 恢复挑战模式选择界面
    const challengePage = document.getElementById('challengePage');
    if (challengePage) {
        challengePage.innerHTML = `
            <div class="page-header">
                <button class="back-btn" onclick="goHome()">← 返回</button>
                <h2>⚡ 挑战模式</h2>
            </div>
            <div class="challenge-content">
                <div class="challenge-modes">
                    <div class="challenge-card" onclick="startTimeChallenge(60)">
                        <div class="challenge-icon">⏱️</div>
                        <h3>一分钟挑战</h3>
                        <p>60秒内答对尽可能多的题目</p>
                        <div class="best-record">最佳记录: <span id="best60">0</span> 题</div>
                    </div>
                    <div class="challenge-card" onclick="startTimeChallenge(180)">
                        <div class="challenge-icon">⏰</div>
                        <h3>三分钟挑战</h3>
                        <p>180秒内答对尽可能多的题目</p>
                        <div class="best-record">最佳记录: <span id="best180">0</span> 题</div>
                    </div>
                    <div class="challenge-card" onclick="startSurvivalChallenge()">
                        <div class="challenge-icon">💪</div>
                        <h3>生存模式</h3>
                        <p>答错即结束，看你能坚持多久</p>
                        <div class="best-record">最佳记录: <span id="bestSurvival">0</span> 题</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    app.showPage('challengePage');
    
    // 更新最佳记录显示
    const best60 = localStorage.getItem('best60') || '0';
    const best180 = localStorage.getItem('best180') || '0';
    const bestSurvival = localStorage.getItem('bestSurvival') || '0';
    
    const best60El = document.getElementById('best60');
    const best180El = document.getElementById('best180');
    const bestSurvivalEl = document.getElementById('bestSurvival');
    
    if (best60El) best60El.textContent = best60;
    if (best180El) best180El.textContent = best180;
    if (bestSurvivalEl) bestSurvivalEl.textContent = bestSurvival;
}

function showWrongBook() {
    app.showPage('wrongBookPage');
    
    const wrongList = document.getElementById('wrongList');
    const totalWrong = featureManager.wrongBook.length;
    const reviewedWrong = featureManager.wrongBook.filter(q => q.reviewCount > 0).length;
    const masteredWrong = featureManager.wrongBook.filter(q => q.mastered).length;
    
    document.getElementById('totalWrong').textContent = totalWrong;
    document.getElementById('reviewedWrong').textContent = reviewedWrong;
    document.getElementById('masteredWrong').textContent = masteredWrong;
    
    // 显示错题列表
    wrongList.innerHTML = '';
    if (featureManager.wrongBook.length === 0) {
        wrongList.innerHTML = '<p style="text-align: center; color: #666;">暂无错题</p>';
    } else {
        featureManager.wrongBook.slice(-10).reverse().forEach(question => {
            const item = document.createElement('div');
            item.className = 'wrong-item';
            item.innerHTML = `
                <div class="wrong-question">
                    <div>${question.text}</div>
                    <div style="font-size: 0.9rem; color: #666;">
                        你的答案: <span class="wrong-answer">${question.userAnswer || '未答'}</span> | 
                        正确答案: <span class="correct-answer">${question.answer}</span>
                    </div>
                </div>
                <!-- 复习按钮已隐藏 -->
                <!-- <button class="review-btn" onclick="reviewWrongQuestion(${question.id})">复习</button> -->
            `;
            wrongList.appendChild(item);
        });
    }
}

function showStatistics() {
    app.showPage('statisticsPage');
    
    // 更新统计数据
    document.getElementById('totalQuestions').textContent = featureManager.userData.totalQuestions;
    const correctRate = featureManager.userData.totalQuestions > 0
        ? Math.round((featureManager.userData.correctQuestions / featureManager.userData.totalQuestions) * 100)
        : 0;
    document.getElementById('correctRate').textContent = correctRate + '%';
    document.getElementById('studyStreak').textContent = featureManager.userData.studyStreak;
    
    // 计算学习时长（示例）
    const studyTime = Math.floor(featureManager.userData.totalQuestions * 0.5);
    document.getElementById('studyTime').textContent = studyTime;
    
    // 更新运算统计
    const operations = ['addition', 'subtraction', 'multiplication', 'division'];
    operations.forEach(op => {
        const stats = featureManager.statistics.operationStats[op];
        const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const fillElement = document.querySelector(`.${op}-stat`);
        if (fillElement) {
            fillElement.style.width = rate + '%';
            fillElement.parentElement.nextElementSibling.textContent = rate + '%';
        }
    });
    
    // 生成本周图表
    generateWeeklyChart();
}

function showAchievements() {
    app.showPage('achievementsPage');
    
    const unlockedCount = featureManager.achievements.filter(a => a.unlocked).length;
    const totalCount = featureManager.achievements.length;
    const percent = Math.round((unlockedCount / totalCount) * 100);
    
    document.getElementById('unlockedCount').textContent = unlockedCount;
    document.getElementById('totalAchievements').textContent = totalCount;
    document.getElementById('achievementPercent').textContent = percent;
    
    // 更新进度圆圈
    const circle = document.getElementById('achievementCircle');
    if (circle) {
        const dashOffset = 314 - (314 * percent / 100);
        circle.style.strokeDashoffset = dashOffset;
    }
    
    // 显示成就网格
    const grid = document.getElementById('achievementGrid');
    grid.innerHTML = '';
    featureManager.achievements.forEach(achievement => {
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? '' : 'locked'}`;
        item.innerHTML = `
            <div class="achievement-icon">${achievement.unlocked ? achievement.icon : '🔒'}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        item.title = achievement.desc;
        grid.appendChild(item);
    });
}

function showRankings() {
    app.showPage('rankingsPage');
    switchRankingTab('daily');
}

function switchRankingTab(type) {
    // 更新标签状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 显示排行榜
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    
    const rankings = featureManager.rankings[type];
    rankings.forEach(item => {
        const rankItem = document.createElement('div');
        rankItem.className = 'ranking-item';
        if (item.isCurrentUser) rankItem.style.background = '#f0f4ff';
        
        let positionClass = '';
        if (item.rank === 1) positionClass = 'gold';
        else if (item.rank === 2) positionClass = 'silver';
        else if (item.rank === 3) positionClass = 'bronze';
        
        rankItem.innerHTML = `
            <div class="ranking-position ${positionClass}">${item.rank}</div>
            <div class="ranking-avatar">
                <span>${item.avatar}</span>
            </div>
            <div class="ranking-info">
                <div class="ranking-name">${item.name}${item.isCurrentUser ? ' (你)' : ''}</div>
                <div class="ranking-level">Lv.${item.level}</div>
            </div>
            <div class="ranking-score">${item.score}分</div>
        `;
        rankingList.appendChild(rankItem);
    });
}

function showDailyTasks() {
    app.showPage('dailyTasksPage');
    
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    let completedCount = 0;
    let totalExp = 0;
    
    featureManager.dailyTasks.forEach(task => {
        if (task.completed) {
            completedCount++;
            totalExp += task.reward;
        }
        
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div class="task-checkbox"></div>
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-progress">${task.current} / ${task.target}</div>
            </div>
            <div class="task-reward-badge">+${task.reward} EXP</div>
        `;
        taskList.appendChild(taskItem);
    });
    
    document.getElementById('completedTasks').textContent = completedCount;
    document.getElementById('totalTasks').textContent = featureManager.dailyTasks.length;
    document.getElementById('earnedExp').textContent = totalExp;
}

function showThemeSelector() {
    showAlert('主题切换功能即将推出！', '敬请期待');
}

function showSettings() {
    showAlert('设置功能即将推出！', '敬请期待');
}

// Toast提示功能
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        font-size: 1rem;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// 挑战模式管理器
const challengeManager = {
    mode: null, // 'time' 或 'survival'
    duration: 0, // 挑战时长（秒）
    startTime: null,
    endTime: null,
    timer: null,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    currentQuestion: null,
    questionHistory: [],
    isActive: false,
    
    // 获取最佳记录
    getBestRecord(mode) {
        const key = mode === 'survival' ? 'bestSurvival' : `best${mode}`;
        return parseInt(localStorage.getItem(key) || '0');
    },
    
    // 保存最佳记录
    saveBestRecord(mode, score) {
        const key = mode === 'survival' ? 'bestSurvival' : `best${mode}`;
        const current = this.getBestRecord(mode);
        if (score > current) {
            localStorage.setItem(key, score.toString());
            return true; // 新纪录
        }
        return false;
    },
    
    // 生成随机题目
    generateQuestion() {
        const operations = ['+', '-', '×', '÷'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        let a, b, answer, question;
        
        switch(op) {
            case '+':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                answer = a + b;
                question = `${a} + ${b}`;
                break;
            case '-':
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * a) + 1;
                answer = a - b;
                question = `${a} - ${b}`;
                break;
            case '×':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                question = `${a} × ${b}`;
                break;
            case '÷':
                b = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                a = b * answer;
                question = `${a} ÷ ${b}`;
                break;
        }
        
        return { question, answer, operation: op };
    },
    
    // 显示挑战界面
    showChallengeUI() {
        const modeText = this.mode === 'survival' ? '生存模式' : 
                        (this.duration === 60 ? '一分钟挑战' : '三分钟挑战');
        
        const html = `
            <div class="challenge-game-container">
                <div class="challenge-header">
                    <button class="back-btn" onclick="challengeManager.endChallenge()">← 退出</button>
                    <h2>${modeText}</h2>
                </div>
                
                <div class="challenge-stats">
                    <div class="stat-item">
                        <span class="stat-label">⏱️ 时间</span>
                        <span class="stat-value" id="challengeTimer">${this.mode === 'survival' ? '∞' : this.duration}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">✅ 答对</span>
                        <span class="stat-value" id="challengeCorrect">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">❌ 答错</span>
                        <span class="stat-value" id="challengeWrong">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">🏆 最佳</span>
                        <span class="stat-value" id="challengeBest">${this.getBestRecord(this.mode === 'survival' ? 'survival' : this.duration)}</span>
                    </div>
                </div>
                
                <div class="challenge-question-area">
                    <div class="question-display" id="challengeQuestion"></div>
                    <div class="answer-input-area">
                        <input type="number" id="challengeAnswer" class="challenge-input" placeholder="请输入答案" autofocus>
                        <button onclick="challengeManager.submitAnswer()" class="submit-btn">提交</button>
                    </div>
                    <div id="challengeFeedback" class="challenge-feedback"></div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="challengeProgress"></div>
                </div>
            </div>
        `;
        
        // 隐藏其他页面，显示挑战界面
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
            p.classList.remove('active');
        });
        document.getElementById('challengePage').style.display = 'block';
        document.getElementById('challengePage').innerHTML = html;
        
        // 绑定回车键提交
        document.getElementById('challengeAnswer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
    },
    
    // 开始挑战
    start(mode, duration = 0) {
        this.mode = mode;
        this.duration = duration;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.questionHistory = [];
        this.isActive = true;
        this.startTime = Date.now();
        
        this.showChallengeUI();
        this.nextQuestion();
        
        if (mode === 'time') {
            this.startTimer();
        }
    },
    
    // 开始计时器
    startTimer() {
        let timeLeft = this.duration;
        
        this.timer = setInterval(() => {
            timeLeft--;
            document.getElementById('challengeTimer').textContent = timeLeft;
            
            // 更新进度条
            const progress = ((this.duration - timeLeft) / this.duration) * 100;
            document.getElementById('challengeProgress').style.width = `${progress}%`;
            
            // 时间警告
            if (timeLeft <= 10) {
                document.getElementById('challengeTimer').classList.add('time-warning');
            }
            
            if (timeLeft <= 0) {
                this.endChallenge();
            }
        }, 1000);
    },
    
    // 显示下一题
    nextQuestion() {
        if (!this.isActive) return;
        
        this.currentQuestion = this.generateQuestion();
        document.getElementById('challengeQuestion').innerHTML = `
            <div class="question-text">${this.currentQuestion.question} = ?</div>
        `;
        
        // 清空输入框并聚焦
        const input = document.getElementById('challengeAnswer');
        input.value = '';
        input.focus();
        
        // 清空反馈
        document.getElementById('challengeFeedback').innerHTML = '';
    },
    
    // 提交答案
    submitAnswer() {
        if (!this.isActive || !this.currentQuestion) return;
        
        const userAnswer = parseInt(document.getElementById('challengeAnswer').value);
        const feedback = document.getElementById('challengeFeedback');
        
        if (isNaN(userAnswer)) {
            feedback.innerHTML = '<span class="error">请输入有效的数字！</span>';
            return;
        }
        
        const isCorrect = userAnswer === this.currentQuestion.answer;
        
        if (isCorrect) {
            this.correctCount++;
            feedback.innerHTML = '<span class="success">✅ 正确！</span>';
            document.getElementById('challengeCorrect').textContent = this.correctCount;
            
            // 记录题目
            this.questionHistory.push({
                ...this.currentQuestion,
                userAnswer,
                isCorrect: true
            });
            
            // 继续下一题
            setTimeout(() => this.nextQuestion(), 500);
            
        } else {
            this.wrongCount++;
            feedback.innerHTML = `<span class="error">❌ 错误！正确答案是 ${this.currentQuestion.answer}</span>`;
            document.getElementById('challengeWrong').textContent = this.wrongCount;
            
            // 记录错题
            this.questionHistory.push({
                ...this.currentQuestion,
                userAnswer,
                isCorrect: false
            });
            
            // 生存模式下，答错即结束
            if (this.mode === 'survival') {
                setTimeout(() => this.endChallenge(), 1000);
            } else {
                // 继续下一题
                setTimeout(() => this.nextQuestion(), 1000);
            }
        }
    },
    
    // 结束挑战
    endChallenge() {
        this.isActive = false;
        this.endTime = Date.now();
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 计算最终得分
        const finalScore = this.correctCount;
        const modeKey = this.mode === 'survival' ? 'survival' : this.duration;
        const isNewRecord = this.saveBestRecord(modeKey, finalScore);
        
        // 显示结果
        this.showResult(isNewRecord);
        
        // 更新成就
        this.updateAchievements();
    },
    
    // 显示结果
    showResult(isNewRecord) {
        const duration = Math.floor((this.endTime - this.startTime) / 1000);
        const accuracy = this.correctCount > 0 ? 
            Math.round((this.correctCount / (this.correctCount + this.wrongCount)) * 100) : 0;
        
        const modeText = this.mode === 'survival' ? '生存模式' : 
                        (this.duration === 60 ? '一分钟挑战' : '三分钟挑战');
        
        const html = `
            <div class="challenge-result">
                <h2>🎯 ${modeText}结束</h2>
                ${isNewRecord ? '<div class="new-record">🎉 新纪录！</div>' : ''}
                
                <div class="result-stats">
                    <div class="result-item">
                        <span class="result-label">答对题数</span>
                        <span class="result-value">${this.correctCount}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">答错题数</span>
                        <span class="result-value">${this.wrongCount}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">正确率</span>
                        <span class="result-value">${accuracy}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">用时</span>
                        <span class="result-value">${duration}秒</span>
                    </div>
                </div>
                
                <div class="result-actions">
                    <button onclick="challengeManager.restart()" class="btn-primary">再来一次</button>
                    <button onclick="challengeManager.viewHistory()" class="btn-secondary">查看答题记录</button>
                    <button onclick="goHome()" class="btn-secondary">返回首页</button>
                </div>
            </div>
        `;
        
        document.getElementById('challengePage').innerHTML = html;
    },
    
    // 重新开始
    restart() {
        this.start(this.mode, this.duration);
    },
    
    // 查看答题记录
    viewHistory() {
        let historyHtml = '<div class="history-container"><h3>答题记录</h3><div class="history-list">';
        
        this.questionHistory.forEach((item, index) => {
            const icon = item.isCorrect ? '✅' : '❌';
            const className = item.isCorrect ? 'correct' : 'wrong';
            historyHtml += `
                <div class="history-item ${className}">
                    <span class="history-index">${index + 1}.</span>
                    <span class="history-question">${item.question} = ${item.answer}</span>
                    <span class="history-answer">你的答案: ${item.userAnswer}</span>
                    <span class="history-icon">${icon}</span>
                </div>
            `;
        });
        
        historyHtml += `
            </div>
            <button onclick="challengeManager.showResult(false)" class="btn-primary">返回结果</button>
            </div>
        `;
        
        document.getElementById('challengePage').innerHTML = historyHtml;
    },
    
    // 更新成就
    updateAchievements() {
        // 检查挑战者成就
        if (this.correctCount > 0) {
            const challengerAchievement = featureManager.achievements.find(a => a.id === 'challenger');
            if (challengerAchievement && !challengerAchievement.unlocked) {
                challengerAchievement.unlocked = true;
                showToast('🏆 获得成就：挑战者！');
                featureManager.saveData();
            }
        }
        
        // 检查生存专家成就
        if (this.mode === 'survival' && this.correctCount >= 20) {
            const survivorAchievement = featureManager.achievements.find(a => a.id === 'survivor');
            if (survivorAchievement && !survivorAchievement.unlocked) {
                survivorAchievement.unlocked = true;
                showToast('🏆 获得成就：生存专家！');
                featureManager.saveData();
            }
        }
    }
};

function startTimeChallenge(seconds) {
    challengeManager.start('time', seconds);
}

function startSurvivalChallenge() {
    challengeManager.start('survival');
}

function startWrongReview() {
    if (featureManager.wrongBook.length === 0) {
        showAlert('暂无错题可复习', '提示');
    } else {
        showAlert('错题复习功能即将推出！', '敬请期待');
        // TODO: 实现错题复习逻辑
    }
}

// 初始化挑战模式最佳记录显示
function initChallengeBestRecords() {
    // 更新一分钟挑战最佳记录
    const best60 = localStorage.getItem('best60') || '0';
    const best60El = document.getElementById('best60');
    if (best60El) best60El.textContent = best60;
    
    // 更新三分钟挑战最佳记录
    const best180 = localStorage.getItem('best180') || '0';
    const best180El = document.getElementById('best180');
    if (best180El) best180El.textContent = best180;
    
    // 更新生存模式最佳记录
    const bestSurvival = localStorage.getItem('bestSurvival') || '0';
    const bestSurvivalEl = document.getElementById('bestSurvival');
    if (bestSurvivalEl) bestSurvivalEl.textContent = bestSurvival;
}

// 页面加载完成时初始化
document.addEventListener('DOMContentLoaded', function() {
    initChallengeBestRecords();
});

function reviewWrongQuestion(questionId) {
    showAlert('单题复习功能即将推出！', '敬请期待');
    // TODO: 实现单题复习逻辑
}

function showAvatarSelector() {
    const avatars = ['👦', '👧', '🧒', '👶', '👨', '👩', '🧑', '👱', '👸', '🤴', '🦸', '🦹', '🧙', '🧚', '🎅', '🤶'];
    
    // 创建头像选择器
    const selector = document.createElement('div');
    selector.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 20px;';
    
    avatars.forEach(avatar => {
        const btn = document.createElement('button');
        btn.style.cssText = 'width: 50px; height: 50px; font-size: 30px; border: 2px solid #e0e0e0; border-radius: 50%; cursor: pointer;';
        btn.textContent = avatar;
        btn.onclick = () => {
            featureManager.userData.avatar = avatar;
            featureManager.saveUserData();
            document.getElementById('currentAvatar').textContent = avatar;
            closeModal('avatarModal');
        };
        selector.appendChild(btn);
    });
    
    // 显示在弹窗中
    document.getElementById('alertMessage').innerHTML = '';
    document.getElementById('alertMessage').appendChild(selector);
    document.getElementById('alertTitle').textContent = '选择头像';
    modalManager.showModal('alertModal');
}

function generateWeeklyChart() {
    const chart = document.getElementById('weeklyChart');
    if (!chart) return;
    
    chart.innerHTML = '';
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const today = new Date().getDay();
    
    days.forEach((day, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const height = Math.random() * 180 + 20; // 随机高度
        bar.style.height = height + 'px';
        bar.innerHTML = `<div class="chart-label">${day}</div>`;
        chart.appendChild(bar);
    });
}
