/**
 * 试卷打印处理模块
 */

// 初始化打印功能
function initPrintFunctionality() {
    // 添加打印按钮点击事件
    $('#print-exam').on('click', function() {
        preparePrintExam();
        window.print();
    });
}

// 准备打印试卷
function preparePrintExam() {
    // 获取当前试卷数据
    const examTitle = $('#exam-paper h3').text();
    
    // 添加答案区域（打印时显示）
    $('.question-container').each(function() {
        // 如果已经有答案区域，先移除
        $(this).find('.print-answer').remove();
        
        // 获取题目信息
        const questionContent = $(this).find('.question-header').text();
        const questionType = $(this).data('type');
        
        // 获取答案（如果有解析区域）
        let answer = '';
        const feedbackContainer = $(this).find('.question-feedback');
        if (feedbackContainer.length > 0 && feedbackContainer.is(':visible')) {
            const feedbackText = feedbackContainer.text();
            // 尝试提取答案
            const answerMatch = feedbackText.match(/正确答案是:\s*([^。]+)/);
            if (answerMatch && answerMatch[1]) {
                answer = answerMatch[1].trim();
            }
        }
        
        // 创建答案区域
        if (answer) {
            const answerHtml = `
                <div class="print-answer" style="display: none;">
                    <strong>答案:</strong> ${answer}
                </div>
            `;
            
            $(this).append(answerHtml);
        }
    });
    
    // 添加页眉
    if ($('#print-header').length === 0) {
        $('body').prepend(`
            <div id="print-header" class="d-none d-print-block text-center mb-4">
                <h2>${examTitle || '智能考试系统试卷'}</h2>
                <p>姓名: _________________ 班级: _________________ 日期: _________________</p>
            </div>
        `);
    }
}

// 导出函数
export { initPrintFunctionality };