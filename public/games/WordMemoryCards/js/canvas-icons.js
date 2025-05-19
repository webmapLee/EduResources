/**
 * Canvas图标绘制
 * 为分类卡片和游戏模式卡片绘制图标
 */
class CanvasIcons {
    constructor() {
        this.icons = {};
        this.initIcons();
    }
    
    /**
     * 初始化所有图标
     */
    initIcons() {
        // 初始化分类图标
        this.initCategoryIcons();
        
        // 初始化游戏模式图标
        this.initGameModeIcons();
    }
    
    /**
     * 初始化分类图标
     */
    initCategoryIcons() {
        const categories = [
            'animals', 'transport', 'body', 'time', 
            'fruits', 'home', 'adjverb', 'school', 'sports'
        ];
        
        categories.forEach(category => {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 80;
            const ctx = canvas.getContext('2d');
            
            // 绘制图标
            this.drawCategoryIcon(ctx, category);
            
            // 保存图标
            this.icons[category] = canvas;
        });
    }
    
    /**
     * 初始化游戏模式图标
     */
    initGameModeIcons() {
        const modes = ['memory', 'challenge', 'review'];
        
        modes.forEach(mode => {
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            
            // 绘制图标
            this.drawGameModeIcon(ctx, mode);
            
            // 保存图标
            this.icons[mode] = canvas;
        });
    }
    
