/**
 * 数学迷宫 - 问题管理模块
 * 负责加载、保存和管理各年级的数学问题
 */

class QuestionManager {
    constructor() {
        this.questions = {
            grade1: [],
            grade2: [],
            grade3: [],
            grade4: [],
            grade5: [],
            grade6: [],
            custom: []
        };
        this.wrongQuestions = [];
        this.loadQuestions();
    }

    /**
     * 加载所有年级的问题
     */
    async loadQuestions() {
        try {
            // 加载各年级的默认问题
            for (let i = 1; i <= 6; i++) {
                const response = await fetch(`data/grade${i}/questions.json`);
                if (response.ok) {
                    const data = await response.json();
                    this.questions[`grade${i}`] = data;
                } else {
                    console.log(`未找到年级 ${i} 的问题，使用默认问题`);
                    this.questions[`grade${i}`] = this.generateDefaultQuestions(i);
                }
            }

            // 加载自定义问题
            const customResponse = await fetch('data/custom/questions.json');
            if (customResponse.ok) {
                const customData = await customResponse.json();
                this.questions.custom = customData;
            }

            // 加载错题本
            const wrongResponse = await fetch('data/wrong_questions.json');
            if (wrongResponse.ok) {
                const wrongData = await wrongResponse.json();
                this.wrongQuestions = wrongData;
            }

            console.log('所有问题加载完成');
        } catch (error) {
            console.error('加载问题时出错:', error);
            // 如果加载失败，生成默认问题
            for (let i = 1; i <= 6; i++) {
                this.questions[`grade${i}`] = this.generateDefaultQuestions(i);
            }
        }
    }

