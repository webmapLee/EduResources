/**
 * 打印功能集成模块
 * 将此代码复制到app.js中，或通过<script>标签引入
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
    if (!currentExam) return;
    
    // 添加答案区域（打印时显示）
    $('.question-container').each(function() {
        const questionId = $(this).data('id');
        const question = currentExam.questions.find(q => q.id === questionId);
        
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
    
    // 添加页眉
    if ($('#print-header').length === 0) {
        $('body').prepend(`
            <div id="print-header" class="d-none d-print-block text-center mb-4">
                <h2>${currentExam.title || '智能考试系统试卷'}</h2>
                <p>姓名: _________________ 班级: _________________ 日期: _________________</p>
            </div>
        `);
    }
}

// 在文档加载完成后初始化打印功能
$(document).ready(function() {
    // 初始化打印功能
    initPrintFunctionality();
});