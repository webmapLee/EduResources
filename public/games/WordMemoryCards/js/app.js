/**
 * 应用主入口
 */
$(document).ready(function() {
    console.log("应用初始化开始");
    
    // 初始化Canvas背景
    try {
        const canvasBackground = new CanvasBackground();
        console.log("Canvas背景初始化完成");
    } catch (error) {
        console.error("Canvas背景初始化失败:", error);
    }
    
    // 初始化数据管理器
    const dataManager = new DataManager();
    
    // 初始化用户进度管理器
    const userProgress = new UserProgress(dataManager);
    
    // 初始化动画管理器
    const animationManager = new AnimationManager();
    
    // 初始化游戏引擎
    const gameEngine = new GameEngine(dataManager, userProgress, animationManager);
    
    // 加载数据
    dataManager.init().then(() => {
        console.log("数据加载完成，初始化界面");
        
        // 初始化用户进度
        userProgress.init();
        
        try {
            // 初始化Canvas图标
            const canvasIcons = new CanvasIcons();
            canvasIcons.appendIconsToDom();
            console.log("Canvas图标初始化完成");
        } catch (error) {
            console.error("Canvas图标初始化失败:", error);
        }
        
        try {
            // 初始化提示框管理器
            const tooltipManager = new TooltipManager();
            console.log("提示框管理器初始化完成");
        } catch (error) {
            console.error("提示框管理器初始化失败:", error);
        }
        
        try {
            // 添加按钮点击音效
            animationManager.addButtonClickSounds();
            console.log("按钮点击音效添加完成");
            
            // 添加卡片悬停动画
            animationManager.addCardHoverAnimations();
            console.log("卡片悬停动画添加完成");
        } catch (error) {
            console.error("添加动画效果失败:", error);
        }
        
        // 绑定事件
        bindEvents();
        
        // 显示欢迎提示
        showWelcomeTooltip();
        
        // 如果有调试助手，检查单词数据
        if (window.debugHelper) {
            window.debugHelper.checkWordData(dataManager);
            
            // 如果数据不足，模拟单词数据
            const allWords = dataManager.getAllWords();
            let hasEmptyCategory = false;
            
            for (const type in allWords) {
                for (const category in allWords[type]) {
                    if (allWords[type][category].length === 0) {
                        hasEmptyCategory = true;
                        break;
                    }
                }
            }
            
            if (hasEmptyCategory) {
                console.warn("检测到部分分类没有单词数据，将创建模拟数据");
                window.debugHelper.mockWordData(dataManager);
            }
        }
    }).catch(error => {
        console.error('初始化失败:', error);
        showErrorMessage('加载数据失败，请刷新页面重试。');
    });
    
    /**
     * 绑定界面事件
     */
    function bindEvents() {
        console.log("绑定界面事件");
        
        // 难度分类点击事件
        $('.difficulty-list .list-group-item').on('click', function() {
            $('.difficulty-list .list-group-item').removeClass('active');
            $(this).addClass('active');
            
            // 取消主题分类的选择
            $('.category-card').removeClass('active');
            
            const category = $(this).data('category');
            console.log('选择难度分类:', category);
            
            // 添加选择动画
            $(this).addClass('pulse');
            setTimeout(() => {
                $(this).removeClass('pulse');
            }, 1000);
        });
        
        // 主题分类点击事件
        $('.category-card').on('click', function() {
            $('.category-card').removeClass('active');
            $(this).addClass('active');
            
            // 取消难度分类的选择
            $('.difficulty-list .list-group-item').removeClass('active');
            
            const category = $(this).data('category');
            console.log('选择主题分类:', category);
            
            // 添加选择动画
            $(this).addClass('pulse');
            setTimeout(() => {
                $(this).removeClass('pulse');
            }, 1000);
        });
        
        // 开始游戏按钮点击事件
        $('.start-game').on('click', function() {
            const mode = $(this).data('mode');
            let type, category;
            
            // 检查是否选择了分类
            const activeCategory = $('.category-card.active');
            const activeDifficulty = $('.difficulty-list .list-group-item.active');
            
            if (activeCategory.length > 0) {
                type = 'topic';
                category = activeCategory.data('category');
            } else if (activeDifficulty.length > 0) {
                type = 'difficulty';
                category = activeDifficulty.data('category');
            } else {
                showErrorMessage('请先选择一个单词分类');
                return;
            }
            
            console.log('开始游戏:', mode, type, category);
            
            try {
                // 初始化游戏
                const result = gameEngine.initGame(mode, type, category);
                
                if (result) {
                    // 显示游戏模态框
                    const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
                    gameModal.show();
                } else {
                    showErrorMessage('游戏初始化失败，请重试');
                }
            } catch (error) {
                console.error('游戏初始化出错:', error);
                showErrorMessage('游戏初始化出错: ' + error.message);
            }
        });
        
        // 下一个单词按钮点击事件
        $('#next-word').on('click', function() {
            try {
                // 根据当前游戏模式执行不同操作
                if (gameEngine.currentMode === 'challenge') {
                    // 在挑战模式中，点击"检查答案"按钮会自动进入下一个单词
                    $('.btn-check-answer').click();
                } else {
                    // 在记忆模式中，如果卡片已翻转，标记为认识，否则翻转卡片
                    const wordCard = $('.word-card');
                    if (wordCard.length > 0) {
                        if (wordCard.hasClass('flipped')) {
                            $('.btn-know').click();
                        } else {
                            animationManager.playCardFlipAnimation(wordCard[0]);
                        }
                    } else {
                        console.error("找不到单词卡片元素");
                    }
                }
            } catch (error) {
                console.error('处理下一个单词时出错:', error);
            }
        });
        
        // 重置进度按钮点击事件
        $('#reset-progress').on('click', function() {
            showConfirmDialog(
                '重置学习进度',
                '确定要重置所有学习进度吗？这将删除您的所有学习记录。',
                () => {
                    userProgress.resetProgress();
                    showSuccessMessage('学习进度已重置');
                }
            );
        });
        
        // 游戏模态框关闭事件
        $('#gameModal').on('hidden.bs.modal', function() {
            // 更新进度
            userProgress.updateProgress();
        });
        
        // 键盘事件
        $(document).on('keydown', function(e) {
            // 如果游戏模态框打开
            if ($('#gameModal').hasClass('show')) {
                // 空格键翻转卡片或进入下一个单词
                if (e.keyCode === 32) { // 空格键
                    e.preventDefault();
                    $('#next-word').click();
                }
                // 右箭头键进入下一个单词
                else if (e.keyCode === 39) { // 右箭头
                    e.preventDefault();
                    if (gameEngine.currentMode === 'memory') {
                        $('.btn-know').click();
                    } else if (gameEngine.currentMode === 'challenge') {
                        $('.btn-check-answer').click();
                    }
                }
                // 左箭头键标记为不认识
                else if (e.keyCode === 37) { // 左箭头
                    e.preventDefault();
                    if (gameEngine.currentMode === 'memory') {
                        $('.btn-dont-know').click();
                    }
                }
                // 回车键检查答案
                else if (e.keyCode === 13) { // 回车键
                    if (gameEngine.currentMode === 'challenge') {
                        e.preventDefault();
                        $('.btn-check-answer').click();
                    }
                }
            }
        });
    }
    
    /**
     * 显示欢迎提示
     */
    function showWelcomeTooltip() {
        setTimeout(() => {
            showInfoMessage(
                '欢迎使用单词记忆卡片游戏',
                '请选择一个单词分类和游戏模式开始学习。鼠标悬停在各个元素上可以查看更多信息。'
            );
        }, 1000);
    }
    
    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    function showErrorMessage(message) {
        console.error(message);
        alert(message);
    }
    
    /**
     * 显示成功消息
     * @param {string} message - 成功消息
     */
    function showSuccessMessage(message) {
        console.info(message);
        alert(message);
    }
    
    /**
     * 显示信息消息
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     */
    function showInfoMessage(title, message) {
        console.info(title + ': ' + message);
        
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = 'info-message';
        messageElement.innerHTML = `
            <div class="info-message-content">
                <h4>${title}</h4>
                <p>${message}</p>
                <button class="btn btn-sm btn-primary">我知道了</button>
            </div>
        `;
        
        // 添加样式
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translateX(-50%)';
        messageElement.style.backgroundColor = 'white';
        messageElement.style.borderRadius = '10px';
        messageElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        messageElement.style.padding = '20px';
        messageElement.style.zIndex = '9999';
        messageElement.style.maxWidth = '400px';
        messageElement.style.width = '90%';
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.3s ease';
        
        // 添加到页面
        document.body.appendChild(messageElement);
        
        // 显示消息
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 100);
        
        // 绑定关闭事件
        messageElement.querySelector('button').addEventListener('click', () => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        });
    }
    
    /**
     * 显示确认对话框
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {Function} onConfirm - 确认回调
     */
    function showConfirmDialog(title, message, onConfirm) {
        if (confirm(message)) {
            onConfirm();
        }
    }
});
    // 初始化Canvas管理器
    const canvasManager = new CanvasManager();
    canvasManager.init();
