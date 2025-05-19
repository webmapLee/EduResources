/**
 * 数学迷宫 - 图像生成模块
 * 使用Canvas生成游戏所需的图像资源
 */

class ImageGenerator {
    constructor() {
        // 创建离屏Canvas用于生成图像
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置默认尺寸
        this.canvas.width = 64;
        this.canvas.height = 64;
        
        // 主题颜色
        this.themeColors = {
            space: {
                background: '#0a0a2a',
                wall: '#5b3cc4',
                path: '#1a1a4a',
                start: '#00e5ff',
                end: '#ff6b9d',
                question: '#ffeb3b',
                accent1: '#9c6bfa',
                accent2: '#ff9dff'
            },
            jungle: {
                background: '#1b4d2e',
                wall: '#2e7d32',
                path: '#4caf50',
                start: '#ffeb3b',
                end: '#ff9800',
                question: '#e91e63',
                accent1: '#81c784',
                accent2: '#aed581'
            },
            underwater: {
                background: '#0a3d62',
                wall: '#0277bd',
                path: '#4fc3f7',
                start: '#00e676',
                end: '#f50057',
                question: '#ffea00',
                accent1: '#80deea',
                accent2: '#26c6da'
            }
        };
    }
    
    /**
     * 生成所有主题的所有图像
     */
    generateAllImages() {
        const themes = ['space', 'jungle', 'underwater'];
        const elements = ['wall', 'path', 'start', 'end', 'question'];
        
        const images = {};
        
        themes.forEach(theme => {
            images[theme] = {};
            
            elements.forEach(element => {
                images[theme][element] = this.generateImage(theme, element);
            });
        });
        
        // 生成背景图像
        images.background = this.generateBackgroundImage();
        
        // 生成主题预览图
        themes.forEach(theme => {
            images[`theme-${theme}`] = this.generateThemePreview(theme);
        });
        
        // 生成角色图像
        images.character = this.generateCharacterImage();
        
        // 生成钥匙图像
        images.key = this.generateKeyImage();
        
        return images;
    }
    
    /**
     * 生成指定主题和元素类型的图像
     * @param {string} theme - 主题名称
     * @param {string} element - 元素类型
     * @returns {HTMLImageElement} - 生成的图像
     */
    generateImage(theme, element) {
        const colors = this.themeColors[theme];
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (element) {
            case 'wall':
                this.generateWallImage(colors);
                break;
            case 'path':
                this.generatePathImage(colors);
                break;
            case 'start':
                this.generateStartImage(colors);
                break;
            case 'end':
                this.generateEndImage(colors);
                break;
            case 'question':
                this.generateQuestionImage(colors);
                break;
        }
        
        // 将Canvas转换为图像
        const image = new Image();
        image.src = this.canvas.toDataURL();
        return image;
    }
    
