// 游戏数据
let gameData = {
    questions: [],
    currentQuestion: null,
    scores: {
        team1: 0,
        team2: 0
    },
    currentTeam: 1,
    hintShown: false
};

// DOM 元素
const elements = {
    popcornContainer: document.getElementById('popcorn-container'),
    questionDisplay: document.getElementById('question-display'),
    team1Score: document.getElementById('team1-score'),
    team2Score: document.getElementById('team2-score'),
    drawButton: document.getElementById('draw-popcorn'),
    resetButton: document.getElementById('reset-game'),
    correctButton: document.getElementById('correct-answer'),
    wrongButton: document.getElementById('wrong-answer'),
    addButton: document.getElementById('add-question'),
    addSampleButton: document.getElementById('add-sample-questions'),
    loadQuestionBankButton: document.getElementById('load-question-bank'),
    resetQingkongButton: document.getElementById('reset-qingkong'),
    questionType: document.getElementById('question-type'),
    questionContent: document.getElementById('question-content'),
    questionHint: document.getElementById('question-hint'),
    questionAnswer: document.getElementById('question-answer'),
    customRuleGroup: document.getElementById('custom-rule-group'),
    customRule: document.getElementById('custom-rule'),
    toggleHintButton: document.getElementById('toggle-hint'),
    showTutorialButton: document.getElementById('show-tutorial'),
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // 模态框
    popcornModal: document.getElementById('popcorn-modal'),
    tutorialModal: document.getElementById('tutorial-modal'),
    hintModal: document.getElementById('hint-modal'),
    successModal: document.getElementById('success-modal'),
    
    // 模态框元素
    modalClose: document.querySelectorAll('.close-button'),
    modalQuestionType: document.getElementById('modal-question-type'),
    modalQuestionContent: document.getElementById('modal-question-content'),
    modalQuestionHint: document.getElementById('modal-question-hint'),
    modalShowHint: document.getElementById('modal-show-hint'),
    modalCloseButton: document.getElementById('modal-close'),
    closeTutorialButton: document.getElementById('close-tutorial'),
    closeHintButton: document.getElementById('close-hint'),
    closeSuccessButton: document.getElementById('close-success'),
    hintText: document.getElementById('hint-text'),
    successMessage: document.getElementById('success-message'),
    boxTop: document.querySelector('.box-top')
};

// 初始化游戏
function initGame() {
    // 从本地存储加载游戏数据
    const savedData = localStorage.getItem('popcornKnowledgeBox');
    if (savedData) {
        gameData = JSON.parse(savedData);
        updateScoreDisplay();
        renderPopcorns();
    }

    // 添加事件监听器
    elements.drawButton.addEventListener('click', drawPopcorn);
    elements.resetButton.addEventListener('click', resetGame);
    elements.correctButton.addEventListener('click', () => handleAnswer(true));
    elements.wrongButton.addEventListener('click', () => handleAnswer(false));
    elements.addButton.addEventListener('click', addQuestion);
    elements.addSampleButton.addEventListener('click', addSampleQuestions);
    elements.loadQuestionBankButton.addEventListener('click', loadQuestionBank);
    elements.resetQingkongButton.addEventListener('click', resetQingkongQuestions);
    elements.toggleHintButton.addEventListener('click', toggleHint);
    elements.showTutorialButton.addEventListener('click', showTutorial);
    
    // 问题类型变更监听
    elements.questionType.addEventListener('change', function() {
        if (this.value === '自定义') {
            elements.customRuleGroup.style.display = 'block';
        } else {
            elements.customRuleGroup.style.display = 'none';
        }
    });
    
    // 标签页切换
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // 移除所有活动状态
            elements.tabButtons.forEach(btn => btn.classList.remove('active'));
            elements.tabContents.forEach(content => content.classList.remove('active'));
            
            // 设置当前活动标签
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // 模态框按钮
    elements.modalShowHint.addEventListener('click', showModalHint);
    elements.modalCloseButton.addEventListener('click', closePopcornModal);
    elements.closeTutorialButton.addEventListener('click', closeTutorialModal);
    elements.closeHintButton.addEventListener('click', closeHintModal);
    elements.closeSuccessButton.addEventListener('click', closeSuccessModal);

    // 关闭按钮事件
    elements.modalClose.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // 检查爆米花盒是否为空
    checkEmptyBox();
    
    // 首次访问显示教程
    if (!localStorage.getItem('tutorialShown')) {
        setTimeout(() => {
            showTutorial();
            localStorage.setItem('tutorialShown', 'true');
        }, 1000);
    }
}