    /**
     * 绘制分类图标
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {string} category - 分类名称
     */
    drawCategoryIcon(ctx, category) {
        ctx.save();
        
        // 通用样式
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 绘制圆形背景
        const gradient = ctx.createLinearGradient(0, 0, 80, 80);
        
        switch (category) {
            case 'animals':
                gradient.addColorStop(0, '#ffecb3');
                gradient.addColorStop(1, '#ffd54f');
                break;
            case 'transport':
                gradient.addColorStop(0, '#b3e5fc');
                gradient.addColorStop(1, '#4fc3f7');
                break;
            case 'body':
                gradient.addColorStop(0, '#f8bbd0');
                gradient.addColorStop(1, '#f48fb1');
                break;
            case 'time':
                gradient.addColorStop(0, '#c5cae9');
                gradient.addColorStop(1, '#7986cb');
                break;
            case 'fruits':
                gradient.addColorStop(0, '#c8e6c9');
                gradient.addColorStop(1, '#81c784');
                break;
            case 'home':
                gradient.addColorStop(0, '#d1c4e9');
                gradient.addColorStop(1, '#9575cd');
                break;
            case 'adjverb':
                gradient.addColorStop(0, '#ffe0b2');
                gradient.addColorStop(1, '#ffb74d');
                break;
            case 'school':
                gradient.addColorStop(0, '#bbdefb');
                gradient.addColorStop(1, '#64b5f6');
                break;
            case 'sports':
                gradient.addColorStop(0, '#b2dfdb');
                gradient.addColorStop(1, '#4db6ac');
                break;
            default:
                gradient.addColorStop(0, '#e0e0e0');
                gradient.addColorStop(1, '#9e9e9e');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(40, 40, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // 根据分类绘制不同的图标
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        
        switch (category) {
            case 'animals':
                // 绘制动物图标（猫）
                ctx.beginPath();
                // 猫耳朵
                ctx.moveTo(25, 25);
                ctx.lineTo(35, 15);
                ctx.lineTo(45, 25);
                ctx.moveTo(35, 55);
                ctx.lineTo(55, 25);
                ctx.lineTo(65, 35);
                // 猫脸
                ctx.moveTo(25, 25);
                ctx.bezierCurveTo(25, 45, 45, 55, 55, 25);
                // 猫胡须
                ctx.moveTo(30, 40);
                ctx.lineTo(20, 38);
                ctx.moveTo(30, 45);
                ctx.lineTo(20, 47);
                ctx.moveTo(50, 40);
                ctx.lineTo(60, 38);
                ctx.moveTo(50, 45);
                ctx.lineTo(60, 47);
                // 猫眼睛
                ctx.moveTo(35, 35);
                ctx.arc(35, 35, 3, 0, Math.PI * 2);
                ctx.moveTo(45, 35);
                ctx.arc(45, 35, 3, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'transport':
                // 绘制交通图标（汽车）
                ctx.beginPath();
                // 车身
                ctx.moveTo(15, 45);
                ctx.lineTo(15, 35);
                ctx.bezierCurveTo(15, 25, 25, 25, 40, 25);
                ctx.bezierCurveTo(55, 25, 65, 25, 65, 35);
                ctx.lineTo(65, 45);
                ctx.lineTo(15, 45);
                // 车轮
                ctx.moveTo(25, 45);
                ctx.arc(25, 45, 5, 0, Math.PI * 2);
                ctx.moveTo(55, 45);
                ctx.arc(55, 45, 5, 0, Math.PI * 2);
                // 车窗
                ctx.moveTo(30, 35);
                ctx.lineTo(50, 35);
                ctx.lineTo(45, 28);
                ctx.lineTo(35, 28);
                ctx.lineTo(30, 35);
                ctx.stroke();
                break;
                
            case 'body':
                // 绘制身体图标（人形）
                ctx.beginPath();
                // 头部
                ctx.arc(40, 25, 10, 0, Math.PI * 2);
                // 身体
                ctx.moveTo(40, 35);
                ctx.lineTo(40, 55);
                // 手臂
                ctx.moveTo(40, 40);
                ctx.lineTo(25, 50);
                ctx.moveTo(40, 40);
                ctx.lineTo(55, 50);
                // 腿部
                ctx.moveTo(40, 55);
                ctx.lineTo(30, 65);
                ctx.moveTo(40, 55);
                ctx.lineTo(50, 65);
                ctx.stroke();
                break;
                
            case 'time':
                // 绘制时间图标（时钟）
                ctx.beginPath();
                // 时钟外圈
                ctx.arc(40, 40, 25, 0, Math.PI * 2);
                // 时钟中心
                ctx.moveTo(43, 40);
                ctx.arc(40, 40, 3, 0, Math.PI * 2);
                // 时针
                ctx.moveTo(40, 40);
                ctx.lineTo(40, 25);
                // 分针
                ctx.moveTo(40, 40);
                ctx.lineTo(50, 40);
                ctx.stroke();
                break;
                
            case 'fruits':
                // 绘制水果图标（苹果）
                ctx.beginPath();
                // 苹果主体
                ctx.arc(40, 45, 20, 0, Math.PI * 2);
                // 苹果茎
                ctx.moveTo(40, 25);
                ctx.lineTo(40, 20);
                ctx.bezierCurveTo(40, 15, 45, 15, 45, 20);
                // 苹果叶子
                ctx.moveTo(40, 25);
                ctx.bezierCurveTo(45, 20, 50, 25, 45, 30);
                ctx.stroke();
                break;
                
            case 'home':
                // 绘制家图标（房子）
                ctx.beginPath();
                // 房子轮廓
                ctx.moveTo(20, 40);
                ctx.lineTo(20, 60);
                ctx.lineTo(60, 60);
                ctx.lineTo(60, 40);
                // 屋顶
                ctx.moveTo(15, 40);
                ctx.lineTo(40, 20);
                ctx.lineTo(65, 40);
                // 门
                ctx.moveTo(35, 60);
                ctx.lineTo(35, 45);
                ctx.lineTo(45, 45);
                ctx.lineTo(45, 60);
                // 窗户
                ctx.moveTo(50, 50);
                ctx.rect(50, 45, 5, 5);
                ctx.stroke();
                break;
                
            case 'adjverb':
                // 绘制形容词和动词图标（书本和笔）
                ctx.beginPath();
                // 书本
                ctx.moveTo(25, 25);
                ctx.lineTo(25, 55);
                ctx.lineTo(55, 55);
                ctx.lineTo(55, 25);
                ctx.lineTo(25, 25);
                // 书页
                ctx.moveTo(40, 25);
                ctx.lineTo(40, 55);
                // 笔
                ctx.moveTo(60, 20);
                ctx.lineTo(45, 35);
                ctx.stroke();
                break;
                
            case 'school':
                // 绘制学校图标（校舍）
                ctx.beginPath();
                // 主体
                ctx.rect(20, 30, 40, 30);
                // 屋顶
                ctx.moveTo(15, 30);
                ctx.lineTo(40, 15);
                ctx.lineTo(65, 30);
                // 门
                ctx.moveTo(35, 60);
                ctx.lineTo(35, 45);
                ctx.lineTo(45, 45);
                ctx.lineTo(45, 60);
                // 旗杆
                ctx.moveTo(55, 30);
                ctx.lineTo(55, 15);
                // 旗帜
                ctx.moveTo(55, 15);
                ctx.lineTo(65, 20);
                ctx.lineTo(55, 25);
                ctx.stroke();
                break;
                
            case 'sports':
                // 绘制运动图标（球）
                ctx.beginPath();
                // 球体
                ctx.arc(40, 40, 20, 0, Math.PI * 2);
                // 球的纹理
                ctx.moveTo(20, 40);
                ctx.bezierCurveTo(30, 30, 50, 30, 60, 40);
                ctx.moveTo(20, 40);
                ctx.bezierCurveTo(30, 50, 50, 50, 60, 40);
                ctx.moveTo(40, 20);
                ctx.bezierCurveTo(30, 30, 30, 50, 40, 60);
                ctx.moveTo(40, 20);
                ctx.bezierCurveTo(50, 30, 50, 50, 40, 60);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制游戏模式图标
     * @param {CanvasRenderingContext2D} ctx - Canvas上下文
     * @param {string} mode - 游戏模式
     */
    drawGameModeIcon(ctx, mode) {
        ctx.save();
        
        // 通用样式
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 绘制圆形背景
        const gradient = ctx.createLinearGradient(0, 0, 60, 60);
        
        switch (mode) {
            case 'memory':
                gradient.addColorStop(0, '#bbdefb');
                gradient.addColorStop(1, '#2196f3');
                break;
            case 'challenge':
                gradient.addColorStop(0, '#ffcdd2');
                gradient.addColorStop(1, '#e57373');
                break;
            case 'review':
                gradient.addColorStop(0, '#c8e6c9');
                gradient.addColorStop(1, '#66bb6a');
                break;
            default:
                gradient.addColorStop(0, '#e0e0e0');
                gradient.addColorStop(1, '#9e9e9e');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(30, 30, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // 根据模式绘制不同的图标
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        
        switch (mode) {
            case 'memory':
                // 绘制记忆模式图标（大脑）
                ctx.beginPath();
                // 大脑轮廓
                ctx.moveTo(20, 30);
                ctx.bezierCurveTo(20, 20, 25, 15, 30, 15);
                ctx.bezierCurveTo(35, 15, 40, 20, 40, 25);
                ctx.bezierCurveTo(45, 20, 50, 25, 45, 35);
                ctx.bezierCurveTo(50, 40, 45, 45, 40, 45);
                ctx.bezierCurveTo(40, 50, 35, 50, 30, 45);
                ctx.bezierCurveTo(25, 50, 20, 45, 20, 40);
                ctx.bezierCurveTo(15, 35, 15, 25, 20, 30);
                // 大脑纹路
                ctx.moveTo(25, 25);
                ctx.bezierCurveTo(30, 20, 35, 25, 30, 30);
                ctx.moveTo(35, 30);
                ctx.bezierCurveTo(40, 25, 45, 30, 40, 35);
                ctx.moveTo(25, 35);
                ctx.bezierCurveTo(30, 30, 35, 35, 30, 40);
                ctx.stroke();
                break;
                
            case 'challenge':
                // 绘制挑战模式图标（奖杯）
                ctx.beginPath();
                // 奖杯杯身
                ctx.moveTo(20, 20);
                ctx.lineTo(20, 35);
                ctx.bezierCurveTo(20, 45, 40, 45, 40, 35);
                ctx.lineTo(40, 20);
                ctx.lineTo(20, 20);
                // 奖杯底座
                ctx.moveTo(25, 45);
                ctx.lineTo(25, 50);
                ctx.lineTo(35, 50);
                ctx.lineTo(35, 45);
                // 奖杯把手
                ctx.moveTo(20, 25);
                ctx.bezierCurveTo(15, 25, 15, 30, 20, 30);
                ctx.moveTo(40, 25);
                ctx.bezierCurveTo(45, 25, 45, 30, 40, 30);
                // 星星
                ctx.moveTo(30, 10);
                ctx.lineTo(32, 15);
                ctx.lineTo(37, 15);
                ctx.lineTo(33, 18);
                ctx.lineTo(35, 23);
                ctx.lineTo(30, 20);
                ctx.lineTo(25, 23);
                ctx.lineTo(27, 18);
                ctx.lineTo(23, 15);
                ctx.lineTo(28, 15);
                ctx.lineTo(30, 10);
                ctx.stroke();
                break;
                
            case 'review':
                // 绘制复习模式图标（循环箭头）
                ctx.beginPath();
                // 循环箭头
                ctx.arc(30, 30, 15, 0, Math.PI * 1.7);
                // 箭头头部
                ctx.moveTo(30, 15);
                ctx.lineTo(35, 20);
                ctx.moveTo(30, 15);
                ctx.lineTo(25, 20);
                // 书本
                ctx.moveTo(25, 30);
                ctx.lineTo(25, 40);
                ctx.lineTo(35, 40);
                ctx.lineTo(35, 30);
                ctx.lineTo(25, 30);
                // 书页
                ctx.moveTo(30, 30);
                ctx.lineTo(30, 40);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    }
    
    /**
     * 将图标添加到DOM元素
     */
    appendIconsToDom() {
        // 添加分类图标
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const category = card.dataset.category;
            if (this.icons[category]) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'category-icon';
                iconContainer.appendChild(this.icons[category]);
                
                const cardBody = card.querySelector('.card-body');
                cardBody.insertBefore(iconContainer, cardBody.firstChild);
            }
        });
        
        // 添加游戏模式图标
        const modeCards = document.querySelectorAll('.game-mode-card');
        modeCards.forEach(card => {
            const mode = card.dataset.mode;
            if (this.icons[mode]) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'mode-icon';
                iconContainer.appendChild(this.icons[mode]);
                
                const cardBody = card.querySelector('.card-body');
                cardBody.insertBefore(iconContainer, cardBody.firstChild);
            }
        });
    }
}
