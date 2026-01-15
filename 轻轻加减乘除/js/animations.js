// 动画管理器
class AnimationManager {
    constructor() {
        this.animationArea = null;
        this.currentAnimation = null;
        this.animationTimeout = null;
    }
    
    // 初始化动画区域
    init(containerId) {
        this.animationArea = document.getElementById(containerId);
    }
    
    // 清除当前动画
    clear() {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
        if (this.animationArea) {
            this.animationArea.innerHTML = '';
        }
    }
    
    // 播放加法动画
    playAdditionAnimation(a, b, answer) {
        this.clear();
        
        const container = document.createElement('div');
        container.className = 'addition-animation';
        
        // 创建第一组物品
        const group1 = this.createItemGroup(a, 'apple', '🍎');
        const plusSign = this.createOperatorSign('+');
        const group2 = this.createItemGroup(b, 'star', '⭐');
        const equalsSign = this.createOperatorSign('=');
        const resultGroup = document.createElement('div');
        resultGroup.className = 'item-group';
        
        container.appendChild(group1);
        container.appendChild(plusSign);
        container.appendChild(group2);
        container.appendChild(equalsSign);
        container.appendChild(resultGroup);
        
        this.animationArea.appendChild(container);
        
        // 动画：逐个将物品移动到结果组
        let count = 0;
        const items1 = Array.from(group1.children);
        const items2 = Array.from(group2.children);
        const allItems = [...items1, ...items2];
        
        const moveInterval = setInterval(() => {
            if (count < allItems.length) {
                const item = allItems[count];
                const clone = item.cloneNode(true);
                clone.style.animation = 'itemAppear 0.3s ease';
                resultGroup.appendChild(clone);
                item.style.opacity = '0.3';
                count++;
                
                // 更新数字显示
                const countDisplay = document.createElement('div');
                countDisplay.className = 'number-display';
                countDisplay.textContent = count;
                countDisplay.style.position = 'absolute';
                countDisplay.style.top = '-30px';
                countDisplay.style.right = '10px';
                countDisplay.style.fontSize = '24px';
                countDisplay.style.fontWeight = 'bold';
                countDisplay.style.color = '#667eea';
                resultGroup.style.position = 'relative';
                
                const oldDisplay = resultGroup.querySelector('.number-display');
                if (oldDisplay) oldDisplay.remove();
                resultGroup.appendChild(countDisplay);
            } else {
                clearInterval(moveInterval);
                this.showSuccessEffect();
            }
        }, 300);
    }
    
    // 播放减法动画
    playSubtractionAnimation(a, b, answer) {
        this.clear();
        
        const container = document.createElement('div');
        container.className = 'subtraction-animation';
        
        // 显示初始物品
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';
        
        for (let i = 0; i < a; i++) {
            const item = document.createElement('div');
            item.className = 'subtract-item';
            item.style.background = 'linear-gradient(135deg, #4ECDC4, #44A08D)';
            item.innerHTML = '🎈';
            itemContainer.appendChild(item);
        }
        
        const minusText = document.createElement('div');
        minusText.style.fontSize = '24px';
        minusText.style.margin = '10px';
        minusText.innerHTML = `${a} - ${b} = ?`;
        
        container.appendChild(minusText);
        container.appendChild(itemContainer);
        this.animationArea.appendChild(container);
        
        // 动画：逐个移除物品
        let removed = 0;
        const items = Array.from(itemContainer.children);
        
        const removeInterval = setInterval(() => {
            if (removed < b) {
                const itemToRemove = items[items.length - 1 - removed];
                itemToRemove.classList.add('removing');
                removed++;
                
                // 更新显示
                minusText.innerHTML = `${a} - ${removed} = ${a - removed}`;
            } else {
                clearInterval(removeInterval);
                minusText.innerHTML = `${a} - ${b} = ${answer}`;
                minusText.classList.add('success-animation');
                this.showSuccessEffect();
            }
        }, 500);
    }
    
    // 播放乘法动画
    playMultiplicationAnimation(a, b, answer) {
        this.clear();
        
        const container = document.createElement('div');
        container.className = 'multiplication-animation';
        
        const title = document.createElement('div');
        title.style.fontSize = '24px';
        title.style.marginBottom = '20px';
        title.innerHTML = `${a} × ${b} = ${a}个${b} = ?`;
        
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'multiply-groups';
        
        container.appendChild(title);
        container.appendChild(groupsContainer);
        this.animationArea.appendChild(container);
        
        // 创建组
        let groupCount = 0;
        let totalCount = 0;
        
        const createGroupInterval = setInterval(() => {
            if (groupCount < a) {
                const group = document.createElement('div');
                group.className = 'multiply-group';
                
                for (let j = 0; j < b; j++) {
                    setTimeout(() => {
                        const item = document.createElement('div');
                        item.className = 'multiply-item';
                        item.innerHTML = '⭐';
                        group.appendChild(item);
                        totalCount++;
                        
                        // 更新标题
                        title.innerHTML = `${a} × ${b} = ${a}个${b} = ${totalCount}`;
                    }, j * 100);
                }
                
                const label = document.createElement('div');
                label.className = 'group-label';
                label.textContent = `第${groupCount + 1}组`;
                group.appendChild(label);
                
                groupsContainer.appendChild(group);
                groupCount++;
            } else {
                clearInterval(createGroupInterval);
                setTimeout(() => {
                    title.innerHTML = `${a} × ${b} = ${answer}`;
                    title.classList.add('success-animation');
                    this.showSuccessEffect();
                }, b * 100);
            }
        }, 600);
    }
    
