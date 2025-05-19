/**
 * 调试助手 - 帮助调试游戏功能
 */
class DebugHelper {
    constructor() {
        this.isDebugMode = false;
        this.logContainer = null;
        this.init();
    }
    
    /**
     * 初始化调试助手
     */
    init() {
        // 创建调试按钮
        this.createDebugButton();
        
        // 创建日志容器
        this.createLogContainer();
        
        // 监听控制台日志
        this.interceptConsoleLog();
    }
    
    /**
     * 创建调试按钮
     */
    createDebugButton() {
        const button = document.createElement('button');
        button.textContent = '调试';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', () => {
            this.toggleDebugMode();
        });
        
        document.body.appendChild(button);
    }
    
    /**
     * 创建日志容器
     */
    createLogContainer() {
        this.logContainer = document.createElement('div');
        this.logContainer.style.position = 'fixed';
        this.logContainer.style.bottom = '50px';
        this.logContainer.style.right = '10px';
        this.logContainer.style.width = '400px';
        this.logContainer.style.height = '300px';
        this.logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.logContainer.style.color = 'white';
        this.logContainer.style.padding = '10px';
        this.logContainer.style.overflowY = 'auto';
        this.logContainer.style.fontFamily = 'monospace';
        this.logContainer.style.fontSize = '12px';
        this.logContainer.style.zIndex = '9998';
        this.logContainer.style.display = 'none';
        this.logContainer.style.borderRadius = '5px';
        
        document.body.appendChild(this.logContainer);
    }
    
    /**
     * 拦截控制台日志
     */
    interceptConsoleLog() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;
        const self = this;
        
        console.log = function() {
            originalLog.apply(console, arguments);
            self.addLogEntry('log', Array.from(arguments));
        };
        
        console.error = function() {
            originalError.apply(console, arguments);
            self.addLogEntry('error', Array.from(arguments));
        };
        
        console.warn = function() {
            originalWarn.apply(console, arguments);
            self.addLogEntry('warn', Array.from(arguments));
        };
        
        console.info = function() {
            originalInfo.apply(console, arguments);
            self.addLogEntry('info', Array.from(arguments));
        };
    }
    
    /**
     * 添加日志条目
     * @param {string} type - 日志类型
     * @param {Array} args - 日志参数
     */
    addLogEntry(type, args) {
        const entry = document.createElement('div');
        let color = 'white';
        
        switch (type) {
            case 'error':
                color = '#ff5f6d';
                break;
            case 'warn':
                color = '#ffc371';
                break;
            case 'info':
                color = '#4a8eff';
                break;
        }
        
        entry.style.color = color;
        entry.style.marginBottom = '5px';
        entry.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        entry.style.paddingBottom = '5px';
        
        const timestamp = new Date().toLocaleTimeString();
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
        
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.logContainer.appendChild(entry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    
    /**
     * 切换调试模式
     */
    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
        this.logContainer.style.display = this.isDebugMode ? 'block' : 'none';
        
        // 添加调试信息
        if (this.isDebugMode) {
            this.addSystemInfo();
        }
    }
    
    /**
     * 添加系统信息
     */
    addSystemInfo() {
        const entry = document.createElement('div');
        entry.style.color = '#4a8eff';
        entry.style.marginBottom = '10px';
        entry.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)';
        entry.style.paddingBottom = '10px';
        entry.style.fontWeight = 'bold';
        
        const info = [
            '===== 系统信息 =====',
            `浏览器: ${navigator.userAgent}`,
            `屏幕分辨率: ${window.screen.width}x${window.screen.height}`,
            `窗口大小: ${window.innerWidth}x${window.innerHeight}`,
            `当前URL: ${window.location.href}`,
            '===================='
        ].join('\n');
        
        entry.textContent = info;
        
        this.logContainer.appendChild(entry);
    }
    
    /**
     * 检查单词数据
     * @param {DataManager} dataManager - 数据管理器实例
     */
    checkWordData(dataManager) {
        console.info('===== 检查单词数据 =====');
        
        // 检查难度分类数据
        const difficultyCategories = dataManager.categories.difficulty;
        for (const key in difficultyCategories) {
            const words = dataManager.getWordsByCategory('difficulty', key);
            console.info(`难度 ${key}: ${words.length} 个单词`);
        }
        
        // 检查主题分类数据
        const topicCategories = dataManager.categories.topic;
        for (const key in topicCategories) {
            const words = dataManager.getWordsByCategory('topic', key);
            console.info(`主题 ${key}: ${words.length} 个单词`);
        }
        
        console.info('======================');
    }
    
    /**
     * 模拟单词数据
     * @param {DataManager} dataManager - 数据管理器实例
     */
    mockWordData(dataManager) {
        console.info('===== 模拟单词数据 =====');
        
        // 为所有分类创建模拟数据
        const createMockData = (type, category, count) => {
            const mockData = [];
            for (let i = 1; i <= count; i++) {
                mockData.push({
                    id: `${category}_${i}`,
                    word: `${category}_word_${i}`,
                    phonetic: `/phonetic_${i}/`,
                    translation: `${category}单词${i}`,
                    example: `This is an example for ${category}_word_${i}.`
                });
            }
            
            // 存储模拟数据
            if (!dataManager.wordData[type]) {
                dataManager.wordData[type] = {};
            }
            dataManager.wordData[type][category] = mockData;
            
            console.info(`已创建 ${type} - ${category} 模拟数据，共 ${mockData.length} 个单词`);
        };
        
        // 创建难度分类模拟数据
        const difficultyCategories = dataManager.categories.difficulty;
        for (const key in difficultyCategories) {
            if (dataManager.getWordsByCategory('difficulty', key).length === 0) {
                createMockData('difficulty', key, 10);
            }
        }
        
        // 创建主题分类模拟数据
        const topicCategories = dataManager.categories.topic;
        for (const key in topicCategories) {
            if (dataManager.getWordsByCategory('topic', key).length === 0) {
                createMockData('topic', key, 10);
            }
        }
        
        console.info('======================');
    }
}
