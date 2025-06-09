/**
 * 答案检查模块
 * 用于检查用户答案是否正确，特别处理语文和英语题目
 */

// 检查用户答案是否正确
function checkAnswer(question, userAnswer, examTitle) {
    if (!userAnswer) return false;
    
    // 对拼音题进行特殊处理
    if (question.type === 'pinyin' || 
        (question.content && question.content.includes('拼音'))) {
        return checkPinyinAnswer(question.answer, userAnswer);
    } 
    // 对语文题目进行特殊处理
    else if (examTitle && examTitle.includes('语文')) {
        return checkChineseAnswer(question, userAnswer);
    }
    // 对英语题目进行特殊处理
    else if (examTitle && examTitle.includes('英语')) {
        return checkEnglishAnswer(question, userAnswer);
    }
    // 默认比较
    else {
        return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    }
}

// 检查拼音答案
function checkPinyinAnswer(correctAnswer, userAnswer) {
    // 移除声调，只比较拼写
    const normalizeAnswer = (ans) => ans.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, match => {
        // 将带声调的字母转换为基本字母
        const vowels = 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';
        const bases = 'aaaaeeeeiiiioooouuuuvvvv';
        const index = vowels.indexOf(match);
        return index >= 0 ? bases[index] : match;
    }).replace(/\s+/g, '').toLowerCase(); // 移除空格并转小写
    
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    return normalizedUser === normalizedCorrect;
}

// 检查语文答案
function checkChineseAnswer(question, userAnswer) {
    // 根据题型进行不同处理
    switch (question.type) {
        case 'character':
            // 字形题通常是选择题
            return userAnswer.trim() === question.answer.trim();
        case 'fill_word':
            // 选字填空，宽松比较
            return userAnswer.trim() === question.answer.trim();
        case 'comprehension':
            // 阅读理解，检查关键词
            const cleanAnswer = (ans) => ans.trim().replace(/[，。！？、；：""''（）【】《》]/g, '');
            return cleanAnswer(userAnswer).includes(cleanAnswer(question.answer));
        default:
            // 默认宽松比较
            return userAnswer.trim() === question.answer.trim();
    }
}

// 检查英语答案
function checkEnglishAnswer(question, userAnswer) {
    // 根据题型进行不同处理
    switch (question.type) {
        case 'vocabulary':
        case 'grammar':
            // 词汇和语法题，精确比较但不区分大小写
            return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
        case 'reading':
            // 阅读题，宽松比较
            const cleanAnswer = (ans) => ans.trim().toLowerCase().replace(/[.,!?;:'"()\\[\\]{}]/g, '');
            return cleanAnswer(userAnswer).includes(cleanAnswer(question.answer));
        default:
            // 默认宽松比较
            return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    }
}

// 导出函数
export { checkAnswer };