// 应用配置文件
const config = {
    // 加法类别配置
    addition: {
        name: '加法练习',
        categories: [
            { id: 'add_1_5', name: '1-5加法', emoji: '🍎', range: [1, 5], description: '1到5的简单加法' },
            { id: 'add_1_10', name: '10以内加法', emoji: '🍓', range: [1, 10], description: '10以内的加法' },
            { id: 'add_1_20', name: '20以内加法', emoji: '🍊', range: [1, 20], description: '20以内的加法' },
            { id: 'add_1_50', name: '50以内加法', emoji: '🍋', range: [1, 50], description: '50以内的加法' },
            { id: 'add_1_100', name: '100以内加法', emoji: '🍉', range: [1, 100], description: '100以内的加法' },
            { id: 'add_tens', name: '整十数加法', emoji: '🎯', special: 'tens', description: '10,20,30等整十数' },
            { id: 'add_carry_10', name: '进位加法(10)', emoji: '🚀', special: 'carry10', description: '需要进位的10以内加法' },
            { id: 'add_carry_20', name: '进位加法(20)', emoji: '✈️', special: 'carry20', description: '需要进位的20以内加法' },
            { id: 'add_double', name: '相同数相加', emoji: '👯', special: 'double', description: '如2+2, 5+5' },
            { id: 'add_plus_1', name: '加1练习', emoji: '☝️', special: 'plus1', description: '任意数加1' },
            { id: 'add_plus_2', name: '加2练习', emoji: '✌️', special: 'plus2', description: '任意数加2' },
            { id: 'add_plus_5', name: '加5练习', emoji: '🖐️', special: 'plus5', description: '任意数加5' },
            { id: 'add_plus_10', name: '加10练习', emoji: '🔟', special: 'plus10', description: '任意数加10' },
            { id: 'add_three', name: '三个数连加', emoji: '3️⃣', special: 'three', description: '三个数字连续相加' },
            { id: 'add_missing', name: '填空练习', emoji: '❓', special: 'missing', description: '?+3=5形式' },
            { id: 'add_compare', name: '比大小', emoji: '⚖️', special: 'compare', description: '比较两个加法结果' },
            { id: 'add_word', name: '应用题', emoji: '📖', special: 'word', description: '简单的加法应用题' },
            { id: 'add_money', name: '钱币计算', emoji: '💰', special: 'money', description: '元角分的加法' },
            { id: 'add_time', name: '时间计算', emoji: '⏰', special: 'time', description: '简单的时间加法' },
            { id: 'add_mix', name: '综合练习', emoji: '🎲', special: 'mix', description: '混合各种加法题型' }
        ]
    },
    
    // 减法类别配置
    subtraction: {
        name: '减法练习',
        categories: [
            { id: 'sub_1_5', name: '5以内减法', emoji: '🍒', range: [1, 5], description: '5以内的简单减法' },
            { id: 'sub_1_10', name: '10以内减法', emoji: '🍇', range: [1, 10], description: '10以内的减法' },
            { id: 'sub_1_20', name: '20以内减法', emoji: '🥝', range: [1, 20], description: '20以内的减法' },
            { id: 'sub_1_50', name: '50以内减法', emoji: '🍑', range: [1, 50], description: '50以内的减法' },
            { id: 'sub_1_100', name: '100以内减法', emoji: '🥭', range: [1, 100], description: '100以内的减法' },
            { id: 'sub_tens', name: '整十数减法', emoji: '🎪', special: 'tens', description: '整十数的减法' },
            { id: 'sub_borrow_10', name: '退位减法(10)', emoji: '🔙', special: 'borrow10', description: '需要退位的10以内减法' },
            { id: 'sub_borrow_20', name: '退位减法(20)', emoji: '⬅️', special: 'borrow20', description: '需要退位的20以内减法' },
            { id: 'sub_from_10', name: '从10减', emoji: '🔟', special: 'from10', description: '10减去各个数' },
            { id: 'sub_minus_1', name: '减1练习', emoji: '1️⃣', special: 'minus1', description: '任意数减1' },
            { id: 'sub_minus_2', name: '减2练习', emoji: '2️⃣', special: 'minus2', description: '任意数减2' },
            { id: 'sub_minus_5', name: '减5练习', emoji: '5️⃣', special: 'minus5', description: '任意数减5' },
            { id: 'sub_minus_10', name: '减10练习', emoji: '🔻', special: 'minus10', description: '任意数减10' },
            { id: 'sub_continuous', name: '连续减法', emoji: '⏬', special: 'continuous', description: '连续减去多个数' },
            { id: 'sub_missing', name: '填空练习', emoji: '🔍', special: 'missing', description: '?-3=2形式' },
            { id: 'sub_compare', name: '比大小', emoji: '📊', special: 'compare', description: '比较两个减法结果' },
            { id: 'sub_word', name: '应用题', emoji: '📝', special: 'word', description: '简单的减法应用题' },
            { id: 'sub_money', name: '找零钱', emoji: '💵', special: 'money', description: '钱币的减法计算' },
            { id: 'sub_half', name: '一半练习', emoji: '➗', special: 'half', description: '求一半的练习' },
            { id: 'sub_mix', name: '综合练习', emoji: '🎨', special: 'mix', description: '混合各种减法题型' }
        ]
    },
    
    // 乘法类别配置
    multiplication: {
        name: '乘法练习',
        categories: [
            { id: 'mul_table_1', name: '1的乘法口诀', emoji: '1️⃣', special: 'table1', description: '1×1到1×9' },
            { id: 'mul_table_2', name: '2的乘法口诀', emoji: '2️⃣', special: 'table2', description: '2×1到2×9' },
            { id: 'mul_table_3', name: '3的乘法口诀', emoji: '3️⃣', special: 'table3', description: '3×1到3×9' },
            { id: 'mul_table_4', name: '4的乘法口诀', emoji: '4️⃣', special: 'table4', description: '4×1到4×9' },
            { id: 'mul_table_5', name: '5的乘法口诀', emoji: '5️⃣', special: 'table5', description: '5×1到5×9' },
            { id: 'mul_table_6', name: '6的乘法口诀', emoji: '6️⃣', special: 'table6', description: '6×1到6×9' },
            { id: 'mul_table_7', name: '7的乘法口诀', emoji: '7️⃣', special: 'table7', description: '7×1到7×9' },
            { id: 'mul_table_8', name: '8的乘法口诀', emoji: '8️⃣', special: 'table8', description: '8×1到8×9' },
            { id: 'mul_table_9', name: '9的乘法口诀', emoji: '9️⃣', special: 'table9', description: '9×1到9×9' },
            { id: 'mul_by_0', name: '0的乘法', emoji: '0️⃣', special: 'by0', description: '任何数乘以0' },
            { id: 'mul_by_1', name: '乘以1', emoji: '☝️', special: 'by1', description: '任何数乘以1' },
            { id: 'mul_by_10', name: '乘以10', emoji: '🔟', special: 'by10', description: '乘以10的规律' },
            { id: 'mul_square', name: '平方数', emoji: '⬜', special: 'square', description: '相同数相乘' },
            { id: 'mul_double', name: '翻倍练习', emoji: '✖️', special: 'double', description: '数字翻倍(×2)' },
            { id: 'mul_missing', name: '填空练习', emoji: '❔', special: 'missing', description: '?×3=12形式' },
            { id: 'mul_compare', name: '比大小', emoji: '⚖️', special: 'compare', description: '比较两个乘法结果' },
            { id: 'mul_word', name: '应用题', emoji: '📚', special: 'word', description: '简单的乘法应用题' },
            { id: 'mul_array', name: '阵列理解', emoji: '⬛', special: 'array', description: '用阵列理解乘法' },
            { id: 'mul_easy', name: '简单混合', emoji: '🌟', range: [1, 5], description: '1-5的乘法混合' },
            { id: 'mul_mix', name: '综合练习', emoji: '🎯', range: [1, 9], description: '九九乘法表综合' }
        ]
    },
    
    // 除法类别配置
    division: {
        name: '除法练习',
        categories: [
            { id: 'div_by_1', name: '除以1', emoji: '1️⃣', special: 'by1', description: '任何数除以1' },
            { id: 'div_by_2', name: '除以2', emoji: '2️⃣', special: 'by2', description: '除以2的练习' },
            { id: 'div_by_3', name: '除以3', emoji: '3️⃣', special: 'by3', description: '除以3的练习' },
            { id: 'div_by_4', name: '除以4', emoji: '4️⃣', special: 'by4', description: '除以4的练习' },
            { id: 'div_by_5', name: '除以5', emoji: '5️⃣', special: 'by5', description: '除以5的练习' },
            { id: 'div_by_6', name: '除以6', emoji: '6️⃣', special: 'by6', description: '除以6的练习' },
            { id: 'div_by_7', name: '除以7', emoji: '7️⃣', special: 'by7', description: '除以7的练习' },
            { id: 'div_by_8', name: '除以8', emoji: '8️⃣', special: 'by8', description: '除以8的练习' },
            { id: 'div_by_9', name: '除以9', emoji: '9️⃣', special: 'by9', description: '除以9的练习' },
            { id: 'div_by_10', name: '除以10', emoji: '🔟', special: 'by10', description: '除以10的规律' },
            { id: 'div_self', name: '自除练习', emoji: '🔄', special: 'self', description: '相同数相除' },
            { id: 'div_exact', name: '整除练习', emoji: '✅', special: 'exact', description: '能整除的除法' },
            { id: 'div_half', name: '求一半', emoji: '➗', special: 'half', description: '求数字的一半' },
            { id: 'div_table', name: '口诀表除法', emoji: '📋', special: 'table', description: '基于乘法口诀的除法' },
            { id: 'div_missing', name: '填空练习', emoji: '❓', special: 'missing', description: '?÷3=4形式' },
            { id: 'div_compare', name: '比大小', emoji: '📉', special: 'compare', description: '比较两个除法结果' },
            { id: 'div_word', name: '应用题', emoji: '📖', special: 'word', description: '简单的除法应用题' },
            { id: 'div_share', name: '平均分', emoji: '🍕', special: 'share', description: '平均分配问题' },
            { id: 'div_easy', name: '简单除法', emoji: '⭐', range: [1, 20], description: '20以内的简单除法' },
            { id: 'div_mix', name: '综合练习', emoji: '🎲', special: 'mix', description: '混合各种除法题型' }
        ]
    },
    
    // 图标配置
    icons: {
        apple: '🍎',
        star: '⭐',
        heart: '❤️',
        balloon: '🎈',
        flower: '🌸',
        sun: '☀️',
        moon: '🌙',
        rainbow: '🌈',
        candy: '🍬',
        cookie: '🍪',
        cake: '🎂',
        gift: '🎁',
        toy: '🧸',
        ball: '⚽',
        car: '🚗',
        rocket: '🚀',
        book: '📚',
        pencil: '✏️',
        smile: '😊',
        trophy: '🏆'
    },
    
    // 成就配置
    achievements: {
        firstComplete: { name: '初次完成', icon: '🌟', message: '太棒了！完成了第一次练习！' },
        allCorrect: { name: '全部正确', icon: '💯', message: '完美！全部答对了！' },
        quick: { name: '快速完成', icon: '⚡', message: '速度真快！' },
        persistent: { name: '坚持不懈', icon: '💪', message: '坚持就是胜利！' },
        improving: { name: '进步明显', icon: '📈', message: '进步很大哦！' },
        master: { name: '数学大师', icon: '👑', message: '你是数学小天才！' }
    },
    
    // 音效配置（使用文本表示音效）
    sounds: {
        correct: '✨ 叮咚！',
        wrong: '❌ 哦哦～',
        complete: '🎉 完成啦！',
        click: '🔊 哒'
    }
};
