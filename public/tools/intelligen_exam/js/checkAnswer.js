/**
 * 答案检查模块
 * 用于检查用户答案是否正确
 */

// 检查用户答案是否正确
function checkAnswer(question, userAnswer) {
    if (!userAnswer) return false;
    
    // 对拼音题进行特殊处理
    if (question.type === 'pinyin' || 
        (question.content && question.content.includes('拼音'))) {
        // 移除声调，只比较拼写
        const normalizeAnswer = (ans) => ans.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, match => {
            const base = 'aeiouv'['āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ'.indexOf(match) % 4];
            return base || match;
        }).replace(/\s+/g, ''); // 移除空格
        
        const normalizedUser = normalizeAnswer(userAnswer.trim().toLowerCase());
        const normalizedCorrect = normalizeAnswer(question.answer.trim().toLowerCase());
        return normalizedUser === normalizedCorrect;
    } 
    // 对语文和英语题目更宽松的比较
    else if (question.type === 'fill_word' || 
             question.type === 'vocabulary' || 
             question.type === 'reading' || 
             question.type === 'comprehension') {
        // 移除多余空格，不区分大小写
        const cleanAnswer = (ans) => ans.trim().toLowerCase().replace(/\s+/g, ' ');
        return cleanAnswer(userAnswer) === cleanAnswer(question.answer);
    }
    // 根据题目类型进行不同的判断
    else {
        switch (question.type) {
            case '选择题':
            case 'choice':
            case 'grammar':
            case 'character':
                return userAnswer.trim() === question.answer.trim();
            case '填空题':
            case 'fill':
            case '计算题':
            case 'calculation':
                return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
            case '应用题':
            case 'application':
                // 这里可以实现更复杂的判断逻辑，例如关键词匹配
                return userAnswer.trim().toLowerCase().includes(question.answer.trim().toLowerCase());
            default:
                return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
        }
    }
}

// 导出模块
export { checkAnswer };