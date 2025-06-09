/**
 * 试卷打印模块
 * 处理试卷打印相关功能
 */

// 准备试卷打印
function preparePrintExam(exam) {
    // 添加答案区域（打印时显示）
    $('.question-container').each(function() {
        const questionId = $(this).data('id');
        const question = exam.questions.find(q => q.id === questionId);
        
        if (question) {
            // 如果已经有答案区域，先移除
            $(this).find('.print-answer').remove();
            
            // 创建答案区域
            const answerHtml = `
                <div class="print-answer" style="display: none;">
                    <strong>答案:</strong> ${question.answer}
                    ${question.explanation ? `<br><strong>解析:</strong> ${question.explanation}` : ''}
                </div>
            `;
            
            $(this).append(answerHtml);
        }
    });
}

// 打印试卷
function printExam() {
    window.print();
}

// 导出函数
export { preparePrintExam, printExam };