    // 播放除法动画
    playDivisionAnimation(a, b, answer) {
        this.clear();
        
        const container = document.createElement('div');
        container.className = 'division-animation';
        
        const title = document.createElement('div');
        title.style.fontSize = '24px';
        title.style.marginBottom = '20px';
        title.innerHTML = `${a} ÷ ${b} = ? (把${a}个物品平均分成${b}组)`;
        
        const divisionContainer = document.createElement('div');
        divisionContainer.className = 'division-container';
        
        // 创建总数容器
        const totalItems = document.createElement('div');
        totalItems.className = 'total-items';
        
        for (let i = 0; i < a; i++) {
            const item = document.createElement('div');
            item.className = 'division-item';
            item.innerHTML = '🍪';
            item.style.opacity = '1';
            totalItems.appendChild(item);
        }
        
        const arrow = document.createElement('div');
        arrow.className = 'division-arrow';
        arrow.innerHTML = '→';
        
        const dividedGroups = document.createElement('div');
        dividedGroups.className = 'divided-groups';
        
        // 创建空组
        for (let i = 0; i < b; i++) {
            const group = document.createElement('div');
            group.className = 'divided-group';
            group.dataset.groupIndex = i;
            dividedGroups.appendChild(group);
        }
        
        divisionContainer.appendChild(totalItems);
        divisionContainer.appendChild(arrow);
        divisionContainer.appendChild(dividedGroups);
        
        container.appendChild(title);
        container.appendChild(divisionContainer);
        this.animationArea.appendChild(container);
        
        // 动画：分配物品到各组
        const items = Array.from(totalItems.children);
        let distributed = 0;
        const groups = Array.from(dividedGroups.children);
        
        const distributeInterval = setInterval(() => {
            if (distributed < a) {
                const item = items[distributed];
                const groupIndex = distributed % b;
                const targetGroup = groups[groupIndex];
                
                const clone = item.cloneNode(true);
                clone.style.animation = 'divisionDistribute 0.5s ease';
                targetGroup.appendChild(clone);
                item.style.opacity = '0.3';
                
                distributed++;
            } else {
                clearInterval(distributeInterval);
                title.innerHTML = `${a} ÷ ${b} = ${answer} (每组${answer}个)`;
                title.classList.add('success-animation');
                this.showSuccessEffect();
            }
        }, 300);
    }
    
    // 创建物品组
    createItemGroup(count, type, emoji) {
        const group = document.createElement('div');
        group.className = 'item-group';
        
        for (let i = 0; i < count; i++) {
            const item = document.createElement('div');
            item.className = `counting-item ${type}`;
            item.innerHTML = emoji;
            item.style.animationDelay = `${i * 0.1}s`;
            group.appendChild(item);
        }
        
        return group;
    }
    
    // 创建运算符号
    createOperatorSign(operator) {
        const sign = document.createElement('div');
        sign.style.fontSize = '36px';
        sign.style.fontWeight = 'bold';
        sign.style.margin = '0 20px';
        sign.style.color = '#667eea';
        sign.textContent = operator;
        return sign;
    }
    
    // 显示成功效果
    showSuccessEffect() {
        const stars = ['⭐', '🌟', '✨', '💫', '🎉'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'star-reward';
                star.innerHTML = stars[i % stars.length];
                star.style.left = `${Math.random() * 80 + 10}%`;
                star.style.top = `${Math.random() * 60 + 20}%`;
                this.animationArea.appendChild(star);
                
                setTimeout(() => star.remove(), 2000);
            }, i * 200);
        }
    }
    
    // 播放正确答案动画
    playCorrectAnimation() {
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✅ 答对了！太棒了！';
        feedback.classList.remove('hidden');
        
        // 播放成功音效（用视觉效果代替）
        document.body.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }, 500);
    }
    
    // 播放错误答案动画
    playWrongAnimation(correctAnswer) {
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback wrong';
        feedback.innerHTML = `❌ 再想想，正确答案是 ${correctAnswer}`;
        feedback.classList.remove('hidden');
        
        // 播放错误音效（用视觉效果代替）
        const answerInput = document.getElementById('answerInput');
        answerInput.classList.add('error-shake');
        setTimeout(() => {
            answerInput.classList.remove('error-shake');
        }, 400);
    }
    
    // 显示进度动画
    showProgressAnimation(current, total) {
        const progressPercent = (current / total) * 100;
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            if (bar.classList.contains(`${currentOperation}-progress`)) {
                bar.style.width = `${progressPercent}%`;
                bar.classList.add('progress-animation');
            }
        });
    }
}