// 渲染爆米花
function renderPopcorns() {
    elements.popcornContainer.innerHTML = '';
    
    if (gameData.questions.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-box-message';
        emptyMessage.textContent = '爆米花盒是空的！请添加知识点';
        elements.popcornContainer.appendChild(emptyMessage);
        emptyMessage.style.display = 'block';
    } else {
        gameData.questions.forEach((question, index) => {
            const popcorn = document.createElement('div');
            popcorn.className = 'popcorn';
            popcorn.dataset.index = index;
            
            // 添加点击事件
            popcorn.addEventListener('click', () => {
                selectQuestion(index);
            });
            
            elements.popcornContainer.appendChild(popcorn);
        });
    }
    
    checkEmptyBox();
}

// 检查爆米花盒是否为空
function checkEmptyBox() {
    const emptyMessage = elements.popcornContainer.querySelector('.empty-box-message');
    if (gameData.questions.length === 0) {
        if (!emptyMessage) {
            const newEmptyMessage = document.createElement('div');
            newEmptyMessage.className = 'empty-box-message';
            newEmptyMessage.textContent = '爆米花盒是空的！请添加知识点';
            elements.popcornContainer.appendChild(newEmptyMessage);
            newEmptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'block';
        }
        elements.drawButton.disabled = true;
        elements.drawButton.classList.remove('pulse-button');
    } else {
        if (emptyMessage) {
            emptyMessage.style.display = 'none';
        }
        elements.drawButton.disabled = false;
        elements.drawButton.classList.add('pulse-button');
    }
}

// 添加问题
function addQuestion() {
    const type = elements.questionType.value;
    const content = elements.questionContent.value.trim();
    const hint = elements.questionHint.value.trim();
    const answer = elements.questionAnswer.value.trim();
    const customRule = type === '自定义' ? elements.customRule.value.trim() : '';
    
    if (!content) {
        showHintModal('请输入题目内容！');
        return;
    }
    
    if (!answer) {
        showHintModal('请输入正确答案！');
        return;
    }
    
    const newQuestion = {
        type,
        content,
        hint,
        answer,
        customRule
    };
    
    gameData.questions.push(newQuestion);
    saveGameData();
    renderPopcorns();
    
    // 清空输入框
    elements.questionContent.value = '';
    elements.questionHint.value = '';
    elements.questionAnswer.value = '';
    if (elements.customRule) {
        elements.customRule.value = '';
    }
    
    // 动画效果
    elements.boxTop.classList.add('open');
    setTimeout(() => {
        elements.boxTop.classList.remove('open');
    }, 1000);
    
    showHintModal('题目已添加到爆米花盒！');
}

// 抽取爆米花
function drawPopcorn() {
    if (gameData.questions.length === 0) {
        showHintModal('爆米花盒是空的！请先添加题目。');
        return;
    }
    
    // 打开盒子动画
    elements.boxTop.classList.add('open');
    
    // 随机选择一个问题
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * gameData.questions.length);
        selectQuestion(randomIndex);
        
        // 关闭盒子
        setTimeout(() => {
            elements.boxTop.classList.remove('open');
        }, 1000);
    }, 500);
}

// 选择问题
function selectQuestion(index) {
    gameData.currentQuestion = gameData.questions[index];
    gameData.hintShown = false;
    
    // 显示模态框
    elements.modalQuestionType.textContent = gameData.currentQuestion.type;
    elements.modalQuestionContent.textContent = gameData.currentQuestion.content;
    elements.modalQuestionHint.textContent = gameData.currentQuestion.hint || '（无提示）';
    elements.modalQuestionHint.style.display = 'none';
    elements.popcornModal.style.display = 'block';
    
    // 更新问题显示
    updateQuestionDisplay();
    
    // 从爆米花盒中移除该问题
    gameData.questions.splice(index, 1);
    saveGameData();
    renderPopcorns();
}

