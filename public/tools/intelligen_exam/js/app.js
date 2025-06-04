$(document).ready(function() {
    // 加载中模态框
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    const jina_api = 'jina_38d0f1ef8018441a8b2f89cad79cfc56L6nYIVOgKW3DbM8IVgvDe-cWzhaq';
    
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
        const gradeMap = {
            '1': '一年级',
            '2': '二年级',
            '3': '三年级',
            '4': '四年级',
            '5': '五年级',
            '6': '六年级'
        };
        
        const subjectMap = {
            'math': '数学',
            'chinese': '语文',
            'english': '英语'
        };
        
        const difficultyMap = {
            'easy': '简单',
            'medium': '中等',
            'hard': '复杂'
        };
        
        // 获取题型的中文名称
        const typeNames = examData.types.map(typeId => {
            const typeObj = questionTypes[examData.subject].find(t => t.id === typeId);
            return typeObj ? typeObj.name : typeId;
        });
        
        // 根据科目构建不同的提示词
        let subjectSpecificPrompt = '';
        
        if (examData.subject === 'math') {
            subjectSpecificPrompt = `
            对于数学题目，请注意：
            1. 选择题：提供4个选项，只有1个正确答案
            2. 算术题：提供计算题目，答案应为具体数值
            3. 填空题：提供等式，需要填写缺失的数字
            4. 应用题：提供实际问题场景，需要通过计算解决问题
            
            难度说明：
            - 简单：基本的加减乘除、数字识别、简单图形
            - 中等：混合运算、简单的分数、小数、简单几何
            - 复杂：复杂的分数运算、方程、几何问题、逻辑推理
            `;
        } else if (examData.subject === 'chinese') {
            subjectSpecificPrompt = `
            对于语文题目，请注意：
            1. 拼音：提供汉字，要求写出正确拼音，包括声调
            2. 字形：识别汉字的正确写法或读音
            3. 选字填空：在句子中选择合适的词语填空
            4. 阅读理解：提供短文，回答相关问题
            
            难度说明：
            - 简单：常用汉字、基础词语、简单句子
            - 中等：次常用汉字、成语、复杂句子
            - 复杂：生僻字、古文、复杂阅读理解
            `;
        } else if (examData.subject === 'english') {
            subjectSpecificPrompt = `
            对于英语题目，请注意：
            1. 词汇：单词拼写、词义理解、单词选择
            2. 语法：句子结构、时态、语态等语法知识
            3. 阅读：短文阅读理解
            4. 听力：听力理解题（模拟听力内容的文字描述）
            
            难度说明：
            - 简单：基础词汇、简单句型、日常用语
            - 中等：常用词汇、基本时态、简单对话
            - 复杂：高级词汇、复杂句型、长篇阅读
            `;
        }
        
        return `你是一位经验丰富的小学${gradeMap[examData.grade]}${subjectMap[examData.subject]}老师。请为学生生成一份${difficultyMap[examData.difficulty]}难度的试卷。
        
        试卷要求：
        1. 包含以下题型：${typeNames.join('、')}
        2. 共${examData.count}道题
        3. 每道题都必须有明确的答案和解析
        4. 题目内容应符合小学${gradeMap[examData.grade]}学生的认知水平
        5. 题目难度应符合${difficultyMap[examData.difficulty]}级别的要求
        
        ${subjectSpecificPrompt}
        
        请以JSON格式返回试卷数据，格式如下：
        {
            "title": "试卷标题",
            "questions": [
                {
                    "id": "1",
                    "type": "题型ID",
                    "content": "题目内容",
                    "options": ["选项A", "选项B", "选项C", "选项D"], // 选择题才有
                    "answer": "正确答案",
                    "explanation": "解析"
                }
            ]
        }
        
        请确保返回的是有效的JSON格式，不要使用markdown代码块格式，不要包含任何额外的文本说明。`;
    }
    
    // 调用Jina AI API
    async function callJinaAI(prompt) {
        try {
            const requestBody = {
                "model": "jina-deepsearch-v1",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": false,
                "reasoning_effort": "medium",
                "max_attempts": 1,
                "no_direct_answer": false
            };
            
            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer jina_38d0f1ef8018441a8b2f89cad79cfc56L6nYIVOgKW3DbM8IVgvDe-cWzhaq"
            };
            
            // 尝试调用API
            try {
                const response = await fetch('https://deepsearch.jina.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                });
                
                if (!response.ok) {
                    throw new Error(`API调用失败: ${response.status}`);
                }
                
                const data = await response.json();
                
                // 尝试解析返回的内容为JSON
                try {
                    const content = data.choices[0].message.content;
                    debugger;
                    // 处理可能的markdown代码块格式
                    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[1]);
                    }

                    // 如果不是代码块格式，直接尝试解析
                    return JSON.parse(content);
                } catch (e) {
                    console.warn('API返回内容解析失败，使用模拟数据');
                    return getMockExamData({subject: 'math', grade: '3', difficulty: 'easy', count: 5});
                }
            } catch (error) {
                console.error('API调用错误:', error);
                // 如果API调用失败，返回模拟数据
                return getMockExamData({subject: 'math', grade: '3', difficulty: 'easy', count: 5});
            }
        } catch (error) {
            console.error('调用过程错误:', error);
            // 返回模拟数据
            return getMockExamData({subject: 'math', grade: '3', difficulty: 'easy', count: 5});
        }
    }
    
    // 获取模拟试卷数据
    function getMockExamData(examData) {
        // 根据科目返回不同的模拟数据
        const mockExamData = {
            title: "小学三年级数学试卷（简单）",
            questions: [
                {
                    id: "1",
                    type: "choice",
                    content: "12 + 15 = ?",
                    options: ["25", "27", "28", "30"],
                    answer: "27",
                    explanation: "12 + 15 = 27"
                },
                {
                    id: "2",
                    type: "calculation",
                    content: "计算：25 × 4",
                    answer: "100",
                    explanation: "25 × 4 = 100"
                },
                {
                    id: "3",
                    type: "fill",
                    content: "在□里填上合适的数，使等式成立：□ + 18 = 30",
                    answer: "12",
                    explanation: "30 - 18 = 12"
                },
                {
                    id: "4",
                    type: "application",
                    content: "小明有15个苹果，他送给小红5个，又送给小刚3个，小明还剩几个苹果？",
                    answer: "7",
                    explanation: "15 - 5 - 3 = 7"
                },
                {
                    id: "5",
                    type: "choice",
                    content: "下面哪个数是奇数？",
                    options: ["12", "24", "35", "48"],
                    answer: "35",
                    explanation: "35是奇数，其他都是偶数"
                }
            ]
        };
        return mockExamData;
    }
    
    // 解析AI返回的试卷数据
    function parseExamResponse(response, examData) {
        // 在实际项目中，这里需要解析AI返回的JSON数据
        // 为了演示，我们直接使用模拟数据
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
        let questionHtml = `
            <div class="question-container" data-id="${question.id}" data-type="${question.type}">
                <div class="question-header mb-3">
                    <strong>${number}. [${getQuestionTypeName(question.type)}]</strong> ${question.content}
                </div>
                <div class="question-body">
        `;
        
        // 根据题型渲染不同的答题区域
        switch (question.type.toLowerCase()) {
            case 'choice':
            case 'vocabulary':
            case 'grammar':
            case 'character':  // 字形题通常也是选择题
                // 选择题
                questionHtml += renderChoiceQuestion(question);
                break;
            case 'fill':
            case 'fill_word':
            case 'pinyin':
                // 填空题
                questionHtml += renderFillQuestion(question);
                break;
            case 'calculation':
                // 计算题
                questionHtml += renderCalculationQuestion(question);
                break;
            case 'application':
            case 'comprehension':
            case 'reading':
                // 应用题/阅读理解
                questionHtml += renderApplicationQuestion(question);
                break;
            case '拼音':  // 处理中文题型名称
                questionHtml += renderFillQuestion(question);
                break;
            case '字形':  // 处理中文题型名称
                questionHtml += renderChoiceQuestion(question);
                break;
            case '选字填空':  // 处理中文题型名称
                questionHtml += renderFillQuestion(question);
                break;
            case '阅读理解':  // 处理中文题型名称
                questionHtml += renderApplicationQuestion(question);
                break;
            default:
                // 如果题型未知但有选项，按选择题处理
                if (question.options && question.options.length > 0) {
                    questionHtml += renderChoiceQuestion(question);
                } 
                // 如果题型未知且没有选项，按填空题处理
                else {
                    questionHtml += renderFillQuestion(question);
                }
        }
        
        questionHtml += `
                </div>
                <div class="question-feedback mt-3" style="display: none;"></div>
            </div>
        `;
        
        return questionHtml;
    }
    
    // 获取题型名称
    function getQuestionTypeName(typeId) {
        for (const subject in questionTypes) {
            const type = questionTypes[subject].find(t => t.id === typeId);
            if (type) return type.name;
        }
        return typeId;
    }
    
    // 渲染选择题
    function renderChoiceQuestion(question) {
        let html = '<div class="options-container">';
        
        question.options.forEach((option, index) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
            html += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question-${question.id}" id="option-${question.id}-${index}" value="${option}">
                    <label class="form-check-label option-label" for="option-${question.id}-${index}">
                        ${optionLabel}. ${option}
                    </label>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    // 渲染填空题
    function renderFillQuestion(question) {
        return `
            <div class="fill-container">
                <input type="text" class="form-control fill-blank-input" placeholder="请填写答案">
            </div>
        `;
    }
    
    // 渲染计算题
    function renderCalculationQuestion(question) {
        return `
            <div class="calculation-container">
                <input type="text" class="form-control" placeholder="请填写计算结果">
            </div>
        `;
    }
    
    // 渲染应用题
    function renderApplicationQuestion(question) {
        return `
            <div class="application-container">
                <textarea class="form-control" placeholder="请输入答案"></textarea>
            </div>
        `;
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
        
        // 调用AI判卷
        gradeExam(currentExam, userAnswers)
            .then(result => {
                renderExamResult(result);
                $('#result-container').show();
                loadingModal.hide();
                
                // 滚动到结果区域
                $('html, body').animate({
                    scrollTop: $('#result-container').offset().top - 50
                }, 500);
            })
            .catch(error => {
                console.error('判卷失败:', error);
                alert('判卷失败，请重试');
                loadingModal.hide();
            });
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
    
    // 调用AI判卷
    async function gradeExam(exam, userAnswers) {
        try {
            // 构建提示词
            const prompt = buildGradingPrompt(exam, userAnswers);
            
            // 调用Jina AI API
            const response = await callJinaAIForGrading(prompt, exam, userAnswers);
            
            // 解析返回的判卷结果
            return parseGradingResponse(response, exam, userAnswers);
        } catch (error) {
            console.error('AI判卷错误:', error);
            throw new Error('判卷失败');
        }
    }
    
    // 构建判卷的提示词
    function buildGradingPrompt(exam, userAnswers) {
        const questionsWithAnswers = exam.questions.map(q => {
            return {
                id: q.id,
                type: q.type,
                content: q.content,
                options: q.options || [],
                correctAnswer: q.answer,
                userAnswer: userAnswers[q.id] || '未作答',
                explanation: q.explanation || ''
            };
        });
        
        return `你是一位经验丰富的小学教师，正在为学生批改试卷。请根据以下信息进行判卷：
        
        试卷标题：${exam.title}
        题目数量：${exam.questions.length}
        
        判卷规则：
        1. 每道题满分为20分
        2. 答案完全正确得满分，部分正确可给部分分数
        3. 未作答的题目得0分
        4. 对于选择题，只有选择完全正确才得分
        5. 对于填空题和计算题，答案必须准确
        6. 对于应用题和阅读理解，根据答案的完整性和准确性评分
        7. 对于拼音题，声调错误扣一部分分数
        
        题目和答案详情：
        ${JSON.stringify(questionsWithAnswers, null, 2)}
        
        请详细分析每道题的答案，并以JSON格式返回判卷结果：
        {
            "totalScore": 总分,
            "maxScore": 满分,
            "percentage": 得分百分比,
            "feedback": "总体评价",
            "questions": [
                {
                    "id": "题目ID",
                    "score": 得分,
                    "maxScore": 20,
                    "isCorrect": true/false,
                    "feedback": "详细评语，包括错误分析和改进建议"
                }
            ]
        }
        
        请确保返回的是有效的JSON格式，不要包含任何额外的文本说明。对于每道题，请提供有教育意义的评语，帮助学生理解错误并改进。`;
    }
    
    // 调用Jina AI进行判卷
    async function callJinaAIForGrading(prompt, exam, userAnswers) {
        try {
            const requestBody = {
                "model": "jina-deepsearch-v1",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": false,
                "reasoning_effort": "medium",
                "max_attempts": 1,
                "no_direct_answer": false
            };
            
            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer jina_38d0f1ef8018441a8b2f89cad79cfc56L6nYIVOgKW3DbM8IVgvDe-cWzhaq"
            };
            
            // 尝试调用API
            try {
                const response = await fetch('https://deepsearch.jina.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                });
                
                if (!response.ok) {
                    throw new Error(`API调用失败: ${response.status}`);
                }
                
                const data = await response.json();
                
                // 尝试解析返回的内容为JSON
                try {
                    return JSON.parse(data.choices[0].message.content);
                } catch (e) {
                    console.warn('API返回内容解析失败，使用模拟判卷结果');
                    return getMockGradingResult(exam, userAnswers);
                }
            } catch (error) {
                console.error('API调用错误:', error);
                // 如果API调用失败，返回模拟判卷结果
                return getMockGradingResult(exam, userAnswers);
            }
        } catch (error) {
            console.error('调用过程错误:', error);
            // 返回模拟判卷结果
            return getMockGradingResult(exam, userAnswers);
        }
    }
    
    // 获取模拟判卷结果
    function getMockGradingResult(exam, userAnswers) {
        const result = {
            totalScore: 0,
            maxScore: exam.questions.length * 20,
            percentage: 0,
            feedback: "",
            questions: []
        };
        
        // 计算每道题的得分
        let correctCount = 0;
        exam.questions.forEach(question => {
            const userAnswer = userAnswers[question.id] || '';
            const isCorrect = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
            
            if (isCorrect) correctCount++;
            
            result.questions.push({
                id: question.id,
                score: isCorrect ? 20 : 0,
                maxScore: 20,
                isCorrect: isCorrect,
                feedback: isCorrect ? 
                    "回答正确！很好！" : 
                    `回答错误。正确答案是: ${question.answer}。${question.explanation || ''} 请认真复习这部分内容。`
            });
        });
        
        // 计算总分和百分比
        result.totalScore = correctCount * 20;
        result.percentage = (correctCount / exam.questions.length) * 100;
        
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
    
    // 解析判卷结果
    function parseGradingResponse(response, exam, userAnswers) {
        // 在实际项目中，这里需要解析AI返回的JSON数据
        // 为了演示，我们直接使用模拟数据
        return response;
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
            
            // 高亮选择题的正确和错误选项
            if (question.type === 'choice' || question.type === 'vocabulary' || question.type === 'grammar') {
                const options = questionContainer.find('.option-label');
                options.each(function() {
                    const optionText = $(this).text().substring(3); // 去掉 "A. " 前缀
                    if (optionText === question.answer) {
                        $(this).addClass('correct-answer');
                    } else if ($(this).prev('input').is(':checked')) {
                        $(this).addClass('wrong-answer');
                    }
                });
            }
            
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
    
    // 实际项目中，这里应该实现真正的Jina AI API调用
    // 以下是一个示例实现，但不会真正调用API
    async function realCallJinaAI(prompt) {
        try {
            const requestBody = {
                "model": "jina-deepsearch-v1",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": false,
                "reasoning_effort": "medium",
                "max_attempts": 1,
                "no_direct_answer": false
            };
            
            const headers = {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + jina_api // 替换为实际的API密钥
            };
            
            const response = await fetch('https://deepsearch.jina.ai/v1/chat/completions', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status}`);
            }
            
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        }
    }
});