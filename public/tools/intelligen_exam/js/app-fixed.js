$(document).ready(function() {
    // 导入本地判卷模块
    import('./localGrading.js').then(module => {
        const { gradeExamLocally } = module;
        
        // 加载中模态框
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        
        // 科目对应的题型
        const questionTypes = {
            math: [
                { id: 'choice', name: '选择题' },
                { id: 'calculation', name: '算术题' },
                { id: 'fill', name: '填空题' },
                { id: 'application', name: '应用题' }
            ],
            chinese: [
                { id: 'pinyin', name: '拼音' },
                { id: 'character', name: '字形' },
                { id: 'fill_word', name: '选字填空' },
                { id: 'comprehension', name: '阅读理解' }
            ],
            english: [
                { id: 'vocabulary', name: '词汇' },
                { id: 'grammar', name: '语法' },
                { id: 'reading', name: '阅读' },
                { id: 'listening', name: '听力' }
            ]
        };

        // 当前试卷数据
        let currentExam = null;
        
        // 监听科目选择变化，动态更新题型选项
        $('#subject').change(function() {
            const subject = $(this).val();
            updateQuestionTypes(subject);
        });
        
        // 更新题型选项
        function updateQuestionTypes(subject) {
            const typesContainer = $('#question-types');
            typesContainer.empty();
            
            if (!subject) return;
            
            questionTypes[subject].forEach(type => {
                const typeHtml = `
                    <div class="col-md-3 mb-2">
                        <div class="form-check">
                            <input class="form-check-input question-type" type="checkbox" value="${type.id}" id="type-${type.id}">
                            <label class="form-check-label" for="type-${type.id}">
                                ${type.name}
                            </label>
                        </div>
                    </div>
                `;
                typesContainer.append(typeHtml);
            });
        }
        
        // 提交表单生成试卷
        $('#exam-form').submit(function(e) {
            e.preventDefault();
            
            // 获取选中的题型
            const selectedTypes = [];
            $('.question-type:checked').each(function() {
                selectedTypes.push($(this).val());
            });
            
            if (selectedTypes.length === 0) {
                alert('请至少选择一种题型');
                return;
            }
            
            // 收集表单数据
            const examData = {
                grade: $('#grade').val(),
                subject: $('#subject').val(),
                difficulty: $('#difficulty').val(),
                count: $('#count').val(),
                types: selectedTypes
            };
            
            // 显示加载中
            $('#loading-message').text('正在生成试卷，请稍候...');
            loadingModal.show();
            
            // 调用AI生成试卷
            generateExam(examData)
                .then(examData => {
                    currentExam = examData;
                    renderExam(examData);
                    $('#exam-paper-container').show();
                    loadingModal.hide();
                })
                .catch(error => {
                    console.error('生成试卷失败:', error);
                    alert('生成试卷失败，请重试');
                    loadingModal.hide();
                });
        });
        
        // 调用AI生成试卷
        async function generateExam(examData) {
            try {
                // 构建提示词
                const prompt = buildExamPrompt(examData);
                
                // 调用Jina AI API
                const response = await callJinaAI(prompt);
                
                // 解析返回的JSON数据
                return parseExamResponse(response, examData);
            } catch (error) {
                console.error('AI调用错误:', error);
                throw new Error('生成试卷失败');
            }
        }
        
        // 构建生成试卷的提示词
        function buildExamPrompt(examData) {
            // 原有的提示词构建逻辑...
            return "提示词";
        }
        
        // 调用Jina AI API
        async function callJinaAI(prompt) {
            // 原有的API调用逻辑...
            return {};
        }
        
        // 解析AI返回的试卷数据
        function parseExamResponse(response, examData) {
            // 原有的解析逻辑...
            return response;
        }
        
        // 渲染试卷
        function renderExam(examData) {
            const examContainer = $('#exam-paper');
            examContainer.empty();
            
            // 添加试卷标题
            examContainer.append(`<h3 class="text-center mb-4">${examData.title}</h3>`);
            
            // 渲染每道题目
            examData.questions.forEach((question, index) => {
                const questionHtml = renderQuestion(question, index + 1);
                examContainer.append(questionHtml);
            });
        }
        
        // 渲染单个题目
        function renderQuestion(question, number) {
            // 原有的题目渲染逻辑...
            return "";
        }
        
        // 提交答案
        $('#submit-exam').click(function() {
            if (!currentExam) {
                alert('请先生成试卷');
                return;
            }
            
            // 收集用户答案
            const userAnswers = collectUserAnswers();
            
            // 显示加载中
            $('#loading-message').text('正在判卷，请稍候...');
            loadingModal.show();
            
            // 使用本地判卷逻辑
            try {
                const result = gradeExamLocally(currentExam, userAnswers);
                renderExamResult(result);
                $('#result-container').show();
                loadingModal.hide();
                
                // 滚动到结果区域
                $('html, body').animate({
                    scrollTop: $('#result-container').offset().top - 50
                }, 500);
            } catch (error) {
                console.error('判卷失败:', error);
                alert('判卷失败，请重试');
                loadingModal.hide();
            }
        });
        
        // 收集用户答案
        function collectUserAnswers() {
            const answers = {};
            
            $('.question-container').each(function() {
                const questionId = $(this).data('id');
                const questionType = $(this).data('type');
                let answer = '';
                
                switch (questionType) {
                    case 'choice':
                    case 'vocabulary':
                    case 'grammar':
                        // 选择题
                        answer = $(this).find('input[type="radio"]:checked').val() || '';
                        break;
                    case 'fill':
                    case 'fill_word':
                    case 'pinyin':
                    case 'character':
                    case 'calculation':
                        // 填空题和计算题
                        answer = $(this).find('input[type="text"]').val() || '';
                        break;
                    case 'application':
                    case 'comprehension':
                    case 'reading':
                        // 应用题/阅读理解
                        answer = $(this).find('textarea').val() || '';
                        break;
                }
                
                answers[questionId] = answer;
            });
            
            return answers;
        }
        
        // 渲染判卷结果
        function renderExamResult(result) {
            const resultContainer = $('#exam-result');
            resultContainer.empty();
            
            // 添加总分和评价
            resultContainer.append(`
                <div class="score-display mb-4">
                    得分: ${result.totalScore}/${result.maxScore} (${result.percentage.toFixed(1)}%)
                </div>
                <div class="alert alert-info mb-4">
                    <strong>总体评价:</strong> ${result.feedback}
                </div>
                <h5 class="mb-3">详细评分:</h5>
            `);
            
            // 显示每道题的评分
            result.questions.forEach((questionResult, index) => {
                const question = currentExam.questions.find(q => q.id === questionResult.id);
                if (!question) return;
                
                const questionContainer = $(`.question-container[data-id="${question.id}"]`);
                const feedbackContainer = questionContainer.find('.question-feedback');
                
                // 更新题目的样式
                if (questionResult.isCorrect) {
                    questionContainer.addClass('border-success');
                } else {
                    questionContainer.addClass('border-danger');
                }
                
                // 显示题目的评分和反馈
                feedbackContainer.html(`
                    <div class="alert ${questionResult.isCorrect ? 'alert-success' : 'alert-danger'}">
                        <strong>${questionResult.isCorrect ? '✓ 正确' : '✗ 错误'}</strong> - 
                        得分: ${questionResult.score}/${questionResult.maxScore}
                        <div class="mt-2">${questionResult.feedback}</div>
                    </div>
                `).show();
                
                // 在结果区域添加题目评分摘要
                resultContainer.append(`
                    <div class="feedback-item ${questionResult.isCorrect ? 'border-success' : 'border-danger'}">
                        <div class="d-flex justify-content-between">
                            <div><strong>题目 ${index + 1}:</strong> ${question.content.substring(0, 50)}${question.content.length > 50 ? '...' : ''}</div>
                            <div>${questionResult.score}/${questionResult.maxScore}</div>
                        </div>
                    </div>
                `);
            });
        }
    }).catch(error => {
        console.error('模块加载失败:', error);
    });
});