// 更新问题显示
function updateQuestionDisplay() {
    if (!gameData.currentQuestion) {
        elements.questionDisplay.innerHTML = '<p>点击"抽取爆米花"开始游戏</p>';
        return;
    }
    
    let hintDisplay = '';
    if (gameData.hintShown && gameData.currentQuestion.hint) {
        hintDisplay = `<p class="hint visible"><strong>提示：</strong>${gameData.currentQuestion.hint}</p>`;
    } else if (gameData.currentQuestion.hint) {
        hintDisplay = `<p class="hint"><strong>提示：</strong>（点击"显示提示"按钮查看）</p>`;
    } else {
        hintDisplay = `<p class="hint"><strong>提示：</strong>（无提示）</p>`;
    }
    
    let typeDisplay = gameData.currentQuestion.type;
    let contentDisplay = gameData.currentQuestion.content;
    let answerDisplay = '';
    
    // 根据题目类型提供更具体的指导
    if (gameData.currentQuestion.type.includes('填词')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>请填写缺失的词语</p>`;
    } else if (gameData.currentQuestion.type.includes('接龙')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>请说出以"${contentDisplay.charAt(contentDisplay.length - 1)}"字开头的${gameData.currentQuestion.type.includes('古诗') ? '诗句' : '成语'}</p>`;
    } else if (gameData.currentQuestion.type.includes('猜作者')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>请猜出这首诗的作者</p>`;
    } else if (gameData.currentQuestion.type.includes('渊源')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>请说出这个成语的历史来源或典故</p>`;
    } else if (gameData.currentQuestion.type.includes('识别')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>请识别这个汉字</p>`;
    } else if (gameData.currentQuestion.type.includes('读音')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>请正确读出这个汉字的读音，包括声调</p>`;
    } else if (gameData.currentQuestion.type.includes('自定义')) {
        answerDisplay = `<p class="answer-guide"><strong>答题方式：</strong>${gameData.currentQuestion.customRule || '请按照自定义规则回答'}</p>`;
    }
    
    elements.questionDisplay.innerHTML = `
        <p><strong>类型：</strong>${typeDisplay}</p>
        <p><strong>内容：</strong>${contentDisplay}</p>
        ${hintDisplay}
        ${answerDisplay}
        <p><strong>当前答题：</strong>队伍 ${gameData.currentTeam}</p>
    `;
    
    // 更新提示按钮文本
    elements.toggleHintButton.textContent = gameData.hintShown ? '隐藏提示' : '显示提示';
}

// 切换提示显示
function toggleHint() {
    if (!gameData.currentQuestion) {
        showHintModal('请先抽取一个爆米花题目！');
        return;
    }
    
    if (!gameData.currentQuestion.hint) {
        showHintModal('这个题目没有提示信息！');
        return;
    }
    
    gameData.hintShown = !gameData.hintShown;
    updateQuestionDisplay();
    
    const hintElement = elements.questionDisplay.querySelector('.hint');
    if (hintElement) {
        if (gameData.hintShown) {
            hintElement.classList.add('visible');
        } else {
            hintElement.classList.remove('visible');
        }
    }
}

// 显示模态框中的提示
function showModalHint() {
    elements.modalQuestionHint.style.display = 'block';
    elements.modalQuestionHint.classList.add('visible');
    elements.modalShowHint.style.display = 'none';
}

// 处理答题结果
function handleAnswer(isCorrect) {
    if (!gameData.currentQuestion) {
        showHintModal('请先抽取一个爆米花题目！');
        return;
    }
    
    // 显示正确答案
    const correctAnswer = gameData.currentQuestion.answer;
    
    if (isCorrect) {
        // 答对加分
        if (gameData.currentTeam === 1) {
            gameData.scores.team1++;
            elements.team1Score.classList.add('highlight');
            setTimeout(() => {
                elements.team1Score.classList.remove('highlight');
            }, 1000);
        } else {
            gameData.scores.team2++;
            elements.team2Score.classList.add('highlight');
            setTimeout(() => {
                elements.team2Score.classList.remove('highlight');
            }, 1000);
        }
        
        updateScoreDisplay();
        
        // 显示成功模态框
        elements.successMessage.innerHTML = `
            <p>队伍 ${gameData.currentTeam} 答对了！获得1分！</p>
            <p class="correct-answer">正确答案: ${correctAnswer}</p>
        `;
        elements.successModal.style.display = 'block';
    } else {
        showHintModal(`队伍 ${gameData.currentTeam} 答错了！正确答案是: ${correctAnswer}`);
    }
    
    // 切换队伍
    gameData.currentTeam = gameData.currentTeam === 1 ? 2 : 1;
    
    // 重置当前问题
    gameData.currentQuestion = null;
    gameData.hintShown = false;
    elements.questionDisplay.innerHTML = '<p>点击"抽取爆米花"继续游戏</p>';
    
    saveGameData();
}

// 更新分数显示
function updateScoreDisplay() {
    elements.team1Score.textContent = gameData.scores.team1;
    elements.team2Score.textContent = gameData.scores.team2;
}

