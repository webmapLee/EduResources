/**
 * 判卷模块
 * 用于本地判卷，避免依赖AI判卷
 */

import { checkAnswer } from './checkAnswer.js';

// 本地判卷函数
function gradeExamLocally(exam, userAnswers) {
    // 计算每道题的分值，确保满分为100分
    const scorePerQuestion = Math.round(100 / exam.questions.length);
    const lastQuestionScore = 100 - (scorePerQuestion * (exam.questions.length - 1));
    
    const result = {
        totalScore: 0,
        maxScore: 100,
        percentage: 0,
        feedback: "",
        questions: []
    };
    
    // 计算每道题的得分
    let correctCount = 0;
    exam.questions.forEach((question, index) => {
        const userAnswer = userAnswers[question.id] || '';
        const isCorrect = checkAnswer(question, userAnswer);
        
        if (isCorrect) correctCount++;
        
        // 最后一道题使用调整后的分值，确保总分为100
        const questionScore = (index === exam.questions.length - 1) ? lastQuestionScore : scorePerQuestion;
        
        result.questions.push({
            id: question.id,
            score: isCorrect ? questionScore : 0,
            maxScore: questionScore,
            isCorrect: isCorrect,
            feedback: isCorrect ? 
                "回答正确！很好！" : 
                `回答错误。正确答案是: ${question.answer}。${question.explanation || ''} 请认真复习这部分内容。`
        });
    });
    
    // 计算总分和百分比
    result.totalScore = result.questions.reduce((sum, q) => sum + q.score, 0);
    result.percentage = result.totalScore;
    
    // 生成总体评价
    if (result.percentage >= 90) {
        result.feedback = "非常优秀！你对知识点掌握得很好！继续保持这样的学习态度。";
    } else if (result.percentage >= 70) {
        result.feedback = "做得不错！还有一些小问题需要注意。建议复习一下错题，巩固相关知识点。";
    } else if (result.percentage >= 60) {
        result.feedback = "及格了，但还需要更多练习来巩固知识点。建议多做一些类似的题目，加强理解。";
    } else {
        result.feedback = "需要更多练习，建议重新复习相关知识点。可以请教老师或同学，解决你的疑惑。";
    }
    
    return result;
}

// 导出模块
export { gradeExamLocally };