    /**
     * 为指定年级生成默认问题
     * @param {number} grade - 年级 (1-6)
     * @returns {Array} - 默认问题数组
     */
    generateDefaultQuestions(grade) {
        const questions = [];
        const count = 100; // 每个年级100个问题

        switch (grade) {
            case 1:
                // 1年级：简单加减法 (0-20)
                for (let i = 0; i < count; i++) {
                    const isAddition = Math.random() > 0.5;
                    let a, b, answer, question;
                    
                    if (isAddition) {
                        a = Math.floor(Math.random() * 10) + 1;
                        b = Math.floor(Math.random() * 10) + 1;
                        answer = a + b;
                        question = `${a} + ${b} = ?`;
                    } else {
                        a = Math.floor(Math.random() * 10) + 10;
                        b = Math.floor(Math.random() * 10) + 1;
                        answer = a - b;
                        question = `${a} - ${b} = ?`;
                    }
                    
                    questions.push({
                        id: `g1_${i + 1}`,
                        question,
                        answer,
                        difficulty: 'easy'
                    });
                }
                break;
                
            case 2:
                // 2年级：加减法 (0-100) 和简单乘法表
                for (let i = 0; i < count; i++) {
                    const type = Math.random();
                    let a, b, answer, question;
                    
                    if (type < 0.4) { // 加法
                        a = Math.floor(Math.random() * 50) + 1;
                        b = Math.floor(Math.random() * 50) + 1;
                        answer = a + b;
                        question = `${a} + ${b} = ?`;
                    } else if (type < 0.8) { // 减法
                        a = Math.floor(Math.random() * 50) + 50;
                        b = Math.floor(Math.random() * 50) + 1;
                        answer = a - b;
                        question = `${a} - ${b} = ?`;
                    } else { // 简单乘法
                        a = Math.floor(Math.random() * 5) + 1;
                        b = Math.floor(Math.random() * 5) + 1;
                        answer = a * b;
                        question = `${a} × ${b} = ?`;
                    }
                    
                    questions.push({
                        id: `g2_${i + 1}`,
                        question,
                        answer,
                        difficulty: 'easy'
                    });
                }
                break;
                
            case 3:
                // 3年级：乘法和简单除法
                for (let i = 0; i < count; i++) {
                    const type = Math.random();
                    let a, b, answer, question;
                    
                    if (type < 0.5) { // 乘法
                        a = Math.floor(Math.random() * 10) + 1;
                        b = Math.floor(Math.random() * 10) + 1;
                        answer = a * b;
                        question = `${a} × ${b} = ?`;
                    } else { // 除法
                        b = Math.floor(Math.random() * 9) + 1;
                        a = b * (Math.floor(Math.random() * 10) + 1);
                        answer = a / b;
                        question = `${a} ÷ ${b} = ?`;
                    }
                    
                    questions.push({
                        id: `g3_${i + 1}`,
                        question,
                        answer,
                        difficulty: i < 50 ? 'easy' : 'medium'
                    });
                }
                break;
                
            case 4:
                // 4年级：分数和小数
                for (let i = 0; i < count; i++) {
                    const type = Math.random();
                    let question, answer;
                    
                    if (type < 0.3) { // 乘除混合
                        const a = Math.floor(Math.random() * 20) + 5;
                        const b = Math.floor(Math.random() * 10) + 2;
                        const c = Math.floor(Math.random() * 5) + 2;
                        answer = (a * b) / c;
                        question = `(${a} × ${b}) ÷ ${c} = ?`;
                    } else if (type < 0.6) { // 小数加减
                        const a = Math.floor(Math.random() * 100) / 10;
                        const b = Math.floor(Math.random() * 100) / 10;
                        answer = Math.round((a + b) * 10) / 10;
                        question = `${a.toFixed(1)} + ${b.toFixed(1)} = ?`;
                    } else { // 分数
                        const denominator = Math.floor(Math.random() * 8) + 2;
                        const numerator1 = Math.floor(Math.random() * denominator) + 1;
                        const numerator2 = Math.floor(Math.random() * denominator) + 1;
                        answer = numerator1 + numerator2 > denominator ? 1 : 0;
                        question = `${numerator1}/${denominator} + ${numerator2}/${denominator} 是否大于1？(是=1, 否=0)`;
                    }
                    
                    questions.push({
                        id: `g4_${i + 1}`,
                        question,
                        answer,
                        difficulty: i < 40 ? 'medium' : 'hard'
                    });
                }
                break;
                
            case 5:
                // 5年级：分数运算和简单方程
                for (let i = 0; i < count; i++) {
                    const type = Math.random();
                    let question, answer;
                    
                    if (type < 0.4) { // 分数运算
                        const denominator1 = Math.floor(Math.random() * 8) + 2;
                        const denominator2 = Math.floor(Math.random() * 8) + 2;
                        const numerator1 = Math.floor(Math.random() * denominator1) + 1;
                        const numerator2 = Math.floor(Math.random() * denominator2) + 1;
                        
                        // 简化为整数答案
                        const lcm = this.lcm(denominator1, denominator2);
                        const sum = (numerator1 * (lcm / denominator1)) + (numerator2 * (lcm / denominator2));
                        answer = Math.floor(sum / lcm);
                        
                        question = `${numerator1}/${denominator1} + ${numerator2}/${denominator2} 的整数部分是多少？`;
                    } else if (type < 0.7) { // 简单方程
                        const a = Math.floor(Math.random() * 10) + 1;
                        const b = Math.floor(Math.random() * 50) + 10;
                        answer = b / a;
                        question = `解方程: ${a}x = ${b}, x = ?`;
                    } else { // 百分比
                        const whole = Math.floor(Math.random() * 100) + 50;
                        const percent = Math.floor(Math.random() * 50) + 10;
                        answer = Math.floor(whole * percent / 100);
                        question = `${whole} 的 ${percent}% 是多少？`;
                    }
                    
                    questions.push({
                        id: `g5_${i + 1}`,
                        question,
                        answer,
                        difficulty: i < 30 ? 'medium' : 'hard'
                    });
                }
                break;
                
            case 6:
                // 6年级：复杂方程和应用题
                for (let i = 0; i < count; i++) {
                    const type = Math.random();
                    let question, answer;
                    
                    if (type < 0.3) { // 复杂方程
                        const a = Math.floor(Math.random() * 5) + 2;
                        const b = Math.floor(Math.random() * 20) + 5;
                        const c = Math.floor(Math.random() * 50) + 20;
                        answer = (c - b) / a;
                        question = `解方程: ${a}x + ${b} = ${c}, x = ?`;
                    } else if (type < 0.6) { // 面积计算
                        const length = Math.floor(Math.random() * 10) + 5;
                        const width = Math.floor(Math.random() * 10) + 5;
                        answer = length * width;
                        question = `长方形的长为 ${length} 米，宽为 ${width} 米，面积是多少平方米？`;
                    } else if (type < 0.8) { // 速度问题
                        const speed = Math.floor(Math.random() * 30) + 20;
                        const time = Math.floor(Math.random() * 5) + 1;
                        answer = speed * time;
                        question = `一辆车以 ${speed} 千米/小时的速度行驶了 ${time} 小时，行驶了多少千米？`;
                    } else { // 比例问题
                        const total = Math.floor(Math.random() * 100) + 50;
                        const ratio1 = Math.floor(Math.random() * 5) + 1;
                        const ratio2 = Math.floor(Math.random() * 5) + 1;
                        const sum = ratio1 + ratio2;
                        answer = Math.floor(total * ratio1 / sum);
                        question = `${total} 按 ${ratio1}:${ratio2} 分配，第一部分是多少？`;
                    }
                    
                    questions.push({
                        id: `g6_${i + 1}`,
                        question,
                        answer,
                        difficulty: 'hard'
                    });
                }
                break;
        }

        return questions;
    }

    /**
     * 计算最小公倍数
     */
    lcm(a, b) {
        return (a * b) / this.gcd(a, b);
    }

