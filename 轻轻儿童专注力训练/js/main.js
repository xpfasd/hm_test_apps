// 全局进度管理
function getProgress() {
    const saved = localStorage.getItem('focusGameProgress');
    if (saved) {
        return JSON.parse(saved);
    }
    // 初始化进度
    const initialProgress = {
        game1: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game2: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game3: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game4: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game5: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game6: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game7: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game8: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game9: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game10: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game11: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game12: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game13: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game14: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game15: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game16: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game17: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game18: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game19: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
        game20: Array(5).fill(null).map(() => ({ completed: false, stars: 0 })),
    };
    return initialProgress;
}

function saveProgress(progress) {
    localStorage.setItem('focusGameProgress', JSON.stringify(progress));
}

function updateLevelProgress(game, level, stars) {
    const progress = getProgress();
    if (!progress[game]) {
        progress[game] = Array(5).fill(null).map(() => ({ completed: false, stars: 0 }));
    }
    progress[game][level - 1] = {
        completed: true,
        stars: Math.max(stars, progress[game][level - 1].stars)
    };
    saveProgress(progress);
}

function isLevelUnlocked(game, level) {
    if (level === 1) return true;
    const progress = getProgress();
    if (!progress[game]) return false;
    return progress[game][level - 2]?.completed || false;
}

// 弹窗管理
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 如果是结果弹窗，自动填充随机tips
        if (modalId === 'resultModal') {
            let tipsElement = modal.querySelector('#resultTips');
            
            // 如果不存在tips元素，自动创建并插入
            if (!tipsElement) {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    // 查找按钮容器div
                    const buttonDiv = modalContent.querySelector('div:has(button.btn)');
                    if (buttonDiv) {
                        // 在按钮div之前插入tips元素
                        tipsElement = document.createElement('p');
                        tipsElement.id = 'resultTips';
                        tipsElement.style.cssText = 'margin-top:15px;padding:10px;background:#fff3cd;border-radius:8px;font-size:14px;line-height:1.6;color:#856404;';
                        buttonDiv.parentNode.insertBefore(tipsElement, buttonDiv);
                    }
                }
            }
            
            // 填充随机tips内容
            if (tipsElement) {
                tipsElement.textContent = '💡 ' + getRandomTip();
            }
        }
        modal.classList.add('active');
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

// 音效播放（使用Web Audio API创建简单音效）
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
}

function playSound(type) {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'correct':
            oscillator.frequency.value = 1000;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'wrong':
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            oscillator.start(audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'win':
            // 胜利音效
            oscillator.frequency.value = 523;
            oscillator.start(audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1046, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
    }
}

// 添加触摸反馈
function addTouchFeedback() {
    document.addEventListener('touchstart', function(e) {
        const target = e.target;
        if (target.classList.contains('btn') || 
            target.classList.contains('level-card') || 
            target.classList.contains('animal-card')) {
            playSound('click');
        }
    });
}

// 专注力tips
const FOCUS_TIPS = [
    "短时专注后可以让眼睛休息一下哦~",
    "可以闭眼10秒钟再回来挑战哦！",
    "专注的时候，请远离干扰，效果更好！",
    "每完成一个小目标，可以适当奖励自己一下哦！",
    "深呼吸有助于恢复注意力哦！",
    "玩项目的同时，也要动一动~",
    "专注力像肌肉，多锻炼会越来越强！",
    "遇到难题，试着分解为几个小步骤~",
    "保持充足睡眠，有助于提升专注力~",
    "适当补充水分和营养让大脑更有活力！"
];

function getRandomTip() {
    return FOCUS_TIPS[Math.floor(Math.random() * FOCUS_TIPS.length)];
}

function showTipModal() {
    const tip = getRandomTip();
    let modal = document.getElementById('tipsModal');
    if (!modal) return alert(tip); // 兼容未写modal结构时用alert
    modal.querySelector('.tips-text').textContent = tip;
    modal.classList.add('active');
}

// 成就系统 - 基础结构
const ACHIEVEMENTS = [
  { id: 'complete_first_level', name: '完成首关', desc: '完成任意一关卡', icon: '🎉' },
  { id: 'total_30_stars', name: '累计30星', desc: '获得30颗星', icon: '🌟' },
  { id: 'total_60_stars', name: '累计60星', desc: '获得60颗星', icon: '💫' },
  { id: 'total_100_stars', name: '累计100星', desc: '获得100颗星', icon: '🏆' },
  { id: 'all_game1_pass', name: '动物全通关', desc: '项目1全部关卡通关', icon: '🦁' },
  { id: 'all_games_pass', name: '全部解锁', desc: '全部20个项目都已全通关', icon: '🎊' }
  // 可扩展更多成就
];

function loadAchievements() {
  const a = localStorage.getItem('focusGameAchievements');
  return a ? JSON.parse(a) : {};
}
function saveAchievements(ach) {
  localStorage.setItem('focusGameAchievements', JSON.stringify(ach));
}
function unlockAchievement(id) {
  const ach = loadAchievements();
  if (!ach[id]) {
    ach[id] = true;
    saveAchievements(ach);
    // 成就弹窗/动画可在这里弹出
    showAchievementToast(id);
  }
}
function checkAllAchievements() {
  const progress = getProgress();
  // 完成首个关卡
  for (const game in progress) {
    if (progress[game].some(l=>l.completed)) { unlockAchievement('complete_first_level'); break; }
  }
  // 总星数
  let total = 0;
  for (const game in progress) {
    progress[game].forEach(level => { total += level.stars||0; });
  }
  if (total>=100) unlockAchievement('total_100_stars');
  if (total>=60) unlockAchievement('total_60_stars');
  if (total>=30) unlockAchievement('total_30_stars');
  // game1所有关卡通关
  if (progress['game1'] && progress['game1'].every(l=>l.completed)) unlockAchievement('all_game1_pass');
  // 所有项目解锁（20个项目都全通关）
  let allPass = true;
  for (let i=1;i<=20;i++) {
    if (!progress['game'+i] || !progress['game'+i].every(l=>l.completed)) { allPass=false; break;}
  }
  if (allPass) unlockAchievement('all_games_pass');
}
// 通用成就toast，优化为美化弹窗
function showAchievementToast(id) {
  const a = ACHIEVEMENTS.find(e=>e.id===id);
  if (!a) return;
  
  // 创建成就提示元素
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 10000;
    text-align: center;
    min-width: 300px;
    opacity: 0;
    animation: achievementPop 0.5s forwards;
  `;
  
  toast.innerHTML = `
    <div style="font-size: 60px; margin-bottom: 15px; animation: bounce 0.6s ease-in-out;">${a.icon}</div>
    <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">🎉 成就解锁！</div>
    <div style="font-size: 20px; margin-bottom: 8px;">${a.name}</div>
    <div style="font-size: 14px; opacity: 0.9;">${a.desc}</div>
  `;
  
  document.body.appendChild(toast);
  
  // 3秒后自动消失
  setTimeout(() => {
    toast.style.animation = 'achievementFadeOut 0.5s forwards';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
  
  // 添加动画样式
  if (!document.getElementById('achievement-animations')) {
    const style = document.createElement('style');
    style.id = 'achievement-animations';
    style.textContent = `
      @keyframes achievementPop {
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes achievementFadeOut {
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
}

// 初始化
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        addTouchFeedback();
        // 首页自动弹出tips
        if(document.body.classList.contains('home-page')){
            setTimeout(showTipModal, 600); // 延迟0.6秒弹出，避免和其它弹窗冲突
        }
        // 进入首页时也检测（防止漏掉旧数据成就）
        checkAllAchievements();
    });
}

