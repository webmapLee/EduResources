/**
 * 数学迷宫 - 角色控制模块
 * 负责角色移动、动画和交互
 */

class Character {
    constructor(element, maze) {
        this.element = element;
        this.maze = maze;
        
        // 角色位置（网格坐标）
        this.position = {
            row: maze.start.row,
            col: maze.start.col
        };
        
        // 角色像素位置
        this.pixelPosition = {
            x: 0,
            y: 0
        };
        
        // 移动状态
        this.isMoving = false;
        
        // 收集的钥匙数量
        this.keys = 0;
        
        // 角色朝向
        this.direction = 'right';
        
        // 角色动画帧
        this.frame = 0;
        
        // 角色精灵图
        this.sprites = {
            up: [],
            right: [],
            down: [],
            left: []
        };
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化角色
     */
    init() {
        // 加载角色精灵图
        this.loadSprites();
        
        // 设置初始位置
        this.updatePosition();
        
        // 显示角色
        this.element.classList.remove('hidden');
        
        // 设置键盘控制
        this.setupControls();
        
        // 开始动画循环
        this.animate();
    }
    
    /**
     * 加载角色精灵图
     */
    loadSprites() {
        // 尝试从DOM中获取已生成的角色图像
        const characterImg = document.getElementById('character-img');
        
        if (characterImg) {
            // 使用生成的角色图像
            this.element.innerHTML = '';
            const img = document.createElement('img');
            img.src = characterImg.src;
            img.alt = '数学精灵';
            this.element.appendChild(img);
        } else {
            // 如果没有找到生成的图像，使用默认图像
            this.element.innerHTML = '<img src="images/math-sprite.png" alt="数学精灵">';
        }
    }
    
    /**
     * 设置键盘控制
     */
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.isMoving) return;
            
            const newPosition = { ...this.position };
            
            switch (e.key) {
                case 'ArrowUp':
                    newPosition.row--;
                    this.direction = 'up';
                    break;
                case 'ArrowRight':
                    newPosition.col++;
                    this.direction = 'right';
                    break;
                case 'ArrowDown':
                    newPosition.row++;
                    this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    newPosition.col--;
                    this.direction = 'left';
                    break;
                default:
                    return;
            }
            
            this.tryMove(newPosition);
        });
    }
    
    /**
     * 尝试移动到新位置
     * @param {Object} newPosition - 新位置 {row, col}
     */
    tryMove(newPosition) {
        if (this.maze.isValidMove(this.position, newPosition)) {
            this.moveTo(newPosition);
        }
    }
    
    /**
     * 移动到新位置
     * @param {Object} newPosition - 新位置 {row, col}
     */
    moveTo(newPosition) {
        this.isMoving = true;
        
        // 保存旧位置
        const oldPosition = { ...this.position };
        
        // 更新位置
        this.position = newPosition;
        
        // 获取像素位置
        const targetPixelPosition = this.maze.getPixelPosition(newPosition);
        
        // 动画移动
        this.animateMove(targetPixelPosition, () => {
            this.isMoving = false;
            
            // 检查是否到达问题点
            if (this.maze.isQuestionPoint(newPosition)) {
                // 触发问题事件
                const event = new CustomEvent('question-point', {
                    detail: { position: newPosition }
                });
                document.dispatchEvent(event);
            }
            
            // 检查是否到达终点
            if (this.maze.isEndPoint(newPosition)) {
                // 触发终点事件
                const event = new CustomEvent('end-point');
                document.dispatchEvent(event);
            }
        });
    }
    
    /**
     * 动画移动
     * @param {Object} targetPosition - 目标像素位置 {x, y}
     * @param {Function} callback - 移动完成后的回调
     */
    animateMove(targetPosition, callback) {
        const startPosition = { ...this.pixelPosition };
        const distance = {
            x: targetPosition.x - startPosition.x,
            y: targetPosition.y - startPosition.y
        };
        
        const duration = 300; // 移动持续时间（毫秒）
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数使移动更自然
            const easeProgress = this.easeInOutQuad(progress);
            
            this.pixelPosition = {
                x: startPosition.x + distance.x * easeProgress,
                y: startPosition.y + distance.y * easeProgress
            };
            
            this.updateElementPosition();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * 缓动函数
     * @param {number} t - 进度 (0-1)
     * @returns {number} - 缓动后的进度
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    
    /**
     * 更新角色位置
     */
    updatePosition() {
        this.pixelPosition = this.maze.getPixelPosition(this.position);
        this.updateElementPosition();
    }
    
    /**
     * 更新DOM元素位置
     */
    updateElementPosition() {
        this.element.style.transform = `translate(${this.pixelPosition.x}px, ${this.pixelPosition.y}px)`;
    }
    
    /**
     * 角色动画循环
     */
    animate() {
        // 更新角色帧
        this.frame = (this.frame + 1) % 4;
        
        // 更新角色图像
        // 在实际项目中，这里应该根据方向和帧更新角色图像
        
        // 继续动画循环
        requestAnimationFrame(() => this.animate());
    }
    
    /**
     * 收集钥匙
     */
    collectKey() {
        this.keys++;
        
        // 触发钥匙收集事件
        const event = new CustomEvent('key-collected', {
            detail: { keys: this.keys }
        });
        document.dispatchEvent(event);
        
        return this.keys;
    }
    
    /**
     * 重置角色位置到起点
     */
    resetToStart() {
        this.position = {
            row: this.maze.start.row,
            col: this.maze.start.col
        };
        this.updatePosition();
        this.keys = 0;
    }
    
    /**
     * 更新迷宫引用
     * @param {Maze} maze - 新的迷宫实例
     */
    updateMaze(maze) {
        this.maze = maze;
        this.resetToStart();
    }
}
