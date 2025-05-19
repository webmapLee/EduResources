/**
 * 数学迷宫 - 动画效果模块
 * 负责游戏中的各种动画效果
 */

class Animations {
    constructor() {
        this.keyAnimationElement = document.getElementById('key-animation');
    }
    
    /**
     * 数字粒子汇聚成钥匙的动画
     * @param {Object} startPosition - 起始位置 {x, y}
     * @param {Function} callback - 动画完成后的回调
     */
    numberToKeyAnimation(startPosition, callback) {
        // 清空动画容器
        this.keyAnimationElement.innerHTML = '';
        
        // 设置动画容器位置
        this.keyAnimationElement.style.left = `${startPosition.x - 50}px`;
        this.keyAnimationElement.style.top = `${startPosition.y - 50}px`;
        this.keyAnimationElement.classList.remove('hidden');
        
        // 创建数字粒子
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'number-particle';
            particle.textContent = Math.floor(Math.random() * 10);
            
            // 随机样式
            particle.style.position = 'absolute';
            particle.style.fontSize = `${Math.random() * 16 + 12}px`;
            particle.style.color = this.getRandomColor();
            particle.style.opacity = '0';
            
            // 随机初始位置（围绕中心点）
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            
            this.keyAnimationElement.appendChild(particle);
            particles.push({
                element: particle,
                x,
                y,
                delay: Math.random() * 500
            });
        }
        
        // 创建钥匙元素
        const keyElement = document.createElement('div');
        keyElement.className = 'key';
        
        // 尝试使用生成的钥匙图像
        const keyImg = document.getElementById('key-img');
        if (keyImg) {
            keyElement.innerHTML = `<img src="${keyImg.src}" alt="钥匙">`;
        } else {
            keyElement.innerHTML = '<img src="images/key.png" alt="钥匙">';
        }
        
        keyElement.style.position = 'absolute';
        keyElement.style.left = '50%';
        keyElement.style.top = '50%';
        keyElement.style.transform = 'translate(-50%, -50%) scale(0)';
        keyElement.style.opacity = '0';
        
        this.keyAnimationElement.appendChild(keyElement);
        
        // 执行动画
        setTimeout(() => {
            // 粒子向中心汇聚
            particles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    particle.element.style.opacity = '1';
                    
                    setTimeout(() => {
                        particle.element.style.transform = 'translate(0, 0)';
                        particle.element.style.opacity = '0.8';
                    }, 50);
                    
                    setTimeout(() => {
                        particle.element.style.opacity = '0';
                    }, 600);
                }, particle.delay);
            });
            
            // 钥匙出现
            setTimeout(() => {
                keyElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                keyElement.style.transform = 'translate(-50%, -50%) scale(1)';
                keyElement.style.opacity = '1';
                
                // 钥匙闪烁
                setTimeout(() => {
                    keyElement.style.animation = 'key-glow 1s infinite';
                    
                    // 动画结束
                    setTimeout(() => {
                        this.keyAnimationElement.classList.add('hidden');
                        if (callback) callback();
                    }, 1500);
                }, 500);
            }, 800);
        }, 100);
    }
    
    /**
     * 关卡完成动画
     * @param {Function} callback - 动画完成后的回调
     */
    levelCompleteAnimation(callback) {
        const container = document.createElement('div');
        container.className = 'level-complete-animation';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '1000';
        container.style.pointerEvents = 'none';
        
        document.body.appendChild(container);
        
        // 创建星星
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 随机样式
            star.style.position = 'absolute';
            star.style.width = `${Math.random() * 20 + 10}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = this.getRandomColor();
            star.style.borderRadius = '50%';
            star.style.opacity = '0';
            
            // 随机位置
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            container.appendChild(star);
            
            // 动画
            setTimeout(() => {
                star.style.transition = 'all 0.5s ease-out';
                star.style.opacity = '1';
                star.style.transform = 'scale(1.5)';
                
                setTimeout(() => {
                    star.style.opacity = '0';
                    star.style.transform = 'scale(0.5)';
                }, 500);
            }, Math.random() * 1000);
        }
        
        // 创建完成文字
        const text = document.createElement('div');
        text.className = 'complete-text';
        text.textContent = '关卡完成！';
        text.style.fontSize = '0px';
        text.style.fontWeight = 'bold';
        text.style.color = '#ff6b9d';
        text.style.textShadow = '0 0 10px rgba(255, 107, 157, 0.8)';
        text.style.opacity = '0';
        text.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        container.appendChild(text);
        
        setTimeout(() => {
            text.style.fontSize = '60px';
            text.style.opacity = '1';
            
            setTimeout(() => {
                text.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    text.style.transform = 'scale(1)';
                    
                    setTimeout(() => {
                        container.style.transition = 'all 0.5s ease-out';
                        container.style.opacity = '0';
                        
                        setTimeout(() => {
                            document.body.removeChild(container);
                            if (callback) callback();
                        }, 500);
                    }, 1000);
                }, 200);
            }, 200);
        }, 500);
    }
    
    /**
     * 错误答案动画
     * @param {HTMLElement} element - 要应用动画的元素
     */
    wrongAnswerAnimation(element) {
        element.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    /**
     * 正确答案动画
     * @param {HTMLElement} element - 要应用动画的元素
     */
    correctAnswerAnimation(element) {
        element.style.animation = 'pulse 0.5s';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    /**
     * 获取随机颜色
     * @returns {string} - 随机颜色的十六进制表示
     */
    getRandomColor() {
        const colors = [
            '#ff6b9d', // 粉色
            '#7c4dff', // 紫色
            '#00e5ff', // 青色
            '#ffeb3b', // 黄色
            '#76ff03', // 绿色
            '#ff9800'  // 橙色
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * 添加CSS动画
     */
    addCssAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes key-glow {
                0%, 100% { filter: drop-shadow(0 0 5px gold); }
                50% { filter: drop-shadow(0 0 15px gold); }
            }
            
            .number-particle {
                position: absolute;
                font-weight: bold;
                transform-origin: center;
                transition: all 0.5s ease-out;
            }
            
            .key {
                width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .key img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        `;
        
        document.head.appendChild(style);
    }
}