    /**
     * 生成墙壁图像
     * @param {Object} colors - 主题颜色
     */
    generateWallImage(colors) {
        // 填充背景
        this.ctx.fillStyle = colors.wall;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加纹理
        this.ctx.fillStyle = colors.accent1;
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 8 + 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * 生成路径图像
     * @param {Object} colors - 主题颜色
     */
    generatePathImage(colors) {
        // 填充背景
        this.ctx.fillStyle = colors.path;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加纹理
        this.ctx.fillStyle = colors.accent2;
        this.ctx.globalAlpha = 0.2;
        
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 15 + 5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1.0;
    }
    
    /**
     * 生成起点图像
     * @param {Object} colors - 主题颜色
     */
    generateStartImage(colors) {
        // 填充背景（透明）
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制起点标记（星形）
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const outerRadius = this.canvas.width * 0.4;
        const innerRadius = outerRadius * 0.4;
        const spikes = 5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - outerRadius);
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i;
            const x = centerX + Math.sin(angle) * radius;
            const y = centerY - Math.cos(angle) * radius;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.closePath();
        
        // 填充和描边
        this.ctx.fillStyle = colors.start;
        this.ctx.fill();
        this.ctx.strokeStyle = colors.accent1;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 添加发光效果
        this.ctx.shadowColor = colors.start;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    /**
     * 生成终点图像
     * @param {Object} colors - 主题颜色
     */
    generateEndImage(colors) {
        // 填充背景（透明）
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制终点标记（旗帜）
        const flagpoleX = this.canvas.width * 0.3;
        const flagpoleY1 = this.canvas.height * 0.2;
        const flagpoleY2 = this.canvas.height * 0.8;
        
        // 绘制旗杆
        this.ctx.beginPath();
        this.ctx.moveTo(flagpoleX, flagpoleY1);
        this.ctx.lineTo(flagpoleX, flagpoleY2);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = colors.accent1;
        this.ctx.stroke();
        
        // 绘制旗帜
        this.ctx.beginPath();
        this.ctx.moveTo(flagpoleX, flagpoleY1);
        this.ctx.lineTo(flagpoleX + this.canvas.width * 0.4, flagpoleY1 + this.canvas.height * 0.15);
        this.ctx.lineTo(flagpoleX, flagpoleY1 + this.canvas.height * 0.3);
        this.ctx.closePath();
        
        // 填充旗帜
        this.ctx.fillStyle = colors.end;
        this.ctx.fill();
        
        // 添加发光效果
        this.ctx.shadowColor = colors.end;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // 绘制底座
        this.ctx.beginPath();
        this.ctx.arc(flagpoleX, flagpoleY2, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = colors.accent2;
        this.ctx.fill();
    }
    
    /**
     * 生成问题点图像
     * @param {Object} colors - 主题颜色
     */
    generateQuestionImage(colors) {
        // 填充背景（透明）
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制问号背景圆
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = this.canvas.width * 0.35;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = colors.question;
        this.ctx.fill();
        
        // 绘制问号
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = colors.background;
        this.ctx.fillText('?', centerX, centerY);
        
        // 添加发光效果
        this.ctx.shadowColor = colors.question;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    /**
     * 生成背景图像
     * @returns {HTMLImageElement} - 生成的背景图像
     */
    generateBackgroundImage() {
        // 设置更大的尺寸
        const originalWidth = this.canvas.width;
        const originalHeight = this.canvas.height;
        
        this.canvas.width = 1200;
        this.canvas.height = 800;
        
        // 创建渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a237e');
        gradient.addColorStop(1, '#4a148c');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加星星
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        }
        
        // 添加装饰元素
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 100 + 50;
            const opacity = Math.random() * 0.2 + 0.1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        }
        
        // 将Canvas转换为图像
        const image = new Image();
        image.src = this.canvas.toDataURL();
        
        // 恢复原始尺寸
        this.canvas.width = originalWidth;
        this.canvas.height = originalHeight;
        
        return image;
    }
    
    /**
     * 生成主题预览图像
     * @param {string} theme - 主题名称
     * @returns {HTMLImageElement} - 生成的主题预览图像
     */
    generateThemePreview(theme) {
        const colors = this.themeColors[theme];
        
        // 设置更大的尺寸
        const originalWidth = this.canvas.width;
        const originalHeight = this.canvas.height;
        
        this.canvas.width = 150;
        this.canvas.height = 120;
        
        // 绘制背景
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制迷宫预览
        const cellSize = 15;
        const rows = 6;
        const cols = 8;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * cellSize + 15;
                const y = row * cellSize + 15;
                
                // 绘制路径
                this.ctx.fillStyle = colors.path;
                this.ctx.fillRect(x, y, cellSize, cellSize);
                
                // 随机绘制墙壁
                if (Math.random() > 0.7) {
                    this.ctx.strokeStyle = colors.wall;
                    this.ctx.lineWidth = 2;
                    
                    if (Math.random() > 0.5) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(x + cellSize, y);
                        this.ctx.stroke();
                    } else {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        this.ctx.lineTo(x, y + cellSize);
                        this.ctx.stroke();
                    }
                }
            }
        }
        
        // 绘制起点
        this.ctx.fillStyle = colors.start;
        this.ctx.beginPath();
        this.ctx.arc(30, 30, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制终点
        this.ctx.fillStyle = colors.end;
        this.ctx.beginPath();
        this.ctx.arc(120, 90, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制问题点
        this.ctx.fillStyle = colors.question;
        this.ctx.beginPath();
        this.ctx.arc(75, 60, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 将Canvas转换为图像
        const image = new Image();
        image.src = this.canvas.toDataURL();
        
        // 恢复原始尺寸
        this.canvas.width = originalWidth;
        this.canvas.height = originalHeight;
        
        return image;
    }
    
    /**
     * 生成角色图像
     * @returns {HTMLImageElement} - 生成的角色图像
     */
    generateCharacterImage() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制角色（数学精灵）
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 绘制身体（圆形）
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff9dff';
        this.ctx.fill();
        
        // 绘制眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 7, centerY - 5, 5, 0, Math.PI * 2);
        this.ctx.arc(centerX + 7, centerY - 5, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制眼球
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 7, centerY - 5, 2, 0, Math.PI * 2);
        this.ctx.arc(centerX + 7, centerY - 5, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制微笑
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + 5, 10, 0, Math.PI);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 绘制数学符号光环
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        for (let i = 0; i < 8; i++) {
            this.ctx.rotate(Math.PI / 4);
            this.ctx.fillStyle = '#ffeb3b';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(['=', '+', '-', '×', '÷', '%', '√', '∑'][i], 0, -30);
        }
        
        this.ctx.restore();
        
        // 将Canvas转换为图像
        const image = new Image();
        image.src = this.canvas.toDataURL();
        return image;
    }
    
    /**
     * 生成钥匙图像
     * @returns {HTMLImageElement} - 生成的钥匙图像
     */
    generateKeyImage() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制钥匙
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 绘制钥匙头
        this.ctx.beginPath();
        this.ctx.arc(centerX - 15, centerY, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        this.ctx.strokeStyle = '#daa520';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 绘制钥匙柄
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 5, centerY);
        this.ctx.lineTo(centerX + 20, centerY);
        this.ctx.lineTo(centerX + 20, centerY + 5);
        this.ctx.lineTo(centerX + 15, centerY + 5);
        this.ctx.lineTo(centerX + 15, centerY + 10);
        this.ctx.lineTo(centerX + 20, centerY + 10);
        this.ctx.lineTo(centerX + 20, centerY + 15);
        this.ctx.lineTo(centerX - 5, centerY + 15);
        this.ctx.closePath();
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        this.ctx.strokeStyle = '#daa520';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // 绘制钥匙内部细节
        this.ctx.beginPath();
        this.ctx.arc(centerX - 15, centerY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff8dc';
        this.ctx.fill();
        
        // 添加发光效果
        this.ctx.shadowColor = '#ffd700';
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(centerX - 15, centerY, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // 将Canvas转换为图像
        const image = new Image();
        image.src = this.canvas.toDataURL();
        return image;
    }
    
    /**
     * 将生成的图像添加到DOM中
     * @param {Object} images - 生成的图像对象
     */
    addImagesToDOM(images) {
        // 创建图像容器
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'none';
        document.body.appendChild(imageContainer);
        
        // 确保所有图像都已完全加载
        const allImages = [];
        
        // 添加背景图像
        const backgroundImg = document.createElement('img');
        backgroundImg.src = images.background.src;
        backgroundImg.id = 'background-img';
        imageContainer.appendChild(backgroundImg);
        allImages.push(backgroundImg);
        
        // 添加主题预览图像
        ['space', 'jungle', 'underwater'].forEach(theme => {
            const themeImg = document.createElement('img');
            themeImg.src = images[`theme-${theme}`].src;
            themeImg.id = `theme-${theme}-img`;
            imageContainer.appendChild(themeImg);
            allImages.push(themeImg);
            
            // 更新主题卡片中的图像
            const themeCard = document.querySelector(`.theme-card[data-theme="${theme}"] img`);
            if (themeCard) {
                themeCard.src = themeImg.src;
            }
        });
        
        // 添加角色图像
        const characterImg = document.createElement('img');
        characterImg.src = images.character.src;
        characterImg.id = 'character-img';
        imageContainer.appendChild(characterImg);
        allImages.push(characterImg);
        
        // 更新角色元素中的图像
        const characterElement = document.querySelector('#character img');
        if (characterElement) {
            characterElement.src = characterImg.src;
        }
        
        // 添加钥匙图像
        const keyImg = document.createElement('img');
        keyImg.src = images.key.src;
        keyImg.id = 'key-img';
        imageContainer.appendChild(keyImg);
        allImages.push(keyImg);
        
        // 添加主题元素图像
        ['space', 'jungle', 'underwater'].forEach(theme => {
            ['wall', 'path', 'start', 'end', 'question'].forEach(element => {
                const elementImg = document.createElement('img');
                elementImg.src = images[theme][element].src;
                elementImg.id = `${theme}-${element}-img`;
                imageContainer.appendChild(elementImg);
                allImages.push(elementImg);
            });
        });
        
        // 设置背景图像
        document.body.style.backgroundImage = `url(${images.background.src})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        // 返回一个Promise，当所有图像加载完成时解析
        return new Promise(resolve => {
            let loadedCount = 0;
            const totalImages = allImages.length;
            
            // 如果没有图像需要加载，直接解析
            if (totalImages === 0) {
                resolve();
                return;
            }
            
            // 为每个图像添加加载事件
            allImages.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve();
                    }
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    };
                    
                    img.onerror = () => {
                        console.error(`Failed to load image: ${img.src}`);
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    };
                }
            });
        });
    }
}