// 返回主页
function goHome() {
    window.location.href = 'index.html';
}

// 重试关卡
function retryLevel() {
    window.location.reload();
}

// 下一关
function nextLevel(currentGame, currentLevel) {
    if (currentLevel < 5) {
        window.location.href = `${currentGame}-level${currentLevel + 1}.html`;
    } else {
        window.location.href = 'index.html';
    }
}

// ========== 成就展示功能 ==========
function showAchievements() {
    const achievements = loadAchievements();
    const list = document.getElementById('achievementList');
    if (!list) return;
    
    let html = '<div style="display:grid;gap:15px;">';
    ACHIEVEMENTS.forEach(ach => {
        const unlocked = achievements[ach.id];
        const style = unlocked 
            ? 'background:linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);color:white;' 
            : 'background:#e0e0e0;color:#999;';
        html += `
            <div style="${style}padding:15px;border-radius:15px;display:flex;align-items:center;gap:15px;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                <div style="font-size:40px;">${ach.icon}</div>
                <div style="flex:1;">
                    <div style="font-size:18px;font-weight:bold;margin-bottom:5px;">${ach.name}</div>
                    <div style="font-size:14px;opacity:0.9;">${ach.desc}</div>
                </div>
                <div style="font-size:24px;">${unlocked ? '✅' : '🔒'}</div>
            </div>
        `;
    });
    html += '</div>';
    
    const unlockedCount = Object.keys(achievements).length;
    html = `<div style="text-align:center;margin-bottom:20px;font-size:18px;color:#666;">
        已解锁 <span style="color:#ff6b6b;font-weight:bold;font-size:24px;">${unlockedCount}</span> / ${ACHIEVEMENTS.length}
    </div>` + html;
    
    list.innerHTML = html;
    showModal('achievementModal');
}

