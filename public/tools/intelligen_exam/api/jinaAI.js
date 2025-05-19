/**
 * Jina AI API 调用模块
 * 用于与 Jina AI 服务进行通信，生成试卷和判卷
 */

// 调用 Jina AI API
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
            // 如果解析失败，直接返回原始内容
            return data.choices[0].message.content;
        }
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
}

// 生成试卷的API调用
async function generateExamWithAI(examData) {
    const prompt = buildExamPrompt(examData);
    try {
        return await callJinaAI(prompt);
    } catch (error) {
        console.error('生成试卷失败:', error);
        // 如果API调用失败，返回模拟数据
        return getMockExamData(examData);
    }
}

// 判卷的API调用
async function gradeExamWithAI(exam, userAnswers) {
    const prompt = buildGradingPrompt(exam, userAnswers);
    try {
        return await callJinaAI(prompt);
    } catch (error) {
        console.error('判卷失败:', error);
        // 如果API调用失败，返回模拟判卷结果
        return getMockGradingResult(exam, userAnswers);
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
    
    请确保返回的是有效的JSON格式，不要包含任何额外的文本说明。`;
}

// 构建判卷的提示词
function buildGradingPrompt(exam, userAnswers) {
    const questionsWithAnswers = exam.questions.map(q => {
        return {
            id: q.id,
            type: q.type,
            content: q.content,
            options: q.options || [], // 选择题的选项
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

// 获取模拟试卷数据（当API调用失败时使用）
function getMockExamData(examData) {
    // 根据科目返回不同的模拟数据
    switch(examData.subject) {
        case 'math':
            return getMockMathExam(examData);
        case 'chinese':
            return getMockChineseExam(examData);
        case 'english':
            return getMockEnglishExam(examData);
        default:
            return getMockMathExam(examData);
    }
}

// 获取模拟数学试卷
function getMockMathExam(examData) {
    const gradeMap = {
        '1': '一年级',
        '2': '二年级',
        '3': '三年级',
        '4': '四年级',
        '5': '五年级',
        '6': '六年级'
    };
    
    const difficultyMap = {
        'easy': '简单',
        'medium': '中等',
        'hard': '复杂'
    };
    
    return {
        title: `小学${gradeMap[examData.grade]}数学试卷（${difficultyMap[examData.difficulty]}）`,
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
        ].slice(0, examData.count)
    };
}

// 获取模拟语文试卷
function getMockChineseExam(examData) {
    const gradeMap = {
        '1': '一年级',
        '2': '二年级',
        '3': '三年级',
        '4': '四年级',
        '5': '五年级',
        '6': '六年级'
    };
    
    const difficultyMap = {
        'easy': '简单',
        'medium': '中等',
        'hard': '复杂'
    };
    
    return {
        title: `小学${gradeMap[examData.grade]}语文试卷（${difficultyMap[examData.difficulty]}）`,
        questions: [
            {
                id: "1",
                type: "pinyin",
                content: "请写出"春天"的拼音",
                answer: "chūn tiān",
                explanation: ""春"的拼音是chūn，"天"的拼音是tiān"
            },
            {
                id: "2",
                type: "character",
                content: "下列词语中，加点字的读音完全相同的一组是（ ）",
                options: ["鲜花 / 鲜艳", "说明 / 说服", "长城 / 长江", "落叶 / 落后"],
                answer: "说明 / 说服",
                explanation: ""说明"和"说服"中的"说"读音都是shuō"
            },
            {
                id: "3",
                type: "fill_word",
                content: "请在横线上填入合适的词语：春天来了，小草从地下（ ）出来了。",
                answer: "钻",
                explanation: ""钻"表示小草从地下往上生长的动作"
            },
            {
                id: "4",
                type: "comprehension",
                content: "阅读短文：\n小明喜欢读书。每天放学后，他都会去图书馆看书。图书馆里有许多有趣的故事书，小明最喜欢看童话故事。\n问题：小明放学后去哪里？",
                answer: "图书馆",
                explanation: "短文中提到"每天放学后，他都会去图书馆看书。""
            },
            {
                id: "5",
                type: "pinyin",
                content: "请写出"学校"的拼音",
                answer: "xué xiào",
                explanation: ""学"的拼音是xué，"校"的拼音是xiào"
            }
        ].slice(0, examData.count)
    };
}

// 获取模拟英语试卷
function getMockEnglishExam(examData) {
    const gradeMap = {
        '1': '一年级',
        '2': '二年级',
        '3': '三年级',
        '4': '四年级',
        '5': '五年级',
        '6': '六年级'
    };
    
    const difficultyMap = {
        'easy': '简单',
        'medium': '中等',
        'hard': '复杂'
    };
    
    return {
        title: `小学${gradeMap[examData.grade]}英语试卷（${difficultyMap[examData.difficulty]}）`,
        questions: [
            {
                id: "1",
                type: "vocabulary",
                content: "选择正确的单词填空：I have a ___.",
                options: ["apple", "an apple", "apples", "the apple"],
                answer: "an apple",
                explanation: "apple以元音开头，前面应该用an"
            },
            {
                id: "2",
                type: "grammar",
                content: "选择正确的句子：",
                options: ["She have a dog.", "She has a dog.", "She having a dog.", "She haves a dog."],
                answer: "She has a dog.",
                explanation: "第三人称单数she后面的动词have应该用has"
            },
            {
                id: "3",
                type: "vocabulary",
                content: "apple的中文意思是什么？",
                answer: "苹果",
                explanation: "apple是苹果的意思"
            },
            {
                id: "4",
                type: "reading",
                content: "阅读短文：\nTom is a boy. He is 8 years old. He likes to play football.\n问题：How old is Tom?",
                answer: "8 years old",
                explanation: "短文中提到"He is 8 years old.""
            },
            {
                id: "5",
                type: "grammar",
                content: "选择正确的句子：",
                options: ["I am go to school.", "I going to school.", "I go to school.", "I goes to school."],
                answer: "I go to school.",
                explanation: "第一人称I后面的动词应该用原形go"
            }
        ].slice(0, examData.count)
    };
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

// 导出模块
export { 
    generateExamWithAI, 
    gradeExamWithAI,
    questionTypes
};