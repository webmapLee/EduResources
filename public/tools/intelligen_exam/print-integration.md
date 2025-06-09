# 智能考试系统打印功能集成指南

要将打印功能集成到现有的智能考试系统中，请按照以下步骤操作：

## 1. 添加打印样式表

将 `print.css` 文件添加到 `css` 目录中，并在 `index.html` 中引用它：

```html
<!-- 打印样式 -->
<link href="css/print.css" rel="stylesheet" media="print">
```

## 2. 添加 Bootstrap 图标

在 `index.html` 的 head 部分添加 Bootstrap 图标：

```html
<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
```

## 3. 添加打印按钮

在试卷区域的卡片头部添加打印按钮：

```html
<div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
    <h5 class="mb-0">试卷</h5>
    <div>
        <button class="btn btn-light btn-sm me-2 print-button" id="print-exam">
            <i class="bi bi-printer"></i> 打印试卷
        </button>
        <button class="btn btn-light btn-sm" id="submit-exam">提交答案</button>
    </div>
</div>
```

## 4. 集成打印功能代码

将以下代码添加到 `app.js` 文件中：

```javascript
// 当前试卷数据变量应该已经存在
let currentExam = null;

// 在文档加载完成后初始化打印功能
$(document).ready(function() {
    // 初始化打印功能
    initPrintFunctionality();
});

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
```

## 5. 测试打印功能

1. 生成一份试卷
2. 点击"打印试卷"按钮
3. 在打印预览中检查试卷格式是否正确
4. 确认答案区域在打印预览中可见

## 注意事项

- 打印样式表 (`print.css`) 使用 `media="print"` 属性，确保样式只在打印时应用
- 答案区域在屏幕上不可见，但在打印时会显示
- 页眉只在打印时显示，包含试卷标题和学生信息填写区域