    /**
     * 计算最大公约数
     */
    gcd(a, b) {
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    /**
     * 获取指定年级的问题
     * @param {number} grade - 年级 (1-6)
     * @param {number} count - 需要的问题数量
     * @param {string} difficulty - 难度 (easy, medium, hard)
     * @returns {Array} - 问题数组
     */
    getQuestions(grade, count = 10, difficulty = null) {
        const gradeKey = `grade${grade}`;
        let availableQuestions = [...this.questions[gradeKey]];
        
        // 如果指定了难度，过滤问题
        if (difficulty) {
            availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
        }
        
        // 随机选择问题
        const selectedQuestions = [];
        const totalQuestions = Math.min(count, availableQuestions.length);
        
        for (let i = 0; i < totalQuestions; i++) {
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            selectedQuestions.push(availableQuestions[randomIndex]);
            availableQuestions.splice(randomIndex, 1);
        }
        
        return selectedQuestions;
    }

    /**
     * 添加问题到指定年级
     * @param {number|string} grade - 年级 (1-6 或 'custom')
     * @param {Object} question - 问题对象
     */
    addQuestion(grade, question) {
        const gradeKey = typeof grade === 'number' ? `grade${grade}` : grade;
        
        // 生成唯一ID
        const id = `${gradeKey}_${Date.now()}`;
        question.id = id;
        
        this.questions[gradeKey].push(question);
        this.saveQuestions(gradeKey);
        
        return id;
    }

    /**
     * 删除问题
     * @param {number|string} grade - 年级 (1-6 或 'custom')
     * @param {string} questionId - 问题ID
     */
    removeQuestion(grade, questionId) {
        const gradeKey = typeof grade === 'number' ? `grade${grade}` : grade;
        
        const index = this.questions[gradeKey].findIndex(q => q.id === questionId);
        if (index !== -1) {
            this.questions[gradeKey].splice(index, 1);
            this.saveQuestions(gradeKey);
            return true;
        }
        return false;
    }

    /**
     * 添加错题
     * @param {Object} question - 问题对象
     * @param {string} userAnswer - 用户的错误答案
     */
    addWrongQuestion(question, userAnswer) {
        // 检查是否已经在错题本中
        const existingIndex = this.wrongQuestions.findIndex(q => q.id === question.id);
        
        if (existingIndex !== -1) {
            // 更新错误次数
            this.wrongQuestions[existingIndex].wrongCount = 
                (this.wrongQuestions[existingIndex].wrongCount || 0) + 1;
            this.wrongQuestions[existingIndex].lastWrongAnswer = userAnswer;
            this.wrongQuestions[existingIndex].lastWrongDate = new Date().toISOString();
        } else {
            // 添加新错题
            this.wrongQuestions.push({
                ...question,
                wrongCount: 1,
                lastWrongAnswer: userAnswer,
                lastWrongDate: new Date().toISOString()
            });
        }
        
        this.saveWrongQuestions();
    }

    /**
     * 从错题本中移除问题
     * @param {string} questionId - 问题ID
     */
    removeWrongQuestion(questionId) {
        const index = this.wrongQuestions.findIndex(q => q.id === questionId);
        if (index !== -1) {
            this.wrongQuestions.splice(index, 1);
            this.saveWrongQuestions();
            return true;
        }
        return false;
    }

    /**
     * 保存问题到文件
     * @param {string} gradeKey - 年级键名
     */
    async saveQuestions(gradeKey) {
        try {
            const questionsJson = JSON.stringify(this.questions[gradeKey], null, 2);
            
            // 在实际环境中，这里应该使用适当的文件保存方法
            // 由于浏览器限制，这里使用localStorage作为演示
            localStorage.setItem(`mathMaze_${gradeKey}`, questionsJson);
            
            console.log(`${gradeKey} 问题已保存`);
        } catch (error) {
            console.error(`保存 ${gradeKey} 问题时出错:`, error);
        }
    }

    /**
     * 保存错题本
     */
    async saveWrongQuestions() {
        try {
            const wrongQuestionsJson = JSON.stringify(this.wrongQuestions, null, 2);
            
            // 在实际环境中，这里应该使用适当的文件保存方法
            localStorage.setItem('mathMaze_wrongQuestions', wrongQuestionsJson);
            
            console.log('错题本已保存');
        } catch (error) {
            console.error('保存错题本时出错:', error);
        }
    }

    /**
     * 导出问题
     * @param {string} gradeKey - 年级键名
     * @returns {string} - JSON字符串
     */
    exportQuestions(gradeKey) {
        return JSON.stringify(this.questions[gradeKey], null, 2);
    }

    /**
     * 导入问题
     * @param {string} gradeKey - 年级键名
     * @param {string} jsonData - JSON字符串
     * @returns {boolean} - 是否成功
     */
    importQuestions(gradeKey, jsonData) {
        try {
            const questions = JSON.parse(jsonData);
            
            if (Array.isArray(questions)) {
                this.questions[gradeKey] = questions;
                this.saveQuestions(gradeKey);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('导入问题时出错:', error);
            return false;
        }
    }
}

// 创建全局问题管理器实例
const questionManager = new QuestionManager();
