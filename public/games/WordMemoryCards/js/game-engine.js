/**
 * 游戏引擎 - 负责游戏逻辑和界面交互
 */
class GameEngine {
    /**
     * 构造函数
     * @param {DataManager} dataManager - 数据管理器实例
     * @param {UserProgress} userProgress - 用户进度管理器实例
     * @param {AnimationManager} animationManager - 动画管理器实例
     */
    constructor(dataManager, userProgress, animationManager) {
        this.dataManager = dataManager;
        this.userProgress = userProgress;
        this.animationManager = animationManager;
        this.currentMode = null;
        this.currentType = null;
        this.currentCategory = null;
        this.currentWords = [];
        this.currentWordIndex = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.reviewWords = [];
    }

    /**
     * 初始化游戏
     * @param {string} mode - 游戏模式 ('memory', 'challenge', 'review')
     * @param {string} type - 分类类型 ('difficulty', 'topic')
     * @param {string} category - 分类名称
     */
    initGame(mode, type, category) {
        console.log(`初始化游戏: 模式=${mode}, 类型=${type}, 分类=${category}`);
        
        this.currentMode = mode;
        this.currentType = type;
        this.currentCategory = category;
        
        // 根据不同模式初始化游戏
        let result = false;
        switch (mode) {
            case 'memory':
                result = this.initMemoryMode(type, category);
                break;
            case 'challenge':
                result = this.initChallengeMode(type, category);
                break;
            case 'review':
                result = this.initReviewMode(type, category);
                break;
            default:
                console.error('未知的游戏模式:', mode);
                return false;
        }
        
        return result;
    }

    /**
     * 初始化记忆模式
     * @param {string} type - 分类类型
     * @param {string} category - 分类名称
     */
    initMemoryMode(type, category) {
        console.log(`初始化记忆模式: ${type} - ${category}`);
        
        // 获取该分类的所有单词
        const allWords = this.dataManager.getWordsByCategory(type, category);
        console.log(`获取到 ${allWords.length} 个单词`);
        
        if (allWords.length === 0) {
            console.error("没有找到单词数据");
            return false;
        }
        
        // 过滤出未掌握的单词
        this.currentWords = allWords.filter(word => {
            const progress = this.dataManager.getWordProgress(type, category, word.id);
            return !progress || progress.status !== 'mastered';
        });
        
        console.log(`过滤出 ${this.currentWords.length} 个未掌握的单词`);
        
        // 如果没有未掌握的单词，使用所有单词
        if (this.currentWords.length === 0) {
            console.log("没有未掌握的单词，使用所有单词");
            this.currentWords = [...allWords];
        }
        
        // 随机排序
        this.shuffleWords();
        
        this.currentWordIndex = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        
        // 显示第一个单词
        this.showCurrentWord();
        return true;
    }

    /**
     * 初始化挑战模式
     * @param {string} type - 分类类型
     * @param {string} category - 分类名称
     */
    initChallengeMode(type, category) {
        console.log(`初始化挑战模式: ${type} - ${category}`);
        
        // 获取该分类的所有单词
        const allWords = this.dataManager.getWordsByCategory(type, category);
        console.log(`获取到 ${allWords.length} 个单词`);
        
        if (allWords.length === 0) {
            console.error("没有找到单词数据");
            return false;
        }
        
        // 随机选择20个单词进行挑战
        this.currentWords = [...allWords];
        this.shuffleWords();
        this.currentWords = this.currentWords.slice(0, Math.min(20, this.currentWords.length));
        
        console.log(`选择了 ${this.currentWords.length} 个单词进行挑战`);
        
        this.currentWordIndex = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        
        // 显示第一个单词
        this.showChallengeWord();
        return true;
    }

    /**
     * 初始化复习模式
     * @param {string} type - 分类类型
     * @param {string} category - 分类名称
     */
    initReviewMode(type, category) {
        console.log(`初始化复习模式: ${type} - ${category}`);
        
        // 获取该分类的所有单词
        const allWords = this.dataManager.getWordsByCategory(type, category);
        console.log(`获取到 ${allWords.length} 个单词`);
        
        if (allWords.length === 0) {
            console.error("没有找到单词数据");
            return false;
        }
        
        // 过滤出需要复习的单词（错误次数多于正确次数的单词）
        this.reviewWords = allWords.filter(word => {
            const progress = this.dataManager.getWordProgress(type, category, word.id);
            return progress && progress.incorrectCount > progress.correctCount;
        });
        
        console.log(`找到 ${this.reviewWords.length} 个需要复习的单词`);
        
        // 如果没有需要复习的单词，使用所有非掌握的单词
        if (this.reviewWords.length === 0) {
            console.log("没有需要复习的单词，使用所有非掌握的单词");
            this.reviewWords = allWords.filter(word => {
                const progress = this.dataManager.getWordProgress(type, category, word.id);
                return !progress || progress.status !== 'mastered';
            });
            
            console.log(`找到 ${this.reviewWords.length} 个非掌握的单词`);
            
            // 如果仍然没有单词，使用所有单词
            if (this.reviewWords.length === 0) {
                console.log("没有非掌握的单词，使用所有单词");
                this.reviewWords = [...allWords];
            }
        }
        
        this.currentWords = [...this.reviewWords];
        this.shuffleWords();
        
        this.currentWordIndex = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        
        // 显示第一个单词
        this.showCurrentWord();
        return true;
    }