// 重置游戏
function resetGame() {
    if (confirm('确定要重置游戏吗？这将清空所有题目和分数。')) {
        gameData = {
            questions: [],
            currentQuestion: null,
            scores: {
                team1: 0,
                team2: 0
            },
            currentTeam: 1,
            hintShown: false
        };
        
        saveGameData();
        renderPopcorns();
        updateScoreDisplay();
        elements.questionDisplay.innerHTML = '<p>点击"抽取爆米花"开始游戏</p>';
        
        showHintModal('游戏已重置！');
    }
}

// 显示教程
function showTutorial() {
    elements.tutorialModal.style.display = 'block';
}

// 关闭模态框
function closeModal(modal) {
    modal.style.display = 'none';
}

// 关闭爆米花模态框
function closePopcornModal() {
    elements.popcornModal.style.display = 'none';
}

// 关闭教程模态框
function closeTutorialModal() {
    elements.tutorialModal.style.display = 'none';
}

// 关闭提示模态框
function closeHintModal() {
    elements.hintModal.style.display = 'none';
}

// 关闭成功模态框
function closeSuccessModal() {
    elements.successModal.style.display = 'none';
}

// 显示提示模态框
function showHintModal(message) {
    elements.hintText.textContent = message;
    elements.hintModal.style.display = 'block';
}

// 保存游戏数据到本地存储
function saveGameData() {
    localStorage.setItem('popcornKnowledgeBox', JSON.stringify(gameData));
}

// 预设题目示例
function addSampleQuestions() {
    const sampleQuestions = [
        {
            type: '古诗-填词',
            content: '床前明月光，疑是_____。',
            hint: '《静夜思》唐代 李白',
            answer: '地上霜'
        },
        {
            type: '古诗-接龙',
            content: '举头望明月',
            hint: '《静夜思》中的下一句',
            answer: '低头思故乡'
        },
        {
            type: '古诗-猜作者',
            content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
            hint: '唐代著名诗人',
            answer: '王之涣'
        },
        {
            type: '成语-填词',
            content: '守株_____',
            hint: '比喻墨守成规，不知变通',
            answer: '待兔'
        },
        {
            type: '成语-接龙',
            content: '画蛇添足',
            hint: '最后一个字是"足"',
            answer: '足不出户'
        },
        {
            type: '成语-渊源',
            content: '刻舟求剑',
            hint: '与楚国人有关',
            answer: '战国时楚国人过河时，剑掉入水中，便在船上刻下记号，想着到岸后从刻痕处去找剑'
        },
        {
            type: '生字-识别',
            content: '氵部首，共9画，与"游泳"有关',
            hint: '读音为"泳"(yǒng)',
            answer: '泳'
        },
        {
            type: '生字-读音',
            content: '翱',
            hint: '与"翱翔"有关',
            answer: 'áo'
        },
        {
            type: '古诗-填词',
            content: '春眠不觉晓，_____。',
            hint: '《春晓》孟浩然',
            answer: '处处闻啼鸟'
        },
        {
            type: '古诗-猜作者',
            content: '鹅鹅鹅，曲项向天歌。白毛浮绿水，红掌拨清波。',
            hint: '唐代诗人',
            answer: '骆宾王'
        }
    ];
    
    // 添加示例题目
    gameData.questions = gameData.questions.concat(sampleQuestions);
    saveGameData();
    renderPopcorns();
    
    // 动画效果
    elements.boxTop.classList.add('open');
    setTimeout(() => {
        elements.boxTop.classList.remove('open');
    }, 1000);
    
    showHintModal('已添加10个示例题目到爆米花盒！');
}

// 加载题库资源
function loadQuestionBank() {
    showHintModal('正在加载题库资源，请稍候...');
    
    // 模拟加载大型题库
    setTimeout(() => {
        fetch('question-bank.json')
            .then(response => {
                if (!response.ok) {
                    // 如果文件不存在，使用内置题库
                    return Promise.resolve({ questions: generateLargeQuestionBank() });
                }
                return response.json();
            })
            .then(data => {
                if (data.questions && Array.isArray(data.questions)) {
                    // 添加题库中的问题
                    const questionCount = Math.min(data.questions.length, 100); // 一次最多加载100题
                    const selectedQuestions = data.questions.slice(0, questionCount);
                    
                    gameData.questions = gameData.questions.concat(selectedQuestions);
                    saveGameData();
                    renderPopcorns();
                    
                    // 动画效果
                    elements.boxTop.classList.add('open');
                    setTimeout(() => {
                        elements.boxTop.classList.remove('open');
                    }, 1000);
                    
                    showHintModal(`已成功导入${questionCount}个题目到爆米花盒！`);
                }
            })
            .catch(error => {
                console.error('加载题库失败:', error);
                
                // 使用内置题库作为备选
                const backupQuestions = generateLargeQuestionBank().slice(0, 50);
                gameData.questions = gameData.questions.concat(backupQuestions);
                saveGameData();
                renderPopcorns();
                
                showHintModal('已导入50个内置题目到爆米花盒！');
            });
    }, 1000);
}

