/**
 * 打印功能修复脚本
 * 将此脚本添加到页面中以修复打印功能
 */

// 等待文档加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('打印修复脚本已加载');
    
    // 获取打印按钮
    const printButton = document.getElementById('print-exam');
    
    // 如果找到打印按钮，添加点击事件
    if (printButton) {
        console.log('找到打印按钮，添加事件监听器');
        
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('打印按钮被点击');
            
            // 准备打印
            preparePrintExam();
            
            // 调用浏览器打印功能
            setTimeout(function() {
                window.print();
            }, 300);
        });
    } else {
        console.error('未找到打印按钮');
    }
});

// 准备打印试卷
function preparePrintExam() {
    console.log('准备打印试卷');
    
    // 获取当前试卷数据
    const examTitle = document.querySelector('#exam-paper h3')?.textContent || '智能考试系统试卷';
    
    // 添加答案区域（打印时显示）
    document.querySelectorAll('.question-container').forEach(function(container) {
        // 获取题目信息
        const questionHeader = container.querySelector('.question-header');
        const questionContent = questionHeader ? questionHeader.textContent : '';
        
        // 如果已经有答案区域，先移除
        const existingAnswer = container.querySelector('.print-answer');
        if (existingAnswer) {
            existingAnswer.remove();
        }
        
        // 创建答案区域（这里只是创建一个空白区域，因为我们可能无法直接获取答案）
        const answerHtml = `
            <div class="print-answer" style="display: none;">
                <strong>答案区域:</strong> _______________________________
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', answerHtml);
    });
    
    // 添加页眉
    if (!document.getElementById('print-header')) {
        const headerHtml = `
            <div id="print-header" class="d-none d-print-block text-center mb-4">
                <h2>${examTitle}</h2>
                <p>姓名: _________________ 班级: _________________ 日期: _________________</p>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }
    
    console.log('打印准备完成');
}