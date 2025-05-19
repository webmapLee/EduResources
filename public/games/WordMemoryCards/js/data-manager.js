/**
 * 数据管理器 - 负责加载和管理单词数据
 */
class DataManager {
    constructor() {
        this.wordData = {};
        this.categories = {
            // 按难度分类
            difficulty: {
                beginner: { name: "入门100个常用单词", count: 100 },
                basic: { name: "常用500个单词", count: 500 },
                daily: { name: "日常1000个单词", count: 1000 },
                cet4: { name: "四级4000个单词", count: 4000 }
            },
            // 按主题分类
            topic: {
                animals: { name: "动物", count: 78 },
                transport: { name: "交通与地点", count: 72 },
                body: { name: "身体与服装", count: 72 },
                time: { name: "时间数字颜色", count: 71 },
                fruits: { name: "蔬果", count: 46 },
                home: { name: "我的家", count: 69 },
                adjverb: { name: "形容词与动词", count: 175 },
                school: { name: "学校", count: 44 },
                sports: { name: "运动与爱好", count: 42 }
            }
        };
    }

    /**
     * 初始化数据管理器
     * @returns {Promise} 初始化完成的Promise
     */
    async init() {
        try {
            // 加载所有分类的单词数据
            await this.loadAllCategories();
            console.log("所有单词数据加载完成");
            return true;
        } catch (error) {
            console.error("初始化数据管理器失败:", error);
            return false;
        }
    }

    /**
     * 加载所有分类的单词数据
     * @returns {Promise} 加载完成的Promise
     */
    async loadAllCategories() {
        const loadPromises = [];

        // 加载按难度分类的单词
        for (const key in this.categories.difficulty) {
            loadPromises.push(this.loadWordsByCategory('difficulty', key));
        }

        // 加载按主题分类的单词
        for (const key in this.categories.topic) {
            loadPromises.push(this.loadWordsByCategory('topic', key));
        }

        return Promise.all(loadPromises);
    }

    /**
     * 加载指定分类的单词数据
     * @param {string} type - 分类类型 ('difficulty' 或 'topic')
     * @param {string} category - 分类名称
     * @returns {Promise} 加载完成的Promise
     */
    async loadWordsByCategory(type, category) {
        try {
            const response = await fetch(`data/${type}_${category}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 存储加载的数据
            if (!this.wordData[type]) {
                this.wordData[type] = {};
            }
            this.wordData[type][category] = data;
            
            console.log(`已加载 ${type} - ${category} 单词数据，共 ${data.length} 个单词`);
            return data;
        } catch (error) {
            console.error(`加载 ${type} - ${category} 单词数据失败:`, error);
            
            // 如果文件不存在，创建模拟数据
            if (!this.wordData[type]) {
                this.wordData[type] = {};
            }
            
            // 创建10个模拟单词
            const mockData = [];
            for (let i = 1; i <= 10; i++) {
                mockData.push({
                    id: `${category}_${i}`,
                    word: `${category}_word_${i}`,
                    phonetic: `/phonetic_${i}/`,
                    translation: `${category}单词${i}`,
                    example: `This is an example for ${category}_word_${i}.`
                });
            }
            
            this.wordData[type][category] = mockData;
            console.warn(`为 ${type} - ${category} 创建了模拟数据，共 ${mockData.length} 个单词`);
            
            return mockData;
        }
    }

    /**
     * 获取指定分类的单词数据
     * @param {string} type - 分类类型 ('difficulty' 或 'topic')
     * @param {string} category - 分类名称
     * @returns {Array} 单词数据数组
     */
    getWordsByCategory(type, category) {
        if (this.wordData[type] && this.wordData[type][category]) {
            return this.wordData[type][category];
        }
        return [];
    }

    /**
     * 获取所有单词数据
     * @returns {Object} 所有单词数据
     */
    getAllWords() {
        return this.wordData;
    }

    /**
     * 获取分类信息
     * @returns {Object} 分类信息
     */
    getCategories() {
        return this.categories;
    }

    /**
     * 保存用户的单词学习进度
     * @param {string} type - 分类类型
     * @param {string} category - 分类名称
     * @param {string} wordId - 单词ID
     * @param {Object} progress - 进度信息 {status: 'mastered'|'learning'|'not-learned', lastReviewed: Date, correctCount: number, incorrectCount: number}
     */
    saveWordProgress(type, category, wordId, progress) {
        const key = `wordProgress_${type}_${category}_${wordId}`;
        localStorage.setItem(key, JSON.stringify(progress));
    }

    /**
     * 获取用户的单词学习进度
     * @param {string} type - 分类类型
     * @param {string} category - 分类名称
     * @param {string} wordId - 单词ID
     * @returns {Object|null} 进度信息或null
     */
    getWordProgress(type, category, wordId) {
        const key = `wordProgress_${type}_${category}_${wordId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * 获取指定分类的所有单词进度
     * @param {string} type - 分类类型
     * @param {string} category - 分类名称
     * @returns {Object} 单词进度映射
     */
    getCategoryProgress(type, category) {
        const words = this.getWordsByCategory(type, category);
        const progress = {
            mastered: 0,
            learning: 0,
            notLearned: 0,
            total: words.length
        };

        words.forEach(word => {
            const wordProgress = this.getWordProgress(type, category, word.id);
            if (wordProgress) {
                if (wordProgress.status === 'mastered') {
                    progress.mastered++;
                } else if (wordProgress.status === 'learning') {
                    progress.learning++;
                } else {
                    progress.notLearned++;
                }
            } else {
                progress.notLearned++;
            }
        });

        return progress;
    }

    /**
     * 重置所有学习进度
     */
    resetAllProgress() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('wordProgress_')) {
                keys.push(key);
            }
        }
        
        keys.forEach(key => localStorage.removeItem(key));
        console.log(`已重置 ${keys.length} 个单词的学习进度`);
    }
}