// 生成大型题库
function generateLargeQuestionBank() {
    // 这里只是示例，实际应用中应该有一个完整的题库文件
    const questionBank = [];
    
    // 古诗题库 - 填词
    const poetryFill = [
        {
            type: '古诗-填词',
            content: '小时不识月，_____。',
            hint: '《古朗月行》李白',
            answer: '呼作白玉盘'
        },
        {
            type: '古诗-填词',
            content: '飞流直下三千尺，_____。',
            hint: '《望庐山瀑布》李白',
            answer: '疑是银河落九天'
        },
        {
            type: '古诗-填词',
            content: '两只黄鹂鸣翠柳，_____。',
            hint: '《绝句》杜甫',
            answer: '一行白鹭上青天'
        },
        {
            type: '古诗-填词',
            content: '会当凌绝顶，_____。',
            hint: '《望岳》杜甫',
            answer: '一览众山小'
        },
        {
            type: '古诗-填词',
            content: '国破山河在，_____。',
            hint: '《春望》杜甫',
            answer: '城春草木深'
        }
    ];
    
    // 古诗题库 - 猜作者
    const poetryAuthor = [
        {
            type: '古诗-猜作者',
            content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
            hint: '唐代诗人',
            answer: '李绅'
        },
        {
            type: '古诗-猜作者',
            content: '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。',
            hint: '唐代诗人',
            answer: '孟郊'
        },
        {
            type: '古诗-猜作者',
            content: '独坐幽篁里，弹琴复长啸。深林人不知，明月来相照。',
            hint: '唐代诗人',
            answer: '王维'
        },
        {
            type: '古诗-猜作者',
            content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
            hint: '唐代女诗人',
            answer: '王维'
        },
        {
            type: '古诗-猜作者',
            content: '君自故乡来，应知故乡事。来日绮窗前，寒梅著花未？',
            hint: '唐代诗人',
            answer: '王维'
        }
    ];
    
    // 成语题库 - 填词
    const idiomFill = [
        {
            type: '成语-填词',
            content: '画龙_____',
            hint: '比喻做事情只完成了形式，没有完成实质',
            answer: '点睛'
        },
        {
            type: '成语-填词',
            content: '_____之交',
            hint: '形容非常要好的朋友',
            answer: '管鲍'
        },
        {
            type: '成语-填词',
            content: '一鸣_____',
            hint: '比喻平时没有特别表现的人，一下子做出惊人的成绩',
            answer: '惊人'
        },
        {
            type: '成语-填词',
            content: '叶公_____',
            hint: '比喻口头上说喜欢某事物，实际上却害怕或讨厌它',
            answer: '好龙'
        },
        {
            type: '成语-填词',
            content: '掩耳_____',
            hint: '比喻自己欺骗自己',
            answer: '盗铃'
        }
    ];
    
    // 成语题库 - 渊源
    const idiomOrigin = [
        {
            type: '成语-渊源',
            content: '杯弓蛇影',
            hint: '与酒杯和弓有关',
            answer: '战国时，有人在酒杯中看到杯子映在墙上的影子，误以为是蛇，吓得生病。后来发现墙上挂着一张弓，弓的影子映在酒杯里'
        },
        {
            type: '成语-渊源',
            content: '亡羊补牢',
            hint: '与羊圈有关',
            answer: '《战国策》中记载，有人的羊从羊圈的漏洞跑掉了，有人劝他修补羊圈，以免更多的羊跑掉'
        },
        {
            type: '成语-渊源',
            content: '塞翁失马',
            hint: '与边塞老人有关',
            answer: '《淮南子》中记载，边塞的老人丢了马，邻居来安慰，老人说"焉知非福"。后来马带回一匹好马，邻居来祝贺，老人说"焉知非祸"'
        },
        {
            type: '成语-渊源',
            content: '愚公移山',
            hint: '与老人搬山有关',
            answer: '《列子》中记载，愚公决心移走挡在家门前的两座大山，被智叟嘲笑，愚公说子子孙孙无穷匮，而山不会增高，最终感动了天帝'
        },
        {
            type: '成语-渊源',
            content: '揠苗助长',
            hint: '与农民种庄稼有关',
            answer: '《孟子》中记载，宋国有个农夫嫌禾苗长得太慢，就把禾苗往上拔，结果禾苗都枯死了'
        }
    ];
    
    // 生字题库
    const characters = [
        {
            type: '生字-识别',
            content: '木字旁，共7画，与"树木"有关',
            hint: '读音为"松"(sōng)',
            answer: '松'
        },
        {
            type: '生字-识别',
            content: '言字旁，共9画，与"说话"有关',
            hint: '读音为"语"(yǔ)',
            answer: '语'
        },
        {
            type: '生字-识别',
            content: '金字旁，共11画，与"珠宝"有关',
            hint: '读音为"珍"(zhēn)',
            answer: '珍'
        },
        {
            type: '生字-读音',
            content: '篆',
            hint: '一种古代文字',
            answer: 'zhuàn'
        },
        {
            type: '生字-读音',
            content: '骸',
            hint: '与"尸骨"有关',
            answer: 'hái'
        }
    ];
    
    // 将所有题目合并到题库中
    questionBank.push(...poetryFill, ...poetryAuthor, ...idiomFill, ...idiomOrigin, ...characters);
    
    // 生成更多题目以达到大量题库
    // 这里只是示例，实际应用中应该有一个完整的题库文件
    
    return questionBank;
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
// 重置青空题目
function resetQingkongQuestions() {
    if (confirm('确定要重置青空题目吗？这将清空当前所有题目，但保留分数。')) {
        // 保存当前分数
        const currentScores = {
            team1: gameData.scores.team1,
            team2: gameData.scores.team2
        };
        const currentTeam = gameData.currentTeam;
        
        // 清空题目
        gameData.questions = [];
        gameData.currentQuestion = null;
        gameData.hintShown = false;
        
        // 恢复分数
        gameData.scores = currentScores;
        gameData.currentTeam = currentTeam;
        
        saveGameData();
        renderPopcorns();
        elements.questionDisplay.innerHTML = '<p>题目已重置，点击"抽取爆米花"开始新游戏</p>';
        
        // 动画效果
        elements.boxTop.classList.add('open');
        setTimeout(() => {
            elements.boxTop.classList.remove('open');
        }, 1000);
        
        showHintModal('青空题目已重置！分数保持不变。');
        
        // 添加青空主题的题目
        addQingkongQuestions();
    }
}

// 添加青空主题题目
function addQingkongQuestions() {
    const qingkongQuestions = [
        {
            type: '古诗-填词',
            content: '海内存知己，_____。',
            hint: '《送杜少府之任蜀州》王勃',
            answer: '天涯若比邻'
        },
        {
            type: '古诗-猜作者',
            content: '空山新雨后，天气晚来秋。明月松间照，清泉石上流。',
            hint: '唐代诗人',
            answer: '王维'
        },
        {
            type: '古诗-填词',
            content: '青青园中葵，_____。',
            hint: '《杂诗》曹植',
            answer: '朝露待日晞'
        },
        {
            type: '成语-渊源',
            content: '青梅竹马',
            hint: '与儿时玩伴有关',
            answer: '出自《诗经·郑风·溱洧》，形容小儿女天真无邪的亲密关系'
        },
        {
            type: '成语-填词',
            content: '万里_____',
            hint: '形容天空晴朗，没有云彩',
            answer: '无云'
        },
        {
            type: '生字-识别',
            content: '氵部首，共9画，与"天空"有关',
            hint: '读音为"kōng"',
            answer: '空'
        },
        {
            type: '古诗-接龙',
            content: '空山不见人',
            hint: '《鹿柴》王维',
            answer: '但闻人语响'
        },
        {
            type: '成语-接龙',
            content: '青出于蓝',
            hint: '最后一个字是"蓝"',
            answer: '蓝田生玉'
        },
        {
            type: '生字-读音',
            content: '碧',
            hint: '与"青"相近的颜色',
            answer: 'bì'
        },
        {
            type: '自定义',
            content: '青空的含义是什么？',
            hint: '与天空有关',
            answer: '青色的天空，象征希望和广阔的未来',
            customRule: '回答与"青空"相关的问题'
        }
    ];
    
    // 添加青空主题题目
    gameData.questions = gameData.questions.concat(qingkongQuestions);
    saveGameData();
    renderPopcorns();
}
