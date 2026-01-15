// 题目生成器
class QuestionGenerator {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
    }
    
    // 生成指定类型和类别的题目
    generateQuestions(operation, category, count = 100) {
        this.questions = [];
        this.currentIndex = 0;
        
        switch(operation) {
            case 'addition':
                this.generateAdditionQuestions(category, count);
                break;
            case 'subtraction':
                this.generateSubtractionQuestions(category, count);
                break;
            case 'multiplication':
                this.generateMultiplicationQuestions(category, count);
                break;
            case 'division':
                this.generateDivisionQuestions(category, count);
                break;
        }
        
        // 打乱题目顺序
        this.shuffleQuestions();
        return this.questions;
    }
    
    // 生成加法题目
    generateAdditionQuestions(category, count) {
        const questions = [];
        
        if (category.range) {
            // 范围类题目
            const [min, max] = category.range;
            for (let i = 0; i < count; i++) {
                const a = this.randomInt(min, Math.floor(max/2));
                const b = this.randomInt(min, Math.floor(max/2));
                questions.push({
                    text: `${a} + ${b} = ?`,
                    a: a,
                    b: b,
                    answer: a + b,
                    type: 'addition'
                });
            }
        } else if (category.special) {
            // 特殊类题目
            switch(category.special) {
                case 'tens':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 9) * 10;
                        const b = this.randomInt(1, 9) * 10;
                        questions.push({
                            text: `${a} + ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a + b,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'carry10':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(6, 9);
                        const b = this.randomInt(6, 9);
                        questions.push({
                            text: `${a} + ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a + b,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'carry20':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(11, 19);
                        const b = this.randomInt(6, 9);
                        questions.push({
                            text: `${a} + ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a + b,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'double':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 20);
                        questions.push({
                            text: `${a} + ${a} = ?`,
                            a: a,
                            b: a,
                            answer: a + a,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'plus1':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 99);
                        questions.push({
                            text: `${a} + 1 = ?`,
                            a: a,
                            b: 1,
                            answer: a + 1,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'plus2':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 98);
                        questions.push({
                            text: `${a} + 2 = ?`,
                            a: a,
                            b: 2,
                            answer: a + 2,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'plus5':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 95);
                        questions.push({
                            text: `${a} + 5 = ?`,
                            a: a,
                            b: 5,
                            answer: a + 5,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'plus10':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 90);
                        questions.push({
                            text: `${a} + 10 = ?`,
                            a: a,
                            b: 10,
                            answer: a + 10,
                            type: 'addition'
                        });
                    }
                    break;
                
                case 'three':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 10);
                        const b = this.randomInt(1, 10);
                        const c = this.randomInt(1, 10);
                        questions.push({
                            text: `${a} + ${b} + ${c} = ?`,
                            a: a,
                            b: b,
                            c: c,
                            answer: a + b + c,
                            type: 'addition_three'
                        });
                    }
                    break;
                
                case 'missing':
                    for (let i = 0; i < count; i++) {
                        const answer = this.randomInt(3, 20);
                        const b = this.randomInt(1, answer - 1);
                        const a = answer - b;
                        questions.push({
                            text: `? + ${b} = ${answer}`,
                            a: a,
                            b: b,
                            answer: a,
                            type: 'addition_missing'
                        });
                    }
                    break;
                
                case 'word':
                    const wordProblems = [
                        { template: '小明有{a}个苹果，小红给了他{b}个，一共有几个？', icon: '🍎' },
                        { template: '篮子里有{a}个橘子，又放进{b}个，现在有几个？', icon: '🍊' },
                        { template: '停车场有{a}辆车，又开来{b}辆，一共几辆？', icon: '🚗' },
                        { template: '树上有{a}只鸟，又飞来{b}只，一共几只？', icon: '🐦' },
                        { template: '花园里有{a}朵花，又开了{b}朵，一共几朵？', icon: '🌸' }
                    ];
                    
                    for (let i = 0; i < count; i++) {
                        const problem = wordProblems[i % wordProblems.length];
                        const a = this.randomInt(1, 20);
                        const b = this.randomInt(1, 20);
                        const text = problem.template.replace('{a}', a).replace('{b}', b);
                        questions.push({
                            text: text,
                            a: a,
                            b: b,
                            answer: a + b,
                            type: 'addition_word',
                            icon: problem.icon
                        });
                    }
                    break;
                
                default:
                    // 混合练习
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 50);
                        const b = this.randomInt(1, 50);
                        questions.push({
                            text: `${a} + ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a + b,
                            type: 'addition'
                        });
                    }
            }
        }
        
        this.questions = questions;
    }
    
    // 生成减法题目
    generateSubtractionQuestions(category, count) {
        const questions = [];
        
        if (category.range) {
            const [min, max] = category.range;
            for (let i = 0; i < count; i++) {
                const a = this.randomInt(min + 1, max);
                const b = this.randomInt(min, a - 1);
                questions.push({
                    text: `${a} - ${b} = ?`,
                    a: a,
                    b: b,
                    answer: a - b,
                    type: 'subtraction'
                });
            }
        } else if (category.special) {
            switch(category.special) {
                case 'tens':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(2, 10) * 10;
                        const b = this.randomInt(1, a/10 - 1) * 10;
                        questions.push({
                            text: `${a} - ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a - b,
                            type: 'subtraction'
                        });
                    }
                    break;
                
                case 'from10':
                    for (let i = 0; i < count; i++) {
                        const b = this.randomInt(1, 9);
                        questions.push({
                            text: `10 - ${b} = ?`,
                            a: 10,
                            b: b,
                            answer: 10 - b,
                            type: 'subtraction'
                        });
                    }
                    break;
                
                case 'minus1':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(2, 100);
                        questions.push({
                            text: `${a} - 1 = ?`,
                            a: a,
                            b: 1,
                            answer: a - 1,
                            type: 'subtraction'
                        });
                    }
                    break;
                
                case 'minus2':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(3, 100);
                        questions.push({
                            text: `${a} - 2 = ?`,
                            a: a,
                            b: 2,
                            answer: a - 2,
                            type: 'subtraction'
                        });
                    }
                    break;
                
                case 'missing':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(5, 20);
                        const answer = this.randomInt(1, a - 1);
                        const b = a - answer;
                        questions.push({
                            text: `? - ${b} = ${answer}`,
                            a: a,
                            b: b,
                            answer: a,
                            type: 'subtraction_missing'
                        });
                    }
                    break;
                
                case 'word':
                    const wordProblems = [
                        { template: '小明有{a}个糖果，吃了{b}个，还剩几个？', icon: '🍬' },
                        { template: '树上有{a}只鸟，飞走了{b}只，还剩几只？', icon: '🐦' },
                        { template: '停车场有{a}辆车，开走了{b}辆，还剩几辆？', icon: '🚗' },
                        { template: '篮子里有{a}个苹果，拿走了{b}个，还剩几个？', icon: '🍎' },
                        { template: '花瓶里有{a}朵花，凋谢了{b}朵，还剩几朵？', icon: '🌸' }
                    ];
                    
                    for (let i = 0; i < count; i++) {
                        const problem = wordProblems[i % wordProblems.length];
                        const a = this.randomInt(5, 20);
                        const b = this.randomInt(1, a - 1);
                        const text = problem.template.replace('{a}', a).replace('{b}', b);
                        questions.push({
                            text: text,
                            a: a,
                            b: b,
                            answer: a - b,
                            type: 'subtraction_word',
                            icon: problem.icon
                        });
                    }
                    break;
                
                default:
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(2, 50);
                        const b = this.randomInt(1, a - 1);
                        questions.push({
                            text: `${a} - ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a - b,
                            type: 'subtraction'
                        });
                    }
            }
        }
        
        this.questions = questions;
    }
    
    // 生成乘法题目
    generateMultiplicationQuestions(category, count) {
        const questions = [];
        
        if (category.range) {
            const [min, max] = category.range;
            for (let i = 0; i < count; i++) {
                const a = this.randomInt(min, max);
                const b = this.randomInt(min, max);
                questions.push({
                    text: `${a} × ${b} = ?`,
                    a: a,
                    b: b,
                    answer: a * b,
                    type: 'multiplication'
                });
            }
        } else if (category.special) {
            switch(category.special) {
                case 'table1':
                case 'table2':
                case 'table3':
                case 'table4':
                case 'table5':
                case 'table6':
                case 'table7':
                case 'table8':
                case 'table9':
                    const tableNum = parseInt(category.special.replace('table', ''));
                    for (let i = 0; i < count; i++) {
                        const b = this.randomInt(1, 9);
                        questions.push({
                            text: `${tableNum} × ${b} = ?`,
                            a: tableNum,
                            b: b,
                            answer: tableNum * b,
                            type: 'multiplication'
                        });
                    }
                    break;
                
                case 'by0':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(0, 20);
                        questions.push({
                            text: `${a} × 0 = ?`,
                            a: a,
                            b: 0,
                            answer: 0,
                            type: 'multiplication'
                        });
                    }
                    break;
                
                case 'by1':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 100);
                        questions.push({
                            text: `${a} × 1 = ?`,
                            a: a,
                            b: 1,
                            answer: a,
                            type: 'multiplication'
                        });
                    }
                    break;
                
                case 'by10':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 20);
                        questions.push({
                            text: `${a} × 10 = ?`,
                            a: a,
                            b: 10,
                            answer: a * 10,
                            type: 'multiplication'
                        });
                    }
                    break;
                
                case 'square':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 10);
                        questions.push({
                            text: `${a} × ${a} = ?`,
                            a: a,
                            b: a,
                            answer: a * a,
                            type: 'multiplication'
                        });
                    }
                    break;
                
                case 'double':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 20);
                        questions.push({
                            text: `${a} × 2 = ?`,
                            a: a,
                            b: 2,
                            answer: a * 2,
                            type: 'multiplication'
                        });
                    }
                    break;
                
                case 'missing':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(2, 9);
                        const b = this.randomInt(2, 9);
                        const answer = a * b;
                        questions.push({
                            text: `? × ${b} = ${answer}`,
                            a: a,
                            b: b,
                            answer: a,
                            type: 'multiplication_missing'
                        });
                    }
                    break;
                
                case 'word':
                    const wordProblems = [
                        { template: '一盒有{a}个鸡蛋，{b}盒一共有几个？', icon: '🥚' },
                        { template: '每束花有{a}朵，{b}束一共有几朵？', icon: '🌸' },
                        { template: '一辆车有{a}个轮子，{b}辆车一共有几个轮子？', icon: '🚗' },
                        { template: '每组有{a}个小朋友，{b}组一共有几个小朋友？', icon: '👶' },
                        { template: '一棵树有{a}个苹果，{b}棵树一共有几个苹果？', icon: '🍎' }
                    ];
                    
                    for (let i = 0; i < count; i++) {
                        const problem = wordProblems[i % wordProblems.length];
                        const a = this.randomInt(2, 9);
                        const b = this.randomInt(2, 9);
                        const text = problem.template.replace('{a}', a).replace('{b}', b);
                        questions.push({
                            text: text,
                            a: a,
                            b: b,
                            answer: a * b,
                            type: 'multiplication_word',
                            icon: problem.icon
                        });
                    }
                    break;
                
                default:
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 9);
                        const b = this.randomInt(1, 9);
                        questions.push({
                            text: `${a} × ${b} = ?`,
                            a: a,
                            b: b,
                            answer: a * b,
                            type: 'multiplication'
                        });
                    }
            }
        }
        
        this.questions = questions;
    }
    
    // 生成除法题目
    generateDivisionQuestions(category, count) {
        const questions = [];
        
        if (category.range) {
            const [min, max] = category.range;
            for (let i = 0; i < count; i++) {
                const b = this.randomInt(1, 9);
                const answer = this.randomInt(min, Math.min(max, 9));
                const a = b * answer;
                questions.push({
                    text: `${a} ÷ ${b} = ?`,
                    a: a,
                    b: b,
                    answer: answer,
                    type: 'division'
                });
            }
        } else if (category.special) {
            switch(category.special) {
                case 'by1':
                case 'by2':
                case 'by3':
                case 'by4':
                case 'by5':
                case 'by6':
                case 'by7':
                case 'by8':
                case 'by9':
                    const divisor = parseInt(category.special.replace('by', ''));
                    for (let i = 0; i < count; i++) {
                        const answer = this.randomInt(1, 9);
                        const a = divisor * answer;
                        questions.push({
                            text: `${a} ÷ ${divisor} = ?`,
                            a: a,
                            b: divisor,
                            answer: answer,
                            type: 'division'
                        });
                    }
                    break;
                
                case 'by10':
                    for (let i = 0; i < count; i++) {
                        const answer = this.randomInt(1, 10);
                        const a = answer * 10;
                        questions.push({
                            text: `${a} ÷ 10 = ?`,
                            a: a,
                            b: 10,
                            answer: answer,
                            type: 'division'
                        });
                    }
                    break;
                
                case 'self':
                    for (let i = 0; i < count; i++) {
                        const a = this.randomInt(1, 20);
                        questions.push({
                            text: `${a} ÷ ${a} = ?`,
                            a: a,
                            b: a,
                            answer: 1,
                            type: 'division'
                        });
                    }
                    break;
                
                case 'half':
                    for (let i = 0; i < count; i++) {
                        const answer = this.randomInt(1, 20);
                        const a = answer * 2;
                        questions.push({
                            text: `${a} ÷ 2 = ?`,
                            a: a,
                            b: 2,
                            answer: answer,
                            type: 'division'
                        });
                    }
                    break;
                
                case 'table':
                    for (let i = 0; i < count; i++) {
                        const b = this.randomInt(2, 9);
                        const answer = this.randomInt(2, 9);
                        const a = b * answer;
                        questions.push({
                            text: `${a} ÷ ${b} = ?`,
                            a: a,
                            b: b,
                            answer: answer,
                            type: 'division'
                        });
                    }
                    break;
                
                case 'missing':
                    for (let i = 0; i < count; i++) {
                        const b = this.randomInt(2, 9);
                        const answer = this.randomInt(2, 9);
                        const a = b * answer;
                        questions.push({
                            text: `? ÷ ${b} = ${answer}`,
                            a: a,
                            b: b,
                            answer: a,
                            type: 'division_missing'
                        });
                    }
                    break;
                
                case 'word':
                    const wordProblems = [
                        { template: '{a}个苹果平均分给{b}个小朋友，每人分几个？', icon: '🍎' },
                        { template: '{a}块糖果装进{b}个盒子，每盒装几块？', icon: '🍬' },
                        { template: '{a}本书放在{b}个书架上，每个书架放几本？', icon: '📚' },
                        { template: '{a}个玩具分给{b}个孩子，每人得几个？', icon: '🧸' },
                        { template: '{a}朵花插在{b}个花瓶里，每个花瓶插几朵？', icon: '🌸' }
                    ];
                    
                    for (let i = 0; i < count; i++) {
                        const problem = wordProblems[i % wordProblems.length];
                        const b = this.randomInt(2, 9);
                        const answer = this.randomInt(2, 9);
                        const a = b * answer;
                        const text = problem.template.replace('{a}', a).replace('{b}', b);
                        questions.push({
                            text: text,
                            a: a,
                            b: b,
                            answer: answer,
                            type: 'division_word',
                            icon: problem.icon
                        });
                    }
                    break;
                
                default:
                    for (let i = 0; i < count; i++) {
                        const b = this.randomInt(1, 9);
                        const answer = this.randomInt(1, 9);
                        const a = b * answer;
                        questions.push({
                            text: `${a} ÷ ${b} = ?`,
                            a: a,
                            b: b,
                            answer: answer,
                            type: 'division'
                        });
                    }
            }
        }
        
        this.questions = questions;
    }
    
    // 工具函数：生成随机整数
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // 工具函数：打乱数组
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }
    
    // 获取下一题
    getNextQuestion() {
        if (this.currentIndex < this.questions.length) {
            return this.questions[this.currentIndex++];
        }
        return null;
    }
    
    // 获取当前题号
    getCurrentIndex() {
        return this.currentIndex;
    }
    
    // 获取总题数
    getTotalCount() {
        return this.questions.length;
    }
}