    /**
     * 随机排序当前单词列表
     */
    shuffleWords() {
        for (let i = this.currentWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentWords[i], this.currentWords[j]] = [this.currentWords[j], this.currentWords[i]];
        }
    }

    /**
     * 显示当前单词（记忆模式）
     */
    showCurrentWord() {
        console.log(`显示当前单词，索引: ${this.currentWordIndex}/${this.currentWords.length}`);
        
        if (this.currentWordIndex >= this.currentWords.length) {
            console.log("已显示所有单词，显示游戏总结");
            this.showGameSummary();
            return;
        }
        
        const word = this.currentWords[this.currentWordIndex];
        console.log("当前单词:", word);
        
        const container = $('#game-container');
        
        // 清空容器
        container.empty();
        
        // 创建单词卡片
        const cardHtml = `
            <div class="word-card">
                <div class="word-card-inner">
                    <div class="word-card-front">
                        <div class="word-card-content">
                            <div class="word-text">${word.word}</div>
                            <div class="word-phonetic">${word.phonetic || ''}</div>
                        </div>
                    </div>
                    <div class="word-card-back">
                        <div class="word-card-content">
                            <div class="word-translation">${word.translation}</div>
                            <div class="word-example">${word.example || ''}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flip-hint">
                <i class="fas fa-hand-pointer"></i> 点击卡片查看翻译
            </div>
            <div class="game-controls">
                <button class="btn btn-danger btn-dont-know">
                    <i class="fas fa-times me-2"></i>不认识
                </button>
                <button class="btn btn-success btn-know">
                    <i class="fas fa-check me-2"></i>认识
                </button>
            </div>
        `;
        
        container.html(cardHtml);
        console.log("单词卡片HTML已添加到容器");
        
        // 绑定事件
        $('.word-card').on('click', () => {
            console.log("单词卡片被点击");
            if (!$('.word-card').hasClass('flipped')) {
                if (this.animationManager) {
                    this.animationManager.playCardFlipAnimation($('.word-card')[0]);
                } else {
                    $('.word-card').addClass('flipped');
                }
            }
        });
        
        $('.btn-know').on('click', () => {
            console.log("点击了'认识'按钮");
            this.markWordAsKnown();
        });
        
        $('.btn-dont-know').on('click', () => {
            console.log("点击了'不认识'按钮");
            this.markWordAsUnknown();
        });
        
        // 更新进度
        this.updateProgressBar();
    }

    /**
     * 显示挑战模式的单词
     */
    showChallengeWord() {
        console.log(`显示挑战单词，索引: ${this.currentWordIndex}/${this.currentWords.length}`);
        
        if (this.currentWordIndex >= this.currentWords.length) {
            console.log("已显示所有单词，显示游戏总结");
            this.showGameSummary();
            return;
        }
        
        const word = this.currentWords[this.currentWordIndex];
        console.log("当前单词:", word);
        
        const container = $('#game-container');
        
        // 清空容器
        container.empty();
        
        // 创建挑战卡片
        const cardHtml = `
            <div class="challenge-card">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="mb-4">${word.translation}</h3>
                        <div class="form-group mb-4">
                            <input type="text" class="form-control form-control-lg" id="answer-input" placeholder="请输入对应的英文单词">
                        </div>
                        <button class="btn btn-primary btn-lg btn-check-answer">
                            <i class="fas fa-search me-2"></i>检查答案
                        </button>
                    </div>
                </div>
            </div>
            <div class="feedback mt-4" style="display: none;"></div>
            <div class="animation-container mt-3" id="result-animation" style="display: none;"></div>
        `;
        
        container.html(cardHtml);
        console.log("挑战卡片HTML已添加到容器");
        
        // 绑定事件
        $('.btn-check-answer').on('click', () => {
            console.log("点击了'检查答案'按钮");
            this.checkChallengeAnswer();
        });
        
        $('#answer-input').on('keypress', (e) => {
            if (e.which === 13) {
                console.log("按下了回车键");
                this.checkChallengeAnswer();
            }
        });
        
        // 自动聚焦输入框
        $('#answer-input').focus();
        
        // 更新进度
        this.updateProgressBar();
    }

    /**
     * 检查挑战模式的答案
     */
    checkChallengeAnswer() {
        const word = this.currentWords[this.currentWordIndex];
        const userAnswer = $('#answer-input').val().trim().toLowerCase();
        const correctAnswer = word.word.toLowerCase();
        
        const isCorrect = userAnswer === correctAnswer;
        const feedback = $('.feedback');
        const animationContainer = $('#result-animation');
        
        if (isCorrect) {
            feedback.removeClass('feedback-incorrect').addClass('feedback-correct');
            feedback.html(`<strong>正确!</strong> ${word.word} - ${word.translation}`);
            this.correctAnswers++;
            
            // 播放正确动画
            animationContainer.show();
            this.animationManager.playCorrectAnimation(animationContainer[0]);
            
            // 更新单词进度
            this.updateWordProgress(word, true);
        } else {
            feedback.removeClass('feedback-correct').addClass('feedback-incorrect');
            feedback.html(`<strong>错误!</strong> 正确答案是: ${word.word} - ${word.translation}`);
            this.incorrectAnswers++;
            
            // 播放错误动画
            animationContainer.show();
            this.animationManager.playWrongAnimation(animationContainer[0]);
            
            // 更新单词进度
            this.updateWordProgress(word, false);
        }
        
        feedback.show();
        
        // 禁用输入和按钮
        $('#answer-input').prop('disabled', true);
        $('.btn-check-answer').prop('disabled', true);
        
        // 2.5秒后显示下一个单词
        setTimeout(() => {
            this.currentWordIndex++;
            this.showChallengeWord();
        }, 2500);
    }

    /**
     * 标记当前单词为"认识"
     */
    markWordAsKnown() {
        const word = this.currentWords[this.currentWordIndex];
        this.updateWordProgress(word, true);
        this.correctAnswers++;
        this.currentWordIndex++;
        this.showCurrentWord();
    }

    /**
     * 标记当前单词为"不认识"
     */
    markWordAsUnknown() {
        const word = this.currentWords[this.currentWordIndex];
        this.updateWordProgress(word, false);
        this.incorrectAnswers++;
        this.currentWordIndex++;
        this.showCurrentWord();
    }

    /**
     * 更新单词学习进度
     * @param {Object} word - 单词对象
     * @param {boolean} isCorrect - 是否回答正确
     */
    updateWordProgress(word, isCorrect) {
        // 获取当前进度
        let progress = this.dataManager.getWordProgress(this.currentType, this.currentCategory, word.id);
        
        if (!progress) {
            progress = {
                status: 'not-learned',
                lastReviewed: null,
                correctCount: 0,
                incorrectCount: 0
            };
        }
        
        // 更新进度
        progress.lastReviewed = new Date().toISOString();
        
        if (isCorrect) {
            progress.correctCount++;
        } else {
            progress.incorrectCount++;
        }
        
        // 根据正确率更新状态
        const totalAnswers = progress.correctCount + progress.incorrectCount;
        const correctRate = progress.correctCount / totalAnswers;
        
        if (totalAnswers >= 3 && correctRate >= 0.8) {
            progress.status = 'mastered';
        } else if (totalAnswers >= 1) {
            progress.status = 'learning';
        }
        
        // 保存进度
        this.dataManager.saveWordProgress(this.currentType, this.currentCategory, word.id, progress);
        
        // 更新全局进度
        this.userProgress.updateProgress();
    }

    /**
     * 更新进度条
     */
    updateProgressBar() {
        const total = this.currentWords.length;
        const current = this.currentWordIndex + 1;
        const percentage = Math.min(Math.floor((current / total) * 100), 100);
        
        $('.progress-bar').css('width', `${percentage}%`).attr('aria-valuenow', percentage).text(`${percentage}%`);
    }

    /**
     * 显示游戏总结
     */
    showGameSummary() {
        const container = $('#game-container');
        const total = this.correctAnswers + this.incorrectAnswers;
        const correctRate = total > 0 ? Math.round((this.correctAnswers / total) * 100) : 0;
        
        // 清空容器
        container.empty();
        
        // 创建总结卡片
        const summaryHtml = `
            <div class="card">
                <div class="card-body text-center">
                    <h3 class="mb-4">游戏结束!</h3>
                    <div class="animation-container" id="completion-animation"></div>
                    <div class="summary-stats mt-4">
                        <p>总共单词: <strong>${total}</strong></p>
                        <p>正确: <strong>${this.correctAnswers}</strong></p>
                        <p>错误: <strong>${this.incorrectAnswers}</strong></p>
                        <p>正确率: <strong>${correctRate}%</strong></p>
                    </div>
                    <div class="mt-4">
                        <button class="btn btn-primary btn-lg btn-restart">
                            <i class="fas fa-redo-alt me-2"></i>再来一次
                        </button>
                        <button class="btn btn-secondary btn-lg" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>关闭
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.html(summaryHtml);
        
        // 加载完成动画
        const animationContainer = document.getElementById('completion-animation');
        if (correctRate >= 80) {
            this.animationManager.playCompleteAnimation(animationContainer);
        } else {
            this.animationManager.playAnimation(correctRate >= 50 ? 'learning' : 'failure', animationContainer);
        }
        
        // 绑定事件
        $('.btn-restart').on('click', () => {
            this.initGame(this.currentMode, this.currentType, this.currentCategory);
        });
        
        // 更新全局进度
        this.userProgress.updateProgress();
    }
}
