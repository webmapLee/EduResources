$(document).ready(function() {
    // 加载中模态框
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    
    // 当前试卷数据
    let currentExam = null;
    
    // 初始化打印功能
    initPrintFunctionality();
    
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
    
    // 其余代码保持不变...
    // 这里只是为了演示打印功能，实际应用中需要将这段代码整合到原有的app.js中
});