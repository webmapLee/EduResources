/**
 * 数学迷宫 - 游戏主控制模块
 * 负责游戏流程、界面切换和游戏逻辑
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 生成游戏所需的图像
        const imageGenerator = new ImageGenerator();
        const images = imageGenerator.generateAllImages();

        // 等待所有图像加载完成
        await imageGenerator.addImagesToDOM(images);

        console.log("所有图像加载完成，初始化游戏...");

        // 游戏状态
        const gameState = {
            currentScreen: 'main-menu',
            selectedGrade: 1,
            selectedTheme: 'space',
            currentLevel: 1,
            score: 0,
            keysCollected: 0,
            requiredKeys: 3,
            gameStartTime: 0,
            levelStats: {
                timeTaken: 0,
                correctAnswers: 0,
                wrongAnswers: 0
            },
            settings: {
                sound: true,
                music: true,
                difficulty: 'normal'
            }
        }

        // DOM元素
        const elements = {
            screens: {
                mainMenu: document.getElementById('main-menu'),
                gradeSelect: document.getElementById('grade-select'),
                themeSelect: document.getElementById('theme-select'),
                mazeGame: document.getElementById('maze-game'),
                questionManager: document.getElementById('question-manager'),
                wrongQuestions: document.getElementById('wrong-questions-book'),
                settings: document.getElementById('settings-screen')
            },
            game: {
                mazeCanvas: document.getElementById('maze-canvas'),
                character: document.getElementById('character'),
                questionPopup: document.getElementById('question-popup'),
                questionText: document.getElementById('question-text'),
                answerInput: document.getElementById('answer-input'),
                submitAnswer: document.getElementById('submit-answer'),
                currentLevel: document.getElementById('current-level'),
                currentGrade: document.getElementById('current-grade'),
                score: document.getElementById('score'),
                keys: document.getElementById('keys'),
                pauseBtn: document.getElementById('pause-btn')
            },
            pauseMenu: {
                container: document.getElementById('pause-menu'),
                resumeGame: document.getElementById('resume-game'),
                restartLevel: document.getElementById('restart-level'),
                exitToMenu: document.getElementById('exit-to-menu')
            },
            levelComplete: {
                container: document.getElementById('level-complete'),
                timeTaken: document.getElementById('time-taken'),
                correctAnswers: document.getElementById('correct-answers'),
                wrongAnswers: document.getElementById('wrong-answers'),
                levelScore: document.getElementById('level-score'),
                nextLevel: document.getElementById('next-level'),
                replayLevel: document.getElementById('replay-level'),
                levelExit: document.getElementById('level-exit')
            },
            buttons: {
                startGame: document.getElementById('start-game'),
                manageQuestions: document.getElementById('manage-questions'),
                wrongQuestionsBtn: document.getElementById('wrong-questions'),
                settingsBtn: document.getElementById('settings'),
                backButtons: document.querySelectorAll('.back-btn'),
                gradeButtons: document.querySelectorAll('.grade-btn'),
                themeCards: document.querySelectorAll('.theme-card')
            }
        };

        // 游戏实例
        let maze = null;
        let character = null;
        let animations = null;
        let currentQuestion = null;

        // 初始化游戏
        function init() {
            // 创建动画实例
            animations = new Animations();
            animations.addCssAnimations();

            // 设置事件监听器
            setupEventListeners();

            // 加载设置
            loadSettings();
        }

        /**
         * 设置事件监听器
         */
        function setupEventListeners() {
            // 主菜单按钮
            elements.buttons.startGame.addEventListener('click', () => showScreen('grade-select'));
            elements.buttons.manageQuestions.addEventListener('click', () => showScreen('question-manager'));
            elements.buttons.wrongQuestionsBtn.addEventListener('click', () => {
                loadWrongQuestions();
                showScreen('wrong-questions-book');
            });
            elements.buttons.settingsBtn.addEventListener('click', () => showScreen('settings-screen'));

            // 返回按钮
            elements.buttons.backButtons.forEach(button => {
                button.addEventListener('click', () => showScreen('main-menu'));
            });

            // 年级选择按钮
            elements.buttons.gradeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    gameState.selectedGrade = parseInt(button.dataset.grade);
                    showScreen('theme-select');
                });
            });

            // 主题选择卡片
            elements.buttons.themeCards.forEach(card => {
                card.addEventListener('click', () => {
                    gameState.selectedTheme = card.dataset.theme;
                    startGame();
                });
            });

            // 暂停菜单
            elements.game.pauseBtn.addEventListener('click', togglePause);
            elements.pauseMenu.resumeGame.addEventListener('click', togglePause);
            elements.pauseMenu.restartLevel.addEventListener('click', restartLevel);
            elements.pauseMenu.exitToMenu.addEventListener('click', exitToMenu);

            // 关卡完成菜单
            elements.levelComplete.nextLevel.addEventListener('click', nextLevel);
            elements.levelComplete.replayLevel.addEventListener('click', restartLevel);
            elements.levelComplete.levelExit.addEventListener('click', exitToMenu);

            // 问题回答
            elements.game.submitAnswer.addEventListener('click', submitAnswer);
            elements.game.answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitAnswer();
                }
            });

            // 问题点事件
            document.addEventListener('question-point', (e) => {
                showQuestion(e.detail.position);
            });

            // 终点事件
            document.addEventListener('end-point', () => {
                if (gameState.keysCollected >= gameState.requiredKeys) {
                    completeLevelSuccess();
                } else {
                    alert(`你需要收集 ${gameState.requiredKeys} 把钥匙才能通过关卡！`);
                }
            });

            // 钥匙收集事件
            document.addEventListener('key-collected', (e) => {
                updateKeys(e.detail.keys);
            });

            // 题库管理
            document.getElementById('add-question').addEventListener('click', showAddQuestionForm);
            document.getElementById('view-questions').addEventListener('click', viewQuestions);
            document.getElementById('save-question').addEventListener('click', saveQuestion);
            document.getElementById('cancel-add').addEventListener('click', hideAddQuestionForm);
            document.getElementById('import-questions').addEventListener('click', importQuestions);
            document.getElementById('export-questions').addEventListener('click', exportQuestions);

            // 设置
            document.getElementById('sound-toggle').addEventListener('change', (e) => {
                gameState.settings.sound = e.target.checked;
                saveSettings();
            });

            document.getElementById('music-toggle').addEventListener('change', (e) => {
                gameState.settings.music = e.target.checked;
                saveSettings();
            });

            document.getElementById('difficulty-select').addEventListener('change', (e) => {
                gameState.settings.difficulty = e.target.value;
                saveSettings();
            });
        }

        /**
         * 显示指定屏幕
         * @param {string} screenId - 屏幕ID
         */
        function showScreen(screenId) {
            // 隐藏所有屏幕
            Object.values(elements.screens).forEach(screen => {
                screen.classList.remove('active');
            });

            // 显示指定屏幕
            document.getElementById(screenId).classList.add('active');

            // 更新当前屏幕
            gameState.currentScreen = screenId;
        }

        /**
         * 开始游戏
         */
        function startGame() {
            // 重置游戏状态
            gameState.currentLevel = 1;
            gameState.score = 0;
            gameState.keysCollected = 0;

            // 更新UI
            elements.game.currentLevel.textContent = `关卡: ${gameState.currentLevel}`;
            elements.game.currentGrade.textContent = `年级: ${gameState.selectedGrade}`;
            elements.game.score.textContent = `分数: ${gameState.score}`;
            elements.game.keys.textContent = `钥匙: ${gameState.keysCollected}/${gameState.requiredKeys}`;

            // 应用主题
            document.body.className = `theme-${gameState.selectedTheme}`;

            // 显示游戏屏幕
            showScreen('maze-game');

            // 创建迷宫
            maze = new Maze(elements.game.mazeCanvas, gameState.currentLevel, gameState.selectedTheme);

            // 监听迷宫准备完成事件
            document.addEventListener('maze-ready', function onMazeReady(e) {
                // 移除事件监听器，避免重复触发
                document.removeEventListener('maze-ready', onMazeReady);
                
                // 创建角色
                character = new Character(elements.game.character, maze);

                // 记录开始时间
                gameState.gameStartTime = Date.now();

                // 重置关卡统计
                resetLevelStats();
            }, { once: true });
        }

        /**
         * 显示问题
         * @param {Object} position - 问题点位置
         */
        function showQuestion(position) {
            // 获取当前年级的问题
            const questions = questionManager.getQuestions(
                gameState.selectedGrade,
                1,
                gameState.settings.difficulty
            );

            if (questions.length > 0) {
                currentQuestion = questions[0];

                // 显示问题
                elements.game.questionText.textContent = currentQuestion.question;
                elements.game.answerInput.value = '';
                elements.game.questionPopup.classList.remove('hidden');
                elements.game.answerInput.focus();

                // 保存问题点位置
                currentQuestion.position = position;
            } else {
                console.error('没有可用的问题！');
            }
        }

        /**
         * 提交答案
         */
        function submitAnswer() {
            if (!currentQuestion) return;

            const userAnswer = elements.game.answerInput.value.trim();

            if (userAnswer === '') {
                alert('请输入答案！');
                return;
            }

            // 检查答案
            const isCorrect = parseFloat(userAnswer) === currentQuestion.answer;

            if (isCorrect) {
                // 正确答案
                animations.correctAnswerAnimation(elements.game.questionPopup);

                // 隐藏问题
                elements.game.questionPopup.classList.add('hidden');

                // 移除问题点
                maze.removeQuestionPoint(currentQuestion.position);

                // 收集钥匙
                const keys = character.collectKey();

                // 更新钥匙UI
                updateKeys(keys);

                // 显示钥匙动画
                const pixelPosition = maze.getPixelPosition(currentQuestion.position);
                animations.numberToKeyAnimation(pixelPosition, () => {
                    // 增加分数
                    updateScore(gameState.score + 100);

                    // 更新统计
                    gameState.levelStats.correctAnswers++;
                });
            } else {
                // 错误答案
                animations.wrongAnswerAnimation(elements.game.questionPopup);

                // 添加到错题本
                questionManager.addWrongQuestion(currentQuestion, userAnswer);

                // 更新统计
                gameState.levelStats.wrongAnswers++;
            }
        }

        /**
         * 更新钥匙数量
         * @param {number} keys - 钥匙数量
         */
        function updateKeys(keys) {
            gameState.keysCollected = keys;
            elements.game.keys.textContent = `钥匙: ${gameState.keysCollected}/${gameState.requiredKeys}`;
        }

        /**
         * 更新分数
         * @param {number} score - 新分数
         */
        function updateScore(score) {
            gameState.score = score;
            elements.game.score.textContent = `分数: ${gameState.score}`;
        }

        /**
         * 切换暂停状态
         */
        function togglePause() {
            const isPaused = !elements.pauseMenu.container.classList.contains('hidden');

            if (isPaused) {
                // 恢复游戏
                elements.pauseMenu.container.classList.add('hidden');
            } else {
                // 暂停游戏
                elements.pauseMenu.container.classList.remove('hidden');
            }
        }

        /**
         * 重新开始关卡
         */
        function restartLevel() {
            // 隐藏菜单
            elements.pauseMenu.container.classList.add('hidden');
            elements.levelComplete.container.classList.add('hidden');

            // 重置迷宫
            maze.updateLevel(gameState.currentLevel);

            // 重置角色
            character.updateMaze(maze);

            // 重置关卡统计
            resetLevelStats();

            // 重置钥匙
            updateKeys(0);
        }

        /**
         * 返回主菜单
         */
        function exitToMenu() {
            // 隐藏菜单
            elements.pauseMenu.container.classList.add('hidden');
            elements.levelComplete.container.classList.add('hidden');

            // 显示主菜单
            showScreen('main-menu');
        }

        /**
         * 下一关
         */
        function nextLevel() {
            // 隐藏关卡完成菜单
            elements.levelComplete.container.classList.add('hidden');

            // 增加关卡
            gameState.currentLevel++;
            elements.game.currentLevel.textContent = `关卡: ${gameState.currentLevel}`;

            // 更新迷宫
            maze.updateLevel(gameState.currentLevel);

            // 更新角色
            character.updateMaze(maze);

            // 重置关卡统计
            resetLevelStats();

            // 重置钥匙
            updateKeys(0);
        }

        /**
         * 成功完成关卡
         */
        function completeLevelSuccess() {
            // 计算关卡时间
            const levelTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
            gameState.levelStats.timeTaken = levelTime;

            // 计算关卡分数
            const levelScore = calculateLevelScore();

            // 更新总分
            updateScore(gameState.score + levelScore);

            // 显示关卡完成动画
            animations.levelCompleteAnimation(() => {
                // 更新关卡完成菜单
                elements.levelComplete.timeTaken.textContent = formatTime(levelTime);
                elements.levelComplete.correctAnswers.textContent = gameState.levelStats.correctAnswers;
                elements.levelComplete.wrongAnswers.textContent = gameState.levelStats.wrongAnswers;
                elements.levelComplete.levelScore.textContent = levelScore;

                // 显示关卡完成菜单
                elements.levelComplete.container.classList.remove('hidden');
            });
        }

        /**
         * 计算关卡分数
         * @returns {number} - 关卡分数
         */
        function calculateLevelScore() {
            const baseScore = 500;
            const timeBonus = Math.max(0, 300 - gameState.levelStats.timeTaken * 2);
            const correctBonus = gameState.levelStats.correctAnswers * 100;
            const wrongPenalty = gameState.levelStats.wrongAnswers * 50;

            return baseScore + timeBonus + correctBonus - wrongPenalty;
        }

        /**
         * 格式化时间
         * @param {number} seconds - 秒数
         * @returns {string} - 格式化后的时间字符串
         */
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        /**
         * 重置关卡统计
         */
        function resetLevelStats() {
            gameState.levelStats = {
                timeTaken: 0,
                correctAnswers: 0,
                wrongAnswers: 0
            };

            gameState.gameStartTime = Date.now();
        }

        /**
         * 显示添加问题表单
         */
        function showAddQuestionForm() {
            document.getElementById('question-list').classList.add('hidden');
            document.getElementById('add-question-form').classList.remove('hidden');
        }

        /**
         * 隐藏添加问题表单
         */
        function hideAddQuestionForm() {
            document.getElementById('add-question-form').classList.add('hidden');
        }

        /**
         * 保存问题
         */
        function saveQuestion() {
            const questionText = document.getElementById('question-text-input').value.trim();
            const answer = parseFloat(document.getElementById('correct-answer').value);
            const difficulty = document.getElementById('difficulty').value;
            const gradeSelect = document.getElementById('manage-grade');
            const grade = gradeSelect.value;

            if (!questionText || isNaN(answer)) {
                alert('请填写完整的问题和答案！');
                return;
            }

            const question = {
                question: questionText,
                answer: answer,
                difficulty: difficulty
            };

            questionManager.addQuestion(grade, question);

            alert('问题已添加！');
            hideAddQuestionForm();
        }

        /**
         * 查看问题
         */
        function viewQuestions() {
            const gradeSelect = document.getElementById('manage-grade');
            const grade = gradeSelect.value;
            const questionList = document.getElementById('question-list');

            // 清空列表
            questionList.innerHTML = '';

            // 获取问题
            const questions = questionManager.questions[`grade${grade}`] || questionManager.questions[grade];

            if (questions && questions.length > 0) {
                // 创建问题列表
                questions.forEach((q, index) => {
                    const questionItem = document.createElement('div');
                    questionItem.className = 'question-item';
                    questionItem.innerHTML = `
                    <div class="question-info">
                        <span class="question-number">${index + 1}.</span>
                        <span class="question-text">${q.question}</span>
                        <span class="question-answer">答案: ${q.answer}</span>
                        <span class="question-difficulty">难度: ${q.difficulty}</span>
                    </div>
                    <div class="question-actions">
                        <button class="delete-question" data-id="${q.id}">删除</button>
                    </div>
                `;

                    questionList.appendChild(questionItem);
                });

                // 添加删除事件
                const deleteButtons = questionList.querySelectorAll('.delete-question');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const questionId = button.dataset.id;
                        if (confirm('确定要删除这个问题吗？')) {
                            questionManager.removeQuestion(grade, questionId);
                            viewQuestions(); // 刷新列表
                        }
                    });
                });

                // 显示列表
                questionList.classList.remove('hidden');
                document.getElementById('add-question-form').classList.add('hidden');
            } else {
                questionList.innerHTML = '<p>没有找到问题。</p>';
                questionList.classList.remove('hidden');
                document.getElementById('add-question-form').classList.add('hidden');
            }
        }

        /**
         * 导入问题
         */
        function importQuestions() {
            const gradeSelect = document.getElementById('manage-grade');
            const grade = gradeSelect.value;

            const jsonData = prompt('请粘贴JSON格式的问题数据:');

            if (jsonData) {
                const success = questionManager.importQuestions(grade === 'custom' ? grade : `grade${grade}`, jsonData);

                if (success) {
                    alert('问题导入成功！');
                } else {
                    alert('问题导入失败，请检查JSON格式是否正确。');
                }
            }
        }

        /**
         * 导出问题
         */
        function exportQuestions() {
            const gradeSelect = document.getElementById('manage-grade');
            const grade = gradeSelect.value;

            const jsonData = questionManager.exportQuestions(grade === 'custom' ? grade : `grade${grade}`);

            // 创建临时文本区域
            const textarea = document.createElement('textarea');
            textarea.value = jsonData;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            alert('问题数据已复制到剪贴板！');
        }

        /**
         * 加载错题本
         */
        function loadWrongQuestions() {
            const wrongQuestionsList = document.querySelector('.wrong-questions-list');

            // 清空列表
            wrongQuestionsList.innerHTML = '';

            if (questionManager.wrongQuestions.length > 0) {
                // 创建错题列表
                questionManager.wrongQuestions.forEach((q, index) => {
                    const wrongItem = document.createElement('div');
                    wrongItem.className = 'wrong-question-item';
                    wrongItem.innerHTML = `
                    <div class="wrong-question-info">
                        <span class="question-number">${index + 1}.</span>
                        <span class="question-text">${q.question}</span>
                        <span class="question-answer">正确答案: ${q.answer}</span>
                        <span class="wrong-answer">你的答案: ${q.lastWrongAnswer}</span>
                        <span class="wrong-count">错误次数: ${q.wrongCount}</span>
                    </div>
                    <div class="question-actions">
                        <button class="remove-wrong" data-id="${q.id}">移除</button>
                    </div>
                `;

                    wrongQuestionsList.appendChild(wrongItem);
                });

                // 添加移除事件
                const removeButtons = wrongQuestionsList.querySelectorAll('.remove-wrong');
                removeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const questionId = button.dataset.id;
                        if (confirm('确定要从错题本中移除这个问题吗？')) {
                            questionManager.removeWrongQuestion(questionId);
                            loadWrongQuestions(); // 刷新列表
                        }
                    });
                });
            } else {
                wrongQuestionsList.innerHTML = '<p>错题本中没有问题。</p>';
            }
        }

        /**
         * 加载设置
         */
        function loadSettings() {
            try {
                const savedSettings = localStorage.getItem('mathMaze_settings');

                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);

                    gameState.settings = {
                        ...gameState.settings,
                        ...settings
                    };

                    // 更新UI
                    document.getElementById('sound-toggle').checked = gameState.settings.sound;
                    document.getElementById('music-toggle').checked = gameState.settings.music;
                    document.getElementById('difficulty-select').value = gameState.settings.difficulty;
                }
            } catch (error) {
                console.error('加载设置时出错:', error);
            }
        }

        /**
         * 保存设置
         */
        function saveSettings() {
            try {
                localStorage.setItem('mathMaze_settings', JSON.stringify(gameState.settings));
            } catch (error) {
                console.error('保存设置时出错:', error);
            }
        }

        // 初始化游戏
        init();
    } catch (error) {
        console.error('初始化游戏时出错:', error);
        alert('游戏初始化失败，请刷新页面重试。');
    }
});

