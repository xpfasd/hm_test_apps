// 主应用程序
class MathApp {
    constructor() {
        this.currentOperation = null;
        this.currentCategory = null;
        this.questionGenerator = new QuestionGenerator();
        this.animationManager = new AnimationManager();
        this.currentQuestion = null;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.startTime = null;
        this.progress = this.loadProgress();
    }
    
    // 初始化应用
    init() {
        this.animationManager.init('animationArea');
        this.progress = this.loadProgress();
        this.updateProgressDisplay();
        this.bindEvents();
        
        // 显示欢迎动画
        this.showWelcomeAnimation();
    }
    
    // 加载进度
    loadProgress() {
        let progress = {
            addition: 0,
            subtraction: 0,
            multiplication: 0,
            division: 0
        };
        try {
            const saved = localStorage.getItem('mathProgress');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    progress = { ...progress, ...parsed };
                }
            }
        } catch (e) {}
        try {
            const statsSaved = localStorage.getItem('statistics');
            if (statsSaved) {
                const stats = JSON.parse(statsSaved);
                const ops = ['addition', 'subtraction', 'multiplication', 'division'];
                ops.forEach(op => {
                    const derived = stats?.operationStats?.[op]?.correct || 0;
                    if (derived > 0 && (!progress[op] || progress[op] < derived)) {
                        progress[op] = Math.min(derived, 100);
                    }
                });
            }
        } catch (e) {}
        localStorage.setItem('mathProgress', JSON.stringify(progress));
        return progress;
    }
    
    // 保存进度
    saveProgress() {
        localStorage.setItem('mathProgress', JSON.stringify(this.progress));
    }
    
    // 更新进度显示
    updateProgressDisplay() {
        Object.keys(this.progress).forEach(operation => {
            const progressBar = document.querySelector(`.${operation}-progress`);
            const progressText = progressBar?.parentElement?.nextElementSibling;
            
            if (progressBar) {
                const value = Math.max(0, Math.min(Number(this.progress[operation] || 0), 100));
                progressBar.style.width = `${value}%`;
            }
            
            if (progressText) {
                const value = Math.max(0, Math.min(Number(this.progress[operation] || 0), 100));
                progressText.textContent = `${value}/100`;
            }
        });
    }
    
    // 绑定事件
    bindEvents() {
        // 回车键提交答案
        document.getElementById('answerInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        // 输入框自动聚焦
        document.getElementById('answerInput')?.addEventListener('blur', function() {
            setTimeout(() => {
                this.focus();
            }, 100);
        });
    }
    
    // 显示欢迎动画
    showWelcomeAnimation() {
        const header = document.querySelector('.header h1');
        if (header) {
            header.classList.add('bounce');
        }
    }
    
    // 开始练习
    startPractice(operation) {
        this.currentOperation = operation;
        this.showPage('categoryPage');
        this.loadCategories(operation);
    }
    
    // 加载类别
    loadCategories(operation) {
        const categoryGrid = document.getElementById('categoryGrid');
        const categoryTitle = document.getElementById('categoryTitle');
        const operationConfig = config[operation];
        
        categoryTitle.textContent = `${operationConfig.name} - 选择练习类型`;
        categoryGrid.innerHTML = '';
        
        operationConfig.categories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.onclick = () => this.selectCategory(category);
            
            item.innerHTML = `
                <div class="emoji">${category.emoji}</div>
                <div class="name">${category.name}</div>
                <div class="range">${category.description}</div>
            `;
            
            categoryGrid.appendChild(item);
        });
    }
    
    // 选择类别
    selectCategory(category) {
        this.currentCategory = category;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.startTime = Date.now();
        
        // 生成题目
        this.questionGenerator.generateQuestions(this.currentOperation, category, 100);
        
        // 显示练习页面
        this.showPage('practicePage');
        this.nextQuestion();
    }
    
    // 下一题
    nextQuestion() {
        this.currentQuestion = this.questionGenerator.getNextQuestion();
        
        if (this.currentQuestion) {
            // 更新题号
            document.getElementById('currentQuestion').textContent = 
                this.questionGenerator.getCurrentIndex();
            
            // 显示题目
            this.displayQuestion();
            
            // 清空输入和反馈
            document.getElementById('answerInput').value = '';
            document.getElementById('feedback').classList.add('hidden');
            
            // 聚焦输入框
            setTimeout(() => {
                document.getElementById('answerInput').focus();
            }, 100);
        } else {
            // 练习完成
            this.showResult();
        }
    }
    
    // 显示题目
    displayQuestion() {
        const display = document.getElementById('questionDisplay');
        
        if (this.currentQuestion.type.includes('word')) {
            // 应用题显示
            display.innerHTML = `
                <div style="text-align: left; font-size: 1.5rem; line-height: 1.8;">
                    ${this.currentQuestion.icon} ${this.currentQuestion.text}
                </div>
            `;
        } else {
            // 普通题目显示
            display.textContent = this.currentQuestion.text;
        }
        
        // 清除动画区域
        this.animationManager.clear();
    }
    
    // 检查答案
    checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        const correctAnswer = this.currentQuestion.answer;
        
        if (isNaN(userAnswer)) {
            showAlert('请输入一个数字！', '输入错误');
            return;
        }
        
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            this.correctCount++;
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            
            // 播放正确动画
            this.animationManager.playCorrectAnimation();
            
            // 播放运算过程动画
            this.playOperationAnimation();
            
            // 更新进度
            this.progress[this.currentOperation] = Math.min((this.progress[this.currentOperation] || 0) + 1, 100);
            this.saveProgress();
            this.updateProgressDisplay();
            
            // 更新功能系统
            if (featureManager) {
                // 添加经验值
                featureManager.addExp(10);
                
                // 更新统计
                featureManager.updateStatistics(this.currentOperation, true);
                
                // 更新任务进度
                if (this.currentOperation === 'addition') {
                    featureManager.updateTaskProgress('addition', 1);
                } else if (this.currentOperation === 'subtraction') {
                    featureManager.updateTaskProgress('subtraction', 1);
                }
                
                featureManager.updateTaskProgress('score', 10);
                
                // 检查成就
                if (featureManager.userData.totalQuestions === 1) {
                    featureManager.unlockAchievement('first_answer');
                }
                if (featureManager.userData.correctQuestions === 100) {
                    featureManager.unlockAchievement('century');
                }
                if (featureManager.userData.correctQuestions === 1000) {
                    featureManager.unlockAchievement('thousand');
                }
            }
            
            // 下一题
            setTimeout(() => {
                this.nextQuestion();
            }, 3000);
        } else {
            this.wrongCount++;
            
            // 播放错误动画
            this.animationManager.playWrongAnimation(correctAnswer);
            
            // 更新功能系统
            if (featureManager) {
                // 更新统计（错误）
                featureManager.updateStatistics(this.currentOperation, false);
                
                // 添加到错题本
                const wrongQuestion = {
                    ...this.currentQuestion,
                    userAnswer: userAnswer
                };
                featureManager.addWrongQuestion(wrongQuestion);
            }
            
            // 显示正确的运算过程
            setTimeout(() => {
                this.playOperationAnimation();
            }, 1000);
            
            // 下一题
            setTimeout(() => {
                this.nextQuestion();
            }, 4000);
        }
    }
    
    // 播放运算过程动画
    playOperationAnimation() {
        const q = this.currentQuestion;
        
        switch(this.currentOperation) {
            case 'addition':
                this.animationManager.playAdditionAnimation(q.a, q.b, q.answer);
                break;
            case 'subtraction':
                this.animationManager.playSubtractionAnimation(q.a, q.b, q.answer);
                break;
            case 'multiplication':
                this.animationManager.playMultiplicationAnimation(q.a, q.b, q.answer);
                break;
            case 'division':
                this.animationManager.playDivisionAnimation(q.a, q.b, q.answer);
                break;
        }
    }
    
    // 显示结果
    showResult() {
        const totalQuestions = this.questionGenerator.getTotalCount();
        const accuracy = Math.round((this.correctCount / totalQuestions) * 100);
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        
        document.getElementById('correctCount').textContent = this.correctCount;
        document.getElementById('wrongCount').textContent = this.wrongCount;
        document.getElementById('accuracy').textContent = accuracy + '%';
        
        // 显示成就
        const achievement = document.getElementById('achievement');
        if (accuracy === 100) {
            achievement.innerHTML = `
                <div>${config.achievements.allCorrect.icon}</div>
                <div>${config.achievements.allCorrect.message}</div>
            `;
            achievement.classList.add('show');
        } else if (accuracy >= 90) {
            achievement.innerHTML = `
                <div>${config.achievements.master.icon}</div>
                <div>${config.achievements.master.message}</div>
            `;
            achievement.classList.add('show');
        } else if (accuracy >= 70) {
            achievement.innerHTML = `
                <div>${config.achievements.improving.icon}</div>
                <div>${config.achievements.improving.message}</div>
            `;
            achievement.classList.add('show');
        } else {
            achievement.innerHTML = `
                <div>${config.achievements.persistent.icon}</div>
                <div>${config.achievements.persistent.message}</div>
            `;
            achievement.classList.add('show');
        }
        
        this.showPage('resultPage');
    }
    
    // 重新开始练习
    restartPractice() {
        this.selectCategory(this.currentCategory);
    }
    
    // 返回首页
    goHome() {
        this.showPage('homePage');
        this.updateProgressDisplay();
        
        // 重置挑战页面内容，避免下次进入时显示旧内容
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
    }
    
    // 返回上一页
    goBack() {
        this.showPage('homePage');
    }
    
    // 返回类别选择
    goToCategories() {
        this.showPage('categoryPage');
    }
    
    // 显示页面
    showPage(pageId) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = ''; // 重置display属性
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = ''; // 确保目标页面可见
        }
        
        // 特别处理挑战页面
        const challengePage = document.getElementById('challengePage');
        if (challengePage && pageId !== 'challengePage') {
            challengePage.style.display = 'none';
        }
        
        // 更新功能徽章
        if (typeof updateFeatureBadges === 'function') {
            updateFeatureBadges();
        }
    }
}

// 全局变量和函数
let app;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new MathApp();
    app.init();
});

// 全局函数（供HTML调用）
function startPractice(operation) {
    app.startPractice(operation);
}

function checkAnswer() {
    app.checkAnswer();
}

function goBack() {
    app.goBack();
}

function goToCategories() {
    app.goToCategories();
}

function restartPractice() {
    app.restartPractice();
}

function goHome() {
    app.goHome();
}

// PWA支持
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
