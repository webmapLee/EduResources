/**
 * 用户进度管理器 - 负责跟踪和显示用户的学习进度
 */
class UserProgress {
    /**
     * 构造函数
     * @param {DataManager} dataManager - 数据管理器实例
     */
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.totalWords = 0;
        this.masteredWords = 0;
        this.learningWords = 0;
        this.notLearnedWords = 0;
    }

    /**
     * 初始化用户进度
     */
    init() {
        this.calculateTotalProgress();
        this.updateProgressDisplay();
    }

    /**
     * 计算总体学习进度
     */
    calculateTotalProgress() {
        this.totalWords = 0;
        this.masteredWords = 0;
        this.learningWords = 0;
        this.notLearnedWords = 0;
        
        // 计算按难度分类的进度
        const difficultyCategories = this.dataManager.categories.difficulty;
        for (const key in difficultyCategories) {
            const progress = this.dataManager.getCategoryProgress('difficulty', key);
            this.totalWords += progress.total;
            this.masteredWords += progress.mastered;
            this.learningWords += progress.learning;
            this.notLearnedWords += progress.notLearned;
        }
        
        // 计算按主题分类的进度
        const topicCategories = this.dataManager.categories.topic;
        for (const key in topicCategories) {
            // 不重复计算，因为单词可能在多个分类中出现
            // 这里只是为了UI显示，实际上我们只关心用户是否掌握了单词
        }
    }

    /**
     * 更新进度显示
     */
    updateProgressDisplay() {
        // 更新进度条
        const percentage = this.totalWords > 0 ? Math.floor((this.masteredWords / this.totalWords) * 100) : 0;
        $('.progress-bar').css('width', `${percentage}%`).attr('aria-valuenow', percentage).text(`${percentage}%`);
        
        // 更新统计数字
        $('#mastered-count').text(this.masteredWords);
        $('#learning-count').text(this.learningWords);
        $('#not-learned-count').text(this.notLearnedWords);
    }

    /**
     * 更新进度（在单词学习状态变化后调用）
     */
    updateProgress() {
        this.calculateTotalProgress();
        this.updateProgressDisplay();
    }

    /**
     * 重置所有学习进度
     */
    resetProgress() {
        this.dataManager.resetAllProgress();
        this.updateProgress();
    }

    /**
     * 获取指定分类的进度
     * @param {string} type - 分类类型 ('difficulty' 或 'topic')
     * @param {string} category - 分类名称
     * @returns {Object} 进度信息
     */
    getCategoryProgress(type, category) {
        return this.dataManager.getCategoryProgress(type, category);
    }
}
