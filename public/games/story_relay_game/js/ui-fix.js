/**
 * 故事接力棒游戏UI修复模块
 * 修复输入框和按钮的交互问题
 */

(function() {
    /**
     * 修复输入框
     */
    /**
     * 检测是否为移动设备
     */
    function isMobileDevice() {
        return (window.innerWidth <= 768) || 
               (navigator.userAgent.match(/Android/i)) || 
               (navigator.userAgent.match(/webOS/i)) || 
               (navigator.userAgent.match(/iPhone/i)) || 
               (navigator.userAgent.match(/iPad/i)) || 
               (navigator.userAgent.match(/iPod/i)) || 
               (navigator.userAgent.match(/BlackBerry/i)) || 
               (navigator.userAgent.match(/Windows Phone/i));
    }
    
    function fixTextarea() {
        const textarea = document.getElementById('story-continuation');
        if (!textarea) return;
        
        // 移除所有现有的事件监听器
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
        
        // 设置样式和属性
        newTextarea.disabled = false;
        newTextarea.readOnly = false;
        newTextarea.style.pointerEvents = 'auto';
        newTextarea.style.userSelect = 'auto';
        newTextarea.style.webkitUserSelect = 'auto';
        newTextarea.style.mozUserSelect = 'auto';
        newTextarea.style.msUserSelect = 'auto';
        newTextarea.style.backgroundColor = '#fff';
        newTextarea.style.cursor = 'text';
        newTextarea.style.position = 'relative';
        newTextarea.style.zIndex = '100';
        
        // 设置字体大小为16px，防止iOS上自动缩放
        if (isMobileDevice()) {
            newTextarea.style.fontSize = '16px';
            document.body.classList.add('mobile-device');
        }
        
        // 重新添加必要的事件监听器
        newTextarea.addEventListener('click', function(e) {
            e.stopPropagation();
            this.focus();
        });
        
        // 确保键盘事件不会被阻止
        newTextarea.addEventListener('keydown', function(e) {
            e.stopPropagation();
        });
        
        // 移动设备上添加触摸事件
        if (isMobileDevice()) {
            newTextarea.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            });
            
            // 防止iOS上的双击缩放
            newTextarea.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.focus();
            });
        }
        
        // 尝试自动聚焦
        setTimeout(function() {
            newTextarea.focus();
        }, 500);
        
        console.log('输入框已修复');
    }
    
    /**
     * 修复按钮
     */
    function fixButtons() {
        const submitBtn = document.getElementById('submit-btn');
        const passBtn = document.getElementById('pass-btn');
        
        if (!submitBtn || !passBtn) return;
        
        // 移除所有现有的事件监听器
        const newSubmitBtn = submitBtn.cloneNode(true);
        const newPassBtn = passBtn.cloneNode(true);
        
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        passBtn.parentNode.replaceChild(newPassBtn, passBtn);
        
        // 设置样式和属性
        [newSubmitBtn, newPassBtn].forEach(btn => {
            btn.disabled = false;
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.style.opacity = '1';
            btn.style.position = 'relative';
            btn.style.zIndex = '100';
            
            // 移动设备上增强按钮样式
            if (isMobileDevice()) {
                btn.style.width = '100%';
                btn.style.margin = '5px 0';
                btn.style.padding = '12px 15px';
                btn.style.minHeight = '44px'; // 确保触摸目标足够大
            }
        });
        
        // 重新添加点击事件
        newSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('提交按钮被点击');
            
            if (window.gameCore && typeof window.gameCore.submitStory === 'function') {
                window.gameCore.submitStory();
            } else if (typeof window.submitStory === 'function') {
                window.submitStory();
            }
        });
        
        newPassBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('传递按钮被点击');
            
            if (window.gameCore && typeof window.gameCore.passStory === 'function') {
                window.gameCore.passStory();
            } else if (typeof window.passStory === 'function') {
                window.passStory();
            }
        });
        
        // 移动设备上添加触摸事件
        if (isMobileDevice()) {
            [newSubmitBtn, newPassBtn].forEach(btn => {
                btn.addEventListener('touchstart', function(e) {
                    e.stopPropagation();
                });
                
                btn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    this.click();
                });
            });
            
            // 调整按钮容器样式
            const buttonGroup = document.querySelector('.button-group');
            if (buttonGroup) {
                buttonGroup.style.flexDirection = 'column';
                buttonGroup.style.width = '100%';
            }
        }
        
        console.log('按钮已修复');
    }
    
    /**
     * 监听DOM变化，防止输入框和按钮被禁用
     */
    function setupMutationObserver() {
        const textarea = document.getElementById('story-continuation');
        const submitBtn = document.getElementById('submit-btn');
        const passBtn = document.getElementById('pass-btn');
        
        if (!textarea && !submitBtn && !passBtn) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    const target = mutation.target;
                    
                    // 如果输入框被禁用，立即启用它
                    if (target.id === 'story-continuation' && target.disabled) {
                        target.disabled = false;
                    }
                    
                    // 如果游戏已开始且按钮被禁用，启用它们
                    if ((target.id === 'submit-btn' || target.id === 'pass-btn') && 
                        target.disabled && 
                        window.gameCore && 
                        window.gameCore.getElement && 
                        window.gameCore.getElement('participant-list') && 
                        window.gameCore.getElement('participant-list').children.length > 0) {
                        target.disabled = false;
                    }
                }
            });
        });
        
        // 配置观察器
        if (textarea) {
            observer.observe(textarea, { attributes: true });
        }
        
        if (submitBtn) {
            observer.observe(submitBtn, { attributes: true });
        }
        
        if (passBtn) {
            observer.observe(passBtn, { attributes: true });
        }
        
        console.log('DOM变化监听器已设置');
    }
    
    /**
     * 初始化UI修复
     */
    /**
     * 修复移动设备上的布局
     */
    function fixMobileLayout() {
        if (!isMobileDevice()) return;
        
        // 添加移动设备标识类
        document.body.classList.add('mobile-device');
        
        // 调整游戏区域布局
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.style.flexDirection = 'column';
        }
        
        // 调整控制面板布局
        const controls = document.querySelector('.controls');
        if (controls) {
            controls.style.flexDirection = 'column';
            controls.style.alignItems = 'stretch';
        }
        
        // 调整按钮组布局
        const buttonGroup = document.querySelector('.button-group');
        if (buttonGroup) {
            buttonGroup.style.flexDirection = 'column';
            buttonGroup.style.width = '100%';
        }
        
        // 调整添加参与者区域
        const addParticipant = document.querySelector('.add-participant');
        if (addParticipant) {
            addParticipant.style.flexDirection = 'column';
        }
        
        // 调整故事显示区域高度
        const storyDisplay = document.getElementById('story-display');
        if (storyDisplay) {
            storyDisplay.style.maxHeight = '300px';
        }
        
        // 监听屏幕方向变化
        window.addEventListener('orientationchange', function() {
            setTimeout(fixMobileLayout, 300);
        });
        
        console.log('移动设备布局已修复');
    }
    
    function init() {
        // 修复输入框和按钮
        fixTextarea();
        fixButtons();
        
        // 修复移动设备布局
        fixMobileLayout();
        
        // 设置DOM变化监听器
        setupMutationObserver();
        
        // 定期检查UI状态
        setInterval(function() {
            const textarea = document.getElementById('story-continuation');
            const submitBtn = document.getElementById('submit-btn');
            const passBtn = document.getElementById('pass-btn');
            
            if (textarea && textarea.disabled) {
                fixTextarea();
            }
            
            if ((submitBtn && submitBtn.disabled) || (passBtn && passBtn.disabled)) {
                fixButtons();
            }
        }, 2000);
        
        // 监听窗口大小变化
        window.addEventListener('resize', function() {
            if (isMobileDevice()) {
                document.body.classList.add('mobile-device');
                fixMobileLayout();
            } else {
                document.body.classList.remove('mobile-device');
            }
        });
        
        console.log('UI修复模块已初始化');
    }
    
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
    
    // 如果页面已加载，立即初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 100);
    }
})();