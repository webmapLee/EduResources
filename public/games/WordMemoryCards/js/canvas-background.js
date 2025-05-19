/**
 * Canvas背景动画
 * 参考Movel.jp的设计风格
 */
class CanvasBackground {
    constructor() {
        this.canvas = document.getElementById('canvas-background');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5'];
        this.maxSize = 15;
        this.minSize = 3;
        this.maxSpeed = 0.5;
        this.minSpeed = 0.1;
        this.lastTime = 0;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
        this.isRunning = true;
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 如果已经创建了粒子，重新调整它们的位置
        if (this.particles.length > 0) {
            this.particles.forEach(particle => {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
            });
        }
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.maxSize - this.minSize) + this.minSize,
                speedX: (Math.random() - 0.5) * (this.maxSpeed - this.minSpeed) + this.minSpeed,
                speedY: (Math.random() - 0.5) * (this.maxSpeed - this.minSpeed) + this.minSpeed,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.1,
                rotation: Math.random() * 360
            });
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation * Math.PI / 180);
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        
        // 随机绘制不同形状
        const shapeType = Math.floor(particle.size) % 3;
        
        switch (shapeType) {
            case 0: // 圆形
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 1: // 正方形
                this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                break;
                
            case 2: // 三角形
                this.ctx.beginPath();
                this.ctx.moveTo(0, -particle.size / 2);
                this.ctx.lineTo(particle.size / 2, particle.size / 2);
                this.ctx.lineTo(-particle.size / 2, particle.size / 2);
                this.ctx.closePath();
                this.ctx.fill();
                break;
        }
        
        this.ctx.restore();
    }
    
    updateParticles(deltaTime) {
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.speedX * deltaTime;
            particle.y += particle.speedY * deltaTime;
            
            // 缓慢旋转
            particle.rotation += 0.01 * deltaTime;
            
            // 边界检查
            if (particle.x < -particle.size) {
                particle.x = this.canvas.width + particle.size;
            } else if (particle.x > this.canvas.width + particle.size) {
                particle.x = -particle.size;
            }
            
            if (particle.y < -particle.size) {
                particle.y = this.canvas.height + particle.size;
            } else if (particle.y > this.canvas.height + particle.size) {
                particle.y = -particle.size;
            }
        });
    }
    
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#f0f7ff');
        gradient.addColorStop(1, '#e6f0ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
    }
    
    animate(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.updateParticles(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    stop() {
        this.isRunning = false;
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            this.animate();
        }
    }
}
