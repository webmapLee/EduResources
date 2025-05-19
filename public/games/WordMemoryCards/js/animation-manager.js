/**
 * 动画管理器
 * 负责管理和播放各种动画效果
 */
class AnimationManager {
    constructor() {
        this.animations = {};
        this.loadAnimations();
    }
    
    /**
     * 加载动画资源
     */
    loadAnimations() {
        // 加载成功动画
        this.animations.success = {
            path: 'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json',
            loop: true,
            autoplay: false
        };
        
        // 加载失败动画
        this.animations.failure = {
            path: 'https://assets5.lottiefiles.com/private_files/lf30_4dfb546p.json',
            loop: true,
            autoplay: false
        };
        
        // 加载完成动画
        this.animations.complete = {
            path: 'https://assets9.lottiefiles.com/packages/lf20_9aa9jkph.json',
            loop: false,
            autoplay: false
        };
        
        // 加载学习动画
        this.animations.learning = {
            path: 'https://assets6.lottiefiles.com/packages/lf20_svy4ivvy.json',
            loop: true,
            autoplay: false
        };
        
        // 加载翻转动画
        this.animations.flip = {
            path: 'https://assets1.lottiefiles.com/packages/lf20_obhph3sh.json',
            loop: false,
            autoplay: false
        };
    }
    
    /**
     * 播放动画
     * @param {string} animationName - 动画名称
     * @param {HTMLElement} container - 动画容器
     * @param {Function} onComplete - 动画完成回调
     */
    playAnimation(animationName, container, onComplete = null) {
        console.log(`播放动画: ${animationName}`);
        
        // 检查动画是否存在
        if (!this.animations[animationName]) {
            console.error(`Animation "${animationName}" not found`);
            return null;
        }
        
        // 检查容器是否存在
        if (!container) {
            console.error("动画容器不存在");
            return null;
        }
        
        try {
            // 清空容器
            container.innerHTML = '';
            
            // 创建动画配置
            const animData = {
                container: container,
                renderer: 'svg',
                loop: this.animations[animationName].loop,
                autoplay: true,
                path: this.animations[animationName].path
            };
            
            // 加载并播放动画
            const anim = lottie.loadAnimation(animData);
            
            // 添加完成回调
            if (onComplete && !this.animations[animationName].loop) {
                anim.addEventListener('complete', onComplete);
            }
            
            return anim;
        } catch (error) {
            console.error(`播放动画 "${animationName}" 失败:`, error);
            return null;
        }
    }
    
    /**
     * 播放卡片翻转动画
     * @param {HTMLElement} card - 卡片元素
     * @param {Function} onFlipped - 翻转完成回调
     */
    playCardFlipAnimation(card, onFlipped = null) {
        console.log("播放卡片翻转动画");
        
        // 添加翻转类
        if (card) {
            card.classList.add('flipped');
        } else {
            console.error("卡片元素不存在");
        }
        
        try {
            // 添加翻转音效
            this.playSound('flip');
        } catch (error) {
            console.error("播放翻转音效失败:", error);
        }
        
        // 设置翻转完成回调
        if (onFlipped) {
            setTimeout(onFlipped, 800); // 800ms是翻转动画的持续时间
        }
    }
    
    /**
     * 播放正确答案动画
     * @param {HTMLElement} container - 动画容器
     * @param {Function} onComplete - 动画完成回调
     */
    playCorrectAnimation(container, onComplete = null) {
        // 播放正确音效
        this.playSound('correct');
        
        // 播放正确动画
        return this.playAnimation('success', container, onComplete);
    }
    
    /**
     * 播放错误答案动画
     * @param {HTMLElement} container - 动画容器
     * @param {Function} onComplete - 动画完成回调
     */
    playWrongAnimation(container, onComplete = null) {
        // 播放错误音效
        this.playSound('wrong');
        
        // 播放错误动画
        return this.playAnimation('failure', container, onComplete);
    }
    
    /**
     * 播放完成动画
     * @param {HTMLElement} container - 动画容器
     * @param {Function} onComplete - 动画完成回调
     */
    playCompleteAnimation(container, onComplete = null) {
        // 播放完成音效
        this.playSound('complete');
        
        // 播放完成动画
        return this.playAnimation('complete', container, onComplete);
    }
    
    /**
     * 播放音效
     * @param {string} soundName - 音效名称
     */
    playSound(soundName) {
        try {
            // 音效URL映射
            const soundUrls = {
                'flip': 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3',
                'correct': 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
                'wrong': 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
                'complete': 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
                'click': 'https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3'
            };
            
            // 检查音效是否存在
            if (!soundUrls[soundName]) {
                console.error(`Sound "${soundName}" not found`);
                return;
            }
            
            // 创建音频元素
            const audio = new Audio(soundUrls[soundName]);
            
            // 播放音效
            audio.play().catch(e => {
                console.error('Failed to play sound:', e);
            });
        } catch (error) {
            console.error('播放音效失败:', error);
        }
    }
    
    /**
     * 添加按钮点击音效
     */
    addButtonClickSounds() {
        // 为所有按钮添加点击音效
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.playSound('click');
            });
        });
    }
    
    /**
     * 添加卡片悬停动画
     */
    addCardHoverAnimations() {
        // 为分类卡片添加悬停动画
        document.querySelectorAll('.category-card, .game-mode-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('float');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('float');
            });
        });
    }
}
