/**
 * 提示框管理器
 * 创建友好的提示框
 */
class TooltipManager {
    constructor() {
        this.tooltipElement = null;
        this.activeElement = null;
        this.hideTimeout = null;
        this.offset = 10;
        
        this.init();
    }
    
    /**
     * 初始化提示框管理器
     */
    init() {
        // 创建提示框元素
        this.createTooltipElement();
        
        // 绑定事件
        this.bindEvents();
    }
    
    /**
     * 创建提示框元素
     */
    createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'custom-tooltip';
        this.tooltipElement.innerHTML = `
            <div class="tooltip-title"></div>
            <div class="tooltip-content"></div>
        `;
        document.body.appendChild(this.tooltipElement);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 为所有需要提示的元素添加事件
        this.addTooltipTriggers();
        
        // 监听窗口大小变化，重新定位提示框
        window.addEventListener('resize', () => {
            if (this.activeElement) {
                this.positionTooltip(this.activeElement);
            }
        });
        
        // 监听滚动事件，重新定位提示框
        window.addEventListener('scroll', () => {
            if (this.activeElement) {
                this.positionTooltip(this.activeElement);
            }
        }, true);
    }
    
    /**
     * 为需要提示的元素添加事件
     */
    addTooltipTriggers() {
        // 为分类卡片添加提示
        document.querySelectorAll('.category-card').forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.card-title').textContent;
            const content = this.getCategoryTooltipContent(category);
            
            this.addTooltipEvents(card, title, content);
        });
        
        // 为游戏模式卡片添加提示
        document.querySelectorAll('.game-mode-card').forEach(card => {
            const mode = card.dataset.mode;
            const title = card.querySelector('.card-title').textContent;
            const content = this.getGameModeTooltipContent(mode);
            
            this.addTooltipEvents(card, title, content);
        });
        
        // 为难度列表项添加提示
        document.querySelectorAll('.difficulty-list .list-group-item').forEach(item => {
            const category = item.dataset.category;
            const title = item.textContent.trim().split('\n')[0];
            const content = this.getDifficultyTooltipContent(category);
            
            this.addTooltipEvents(item, title, content);
        });
        
        // 为按钮添加提示
        document.querySelectorAll('.btn-know, .btn-dont-know').forEach(btn => {
            const title = btn.textContent;
            const content = btn.classList.contains('btn-know') ? 
                '点击此按钮表示你认识这个单词，它将被标记为已学习。' : 
                '点击此按钮表示你不认识这个单词，它将被添加到复习列表中。';
            
            this.addTooltipEvents(btn, title, content);
        });
        
        // 为重置进度按钮添加提示
        const resetBtn = document.getElementById('reset-progress');
        if (resetBtn) {
            this.addTooltipEvents(resetBtn, '重置学习进度', '点击此按钮将清除所有学习记录，所有单词将恢复到未学习状态。');
        }
    }
    
    /**
     * 为元素添加提示事件
     * @param {HTMLElement} element - 需要添加提示的元素
     * @param {string} title - 提示标题
     * @param {string} content - 提示内容
     */
    addTooltipEvents(element, title, content) {
        element.addEventListener('mouseenter', () => {
            this.showTooltip(element, title, content);
        });
        
        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
        
        element.addEventListener('focus', () => {
            this.showTooltip(element, title, content);
        });
        
        element.addEventListener('blur', () => {
            this.hideTooltip();
        });
    }
    
    /**
     * 显示提示框
     * @param {HTMLElement} element - 触发提示的元素
     * @param {string} title - 提示标题
     * @param {string} content - 提示内容
     */
    showTooltip(element, title, content) {
        // 清除隐藏定时器
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        // 设置提示内容
        this.tooltipElement.querySelector('.tooltip-title').textContent = title;
        this.tooltipElement.querySelector('.tooltip-content').textContent = content;
        
        // 记录当前活动元素
        this.activeElement = element;
        
        // 定位提示框
        this.positionTooltip(element);
        
        // 显示提示框
        this.tooltipElement.classList.add('show');
    }
    
    /**
     * 隐藏提示框
     */
    hideTooltip() {
        // 设置延迟隐藏，避免鼠标移动到提示框上时闪烁
        this.hideTimeout = setTimeout(() => {
            this.tooltipElement.classList.remove('show');
            this.activeElement = null;
        }, 200);
    }
    
    /**
     * 定位提示框
     * @param {HTMLElement} element - 触发提示的元素
     */
    positionTooltip(element) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        
        // 计算位置
        let top, left;
        
        // 优先显示在元素上方
        top = rect.top - tooltipRect.height - this.offset;
        
        // 如果上方空间不足，则显示在下方
        if (top < 0) {
            top = rect.bottom + this.offset;
        }
        
        // 水平居中
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        
        // 确保不超出视口
        if (left < this.offset) {
            left = this.offset;
        } else if (left + tooltipRect.width > window.innerWidth - this.offset) {
            left = window.innerWidth - tooltipRect.width - this.offset;
        }
        
        // 设置位置
        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
    }
    
    /**
     * 获取分类提示内容
     * @param {string} category - 分类名称
     * @returns {string} 提示内容
     */
    getCategoryTooltipContent(category) {
        const contents = {
            'animals': '包含各种动物名称的单词，如狗、猫、鸟等，共78个单词。',
            'transport': '包含交通工具和地点相关的单词，如汽车、机场、车站等，共72个单词。',
            'body': '包含人体部位和服装相关的单词，如头、手、衣服等，共72个单词。',
            'time': '包含时间、数字和颜色相关的单词，如小时、一、红色等，共71个单词。',
            'fruits': '包含各种水果和蔬菜的单词，如苹果、香蕉、胡萝卜等，共46个单词。',
            'home': '包含家居相关的单词，如房子、厨房、床等，共69个单词。',
            'adjverb': '包含常用形容词和动词，如好的、大的、跑、吃等，共175个单词。',
            'school': '包含学校相关的单词，如教室、老师、书等，共44个单词。',
            'sports': '包含运动和爱好相关的单词，如足球、游泳、画画等，共42个单词。'
        };
        
        return contents[category] || '点击选择此分类进行学习。';
    }
    
    /**
     * 获取游戏模式提示内容
     * @param {string} mode - 游戏模式
     * @returns {string} 提示内容
     */
    getGameModeTooltipContent(mode) {
        const contents = {
            'memory': '在这个模式中，你将逐个学习单词。点击卡片可以查看单词的翻译和例句，然后选择"认识"或"不认识"来记录你的学习进度。',
            'challenge': '在这个模式中，系统会显示单词的中文翻译，你需要输入对应的英文单词。回答正确会增加你的掌握度。',
            'review': '在这个模式中，你将重点复习之前标记为"不认识"的单词，帮助你巩固薄弱环节。'
        };
        
        return contents[mode] || '点击开始游戏。';
    }
    
    /**
     * 获取难度提示内容
     * @param {string} difficulty - 难度名称
     * @returns {string} 提示内容
     */
    getDifficultyTooltipContent(difficulty) {
        const contents = {
            'beginner': '适合英语初学者的100个最基础、最常用的单词。',
            'basic': '包含日常生活中最常用的500个英语单词，适合有一定基础的学习者。',
            'daily': '包含日常交流中常用的1000个单词，适合中级英语学习者。',
            'cet4': '包含大学英语四级考试中的4000个核心单词，适合高级英语学习者。'
        };
        
        return contents[difficulty] || '点击选择此难度级别进行学习。';
    }
}