// ========== 家长报告功能 ==========
function showParentReport() {
    const progress = getProgress();
    const content = document.getElementById('reportContent');
    if (!content) return;
    
    // 统计数据
    let totalLevels = 0;
    let completedLevels = 0;
    let totalStars = 0;
    let gameStats = [];
    
    for (let i = 1; i <= 20; i++) {
        const gameKey = 'game' + i;
        const levels = progress[gameKey] || [];
        const completed = levels.filter(l => l.completed).length;
        const stars = levels.reduce((sum, l) => sum + (l.stars || 0), 0);
        
        totalLevels += 5;
        completedLevels += completed;
        totalStars += stars;
        
        if (completed > 0) {
            gameStats.push({
                game: i,
                completed: completed,
                stars: stars,
                progress: (completed / 5 * 100).toFixed(0)
            });
        }
    }
    
    const completionRate = (completedLevels / totalLevels * 100).toFixed(1);
    
    // 生成报告HTML
    let html = `
        <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;padding:20px;border-radius:15px;margin-bottom:20px;">
            <div style="font-size:24px;font-weight:bold;margin-bottom:15px;">📈 学习概况</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div style="background:rgba(255,255,255,0.2);padding:15px;border-radius:10px;text-align:center;">
                    <div style="font-size:36px;font-weight:bold;">${totalStars}</div>
                    <div style="font-size:14px;opacity:0.9;">总星数 ⭐</div>
                </div>
                <div style="background:rgba(255,255,255,0.2);padding:15px;border-radius:10px;text-align:center;">
                    <div style="font-size:36px;font-weight:bold;">${completionRate}%</div>
                    <div style="font-size:14px;opacity:0.9;">完成率 📊</div>
                </div>
            </div>
            <div style="margin-top:15px;background:rgba(255,255,255,0.2);padding:15px;border-radius:10px;text-align:center;">
                <div style="font-size:16px;">已完成 <span style="font-size:24px;font-weight:bold;">${completedLevels}</span> / ${totalLevels} 关</div>
            </div>
        </div>
        
        <div style="background:#f8f9fa;padding:20px;border-radius:15px;margin-bottom:20px;">
            <div style="font-size:20px;font-weight:bold;margin-bottom:15px;color:#666;">🎮 项目进度</div>
            ${gameStats.length === 0 ? '<div style="text-align:center;color:#999;padding:20px;">还没有开始项目哦~</div>' : ''}
            <div style="display:grid;gap:10px;">
    `;
    
    gameStats.forEach(stat => {
        html += `
            <div style="background:white;padding:12px;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-weight:bold;color:#4ecdc4;">项目 ${stat.game}</span>
                    <span style="color:#ff6b6b;">${stat.stars} ⭐</span>
                </div>
                <div style="background:#e0e0e0;height:8px;border-radius:4px;overflow:hidden;">
                    <div style="background:linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);height:100%;width:${stat.progress}%;transition:width 0.3s;"></div>
                </div>
                <div style="text-align:right;font-size:12px;color:#999;margin-top:5px;">${stat.completed} / 5 关 (${stat.progress}%)</div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div style="background:#fff3cd;padding:15px;border-radius:10px;border-left:4px solid #ffc107;">
            <div style="font-weight:bold;color:#856404;margin-bottom:8px;">💡 学习建议</div>
            <ul style="margin:0;padding-left:20px;color:#856404;line-height:1.8;">
                ${totalStars < 30 ? '<li>继续加油！每天坚持练习可以提升专注力</li>' : ''}
                ${totalStars >= 30 && totalStars < 100 ? '<li>进步很大！可以尝试挑战更高难度的关卡</li>' : ''}
                ${totalStars >= 100 ? '<li>太棒了！已经是专注力小能手了！</li>' : ''}
                <li>建议每次项目时间控制在15-20分钟</li>
                <li>适当休息可以让注意力更集中</li>
            </ul>
        </div>
    `;
    
    content.innerHTML = html;
    showModal('reportModal');
}

// ========== 错误提示功能 ==========
function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) {
        errorMsg.textContent = message;
    }
    // 不关闭当前弹窗，直接在上层显示错误提示
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.classList.add('active');
    }
}

// ========== 举报提交功能 ==========
function submitReport() {
    const type = document.getElementById('reportType').value;
    const content = document.getElementById('reportDescription').value.trim();
    const contact = document.getElementById('reportContactInfo').value.trim();
    
    // 表单验证
    if (!type) {
        showError('请选择举报类型');
        return;
    }
    
    if (!content) {
        showError('请填写问题描述');
        return;
    }
    
    if (content.length < 10) {
        showError('问题描述至少需要10个字符，当前：' + content.length + '个字符');
        return;
    }
    
    // 收集举报信息
    const reportData = {
        type: type,
        content: content,
        contact: contact,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // 保存到本地存储（实际项目中应发送到服务器）
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    reports.push(reportData);
    localStorage.setItem('userReports', JSON.stringify(reports));
    
    console.log('举报信息已保存：', reportData);
    
    // 关闭表单弹窗，显示成功提示
    closeModal();
    setTimeout(() => {
        showModal('reportSuccessModal');
    }, 300);
}

// ========== 首页按钮事件绑定 ==========
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // 成就按钮
        const achievementBtn = document.getElementById('achievementBtn');
        if (achievementBtn) {
            achievementBtn.addEventListener('click', showAchievements);
        }
        
        // 家长报告按钮
        const parentReportBtn = document.getElementById('parentReportBtn');
        if (parentReportBtn) {
            parentReportBtn.addEventListener('click', showParentReport);
        }
    });
}

