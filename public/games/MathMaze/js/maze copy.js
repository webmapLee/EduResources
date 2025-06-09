/**
 * 数学迷宫 - 迷宫生成与渲染模块
 * 负责创建迷宫、渲染迷宫和处理迷宫相关的交互
 */

class Maze {
    constructor(canvas, level = 1, theme = 'space') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.level = level;
        this.theme = theme;
        
        // 迷宫尺寸
        this.rows = 10 + Math.min(5, Math.floor(level / 2)); // 随等级增加行数
        this.cols = 10 + Math.min(5, Math.floor(level / 2)); // 随等级增加列数
        
        // 单元格尺寸
        this.cellSize = 0;
        
        // 迷宫数据
        this.grid = [];
        
        // 起点和终点
        this.start = { row: 0, col: 0 };
        this.end = { row: 0, col: 0 };
        
        // 问题点位置
        this.questionPoints = [];
        
        // 主题颜色
        this.themeColors = {
            space: {
                background: '#0a0a2a',
                wall: '#5b3cc4',
                path: '#1a1a4a',
                start: '#00e5ff',
                end: '#ff6b9d',
                question: '#ffeb3b'
            },
            jungle: {
                background: '#1b4d2e',
                wall: '#2e7d32',
                path: '#4caf50',
                start: '#ffeb3b',
                end: '#ff9800',
                question: '#e91e63'
            },
            underwater: {
                background: '#0a3d62',
                wall: '#0277bd',
                path: '#4fc3f7',
                start: '#00e676',
                end: '#f50057',
                question: '#ffea00'
            }
        };
        
        // 主题图像
        this.images = {
            space: {
                wall: null,
                path: null,
                start: null,
                end: null,
                question: null
            },
            jungle: {
                wall: null,
                path: null,
                start: null,
                end: null,
                question: null
            },
            underwater: {
                wall: null,
                path: null,
                start: null,
                end: null,
                question: null
            }
        };
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化迷宫
     */
    init() {
        // 调整画布大小
        this.resizeCanvas();
        
        // 加载主题图像
        this.loadImages();
        
        // 生成迷宫
        this.generateMaze();
        
        // 添加问题点
        this.addQuestionPoints();
        
        // 渲染迷宫
        this.render();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.render();
        });
    }
    
    /**
     * 调整画布大小
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        
        // 确保容器已加载完毕并有有效尺寸
        if (container.clientWidth === 0) {
            // 如果容器尚未加载完毕，使用requestAnimationFrame等待DOM更新
            requestAnimationFrame(() => this.resizeCanvas());
            return;
        }
        
        const containerWidth = container.clientWidth || 600;
        const containerHeight = container.clientHeight || 600;
        
        // 保持正方形单元格
        this.cellSize = Math.min(
            Math.floor(containerWidth / this.cols),
            Math.floor(containerHeight / this.rows)
        );
        
        // 设置画布大小
        this.canvas.width = this.cellSize * this.cols;
        this.canvas.height = this.cellSize * this.rows;
    }
    
    /**
     * 加载主题图像
     */
    loadImages() {
        const themes = ['space', 'jungle', 'underwater'];
        const elements = ['wall', 'path', 'start', 'end', 'question'];
        
        themes.forEach(theme => {
            elements.forEach(element => {
                // 尝试从DOM中获取已生成的图像
                const imgId = `${theme}-${element}-img`;
                const existingImg = document.getElementById(imgId);
                
                if (existingImg) {
                    this.images[theme][element] = existingImg;
                } else {
                    // 如果没有找到生成的图像，创建新图像
                    const img = new Image();
                    img.src = `images/${theme}/${element}.png`;
                    this.images[theme][element] = img;
                }
            });
        });
    }
    
    /**
     * 生成迷宫
     * 使用深度优先搜索算法生成迷宫
     */
    generateMaze() {
        // 初始化网格
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            const rowArray = [];
            for (let col = 0; col < this.cols; col++) {
                rowArray.push({
                    row,
                    col,
                    walls: { top: true, right: true, bottom: true, left: true },
                    visited: false
                });
            }
            this.grid.push(rowArray);
        }
        
        // 随机选择起点
        this.start.row = 0;
        this.start.col = Math.floor(Math.random() * this.cols);
        
        // 使用深度优先搜索生成迷宫
        const stack = [];
        let current = this.grid[this.start.row][this.start.col];
        current.visited = true;
        
        do {
            const neighbors = this.getUnvisitedNeighbors(current);
            
            if (neighbors.length > 0) {
                // 随机选择一个未访问的邻居
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // 将当前单元格入栈
                stack.push(current);
                
                // 移除当前单元格和下一个单元格之间的墙
                this.removeWall(current, next);
                
                // 移动到下一个单元格
                current = next;
                current.visited = true;
            } else if (stack.length > 0) {
                // 回溯
                current = stack.pop();
            }
        } while (stack.length > 0);
        
        // 设置终点（选择距离起点最远的点）
        let maxDistance = 0;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const distance = Math.abs(row - this.start.row) + Math.abs(col - this.start.col);
                
                if (distance > maxDistance) {
                    maxDistance = distance;
                    this.end.row = row;
                    this.end.col = col;
                }
            }
        }
    }
    
    /**
     * 获取未访问的邻居单元格
     * @param {Object} cell - 当前单元格
     * @returns {Array} - 未访问的邻居单元格数组
     */
    getUnvisitedNeighbors(cell) {
        const { row, col } = cell;
        const neighbors = [];
        
        // 上
        if (row > 0 && !this.grid[row - 1][col].visited) {
            neighbors.push(this.grid[row - 1][col]);
        }
        
        // 右
        if (col < this.cols - 1 && !this.grid[row][col + 1].visited) {
            neighbors.push(this.grid[row][col + 1]);
        }
        
        // 下
        if (row < this.rows - 1 && !this.grid[row + 1][col].visited) {
            neighbors.push(this.grid[row + 1][col]);
        }
        
        // 左
        if (col > 0 && !this.grid[row][col - 1].visited) {
            neighbors.push(this.grid[row][col - 1]);
        }
        
        return neighbors;
    }
    
    /**
     * 移除两个单元格之间的墙
     * @param {Object} current - 当前单元格
     * @param {Object} next - 下一个单元格
     */
    removeWall(current, next) {
        const rowDiff = next.row - current.row;
        const colDiff = next.col - current.col;
        
        // 移除上墙
        if (rowDiff === -1) {
            current.walls.top = false;
            next.walls.bottom = false;
        }
        
        // 移除右墙
        else if (colDiff === 1) {
            current.walls.right = false;
            next.walls.left = false;
        }
        
        // 移除下墙
        else if (rowDiff === 1) {
            current.walls.bottom = false;
            next.walls.top = false;
        }
        
        // 移除左墙
        else if (colDiff === -1) {
            current.walls.left = false;
            next.walls.right = false;
        }
    }
    
    /**
     * 添加问题点
     * 根据等级添加不同数量的问题点
     */
    addQuestionPoints() {
        this.questionPoints = [];
        
        // 根据等级确定问题点数量
        const questionCount = Math.min(3, 1 + Math.floor(this.level / 3));
        
        // 找出所有可用的单元格（不包括起点和终点）
        const availableCells = [];
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if ((row !== this.start.row || col !== this.start.col) && 
                    (row !== this.end.row || col !== this.end.col)) {
                    availableCells.push({ row, col });
                }
            }
        }
        
        // 随机选择问题点
        for (let i = 0; i < questionCount; i++) {
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                this.questionPoints.push(availableCells[randomIndex]);
                availableCells.splice(randomIndex, 1);
            }
        }
    }
    
    /**
     * 渲染迷宫
     */
    render() {
        const colors = this.themeColors[this.theme];
        
        // 清空画布并设置背景色
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制单元格
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.grid[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                
                // 绘制路径
                this.ctx.fillStyle = colors.path;
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                
                // 如果图像已加载，绘制主题图像
                if (this.images[this.theme].path.complete) {
                    this.ctx.drawImage(
                        this.images[this.theme].path,
                        x, y, this.cellSize, this.cellSize
                    );
                }
                
                // 绘制墙壁
                this.ctx.strokeStyle = colors.wall;
                this.ctx.lineWidth = 2;
                
                if (cell.walls.top) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x + this.cellSize, y);
                    this.ctx.stroke();
                }
                
                if (cell.walls.right) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + this.cellSize, y);
                    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.stroke();
                }
                
                if (cell.walls.bottom) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y + this.cellSize);
                    this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
                    this.ctx.stroke();
                }
                
                if (cell.walls.left) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x, y + this.cellSize);
                    this.ctx.stroke();
                }
            }
        }
        
        // 绘制起点
        const startX = this.start.col * this.cellSize;
        const startY = this.start.row * this.cellSize;
        this.ctx.fillStyle = colors.start;
        this.ctx.fillRect(
            startX + this.cellSize * 0.2,
            startY + this.cellSize * 0.2,
            this.cellSize * 0.6,
            this.cellSize * 0.6
        );
        
        // 如果图像已加载，绘制起点图像
        if (this.images[this.theme].start.complete) {
            this.ctx.drawImage(
                this.images[this.theme].start,
                startX, startY, this.cellSize, this.cellSize
            );
        }
        
        // 绘制终点
        const endX = this.end.col * this.cellSize;
        const endY = this.end.row * this.cellSize;
        this.ctx.fillStyle = colors.end;
        this.ctx.fillRect(
            endX + this.cellSize * 0.2,
            endY + this.cellSize * 0.2,
            this.cellSize * 0.6,
            this.cellSize * 0.6
        );
        
        // 如果图像已加载，绘制终点图像
        if (this.images[this.theme].end.complete) {
            this.ctx.drawImage(
                this.images[this.theme].end,
                endX, endY, this.cellSize, this.cellSize
            );
        }
        
        // 绘制问题点
        this.questionPoints.forEach(point => {
            const x = point.col * this.cellSize;
            const y = point.row * this.cellSize;
            
            this.ctx.fillStyle = colors.question;
            this.ctx.beginPath();
            this.ctx.arc(
                x + this.cellSize / 2,
                y + this.cellSize / 2,
                this.cellSize / 4,
                0, Math.PI * 2
            );
            this.ctx.fill();
            
            // 如果图像已加载，绘制问题点图像
            if (this.images[this.theme].question.complete) {
                this.ctx.drawImage(
                    this.images[this.theme].question,
                    x, y, this.cellSize, this.cellSize
                );
            }
        });
    }
    
    /**
     * 检查位置是否有效（没有墙壁阻挡）
     * @param {Object} from - 起始位置 {row, col}
     * @param {Object} to - 目标位置 {row, col}
     * @returns {boolean} - 是否可以移动
     */
    isValidMove(from, to) {
        // 检查是否在网格范围内
        if (to.row < 0 || to.row >= this.rows || to.col < 0 || to.col >= this.cols) {
            return false;
        }
        
        // 检查是否是相邻单元格
        const rowDiff = to.row - from.row;
        const colDiff = to.col - from.col;
        
        if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) {
            return false;
        }
        
        const fromCell = this.grid[from.row][from.col];
        
        // 检查墙壁
        if (rowDiff === -1) { // 向上移动
            return !fromCell.walls.top;
        } else if (colDiff === 1) { // 向右移动
            return !fromCell.walls.right;
        } else if (rowDiff === 1) { // 向下移动
            return !fromCell.walls.bottom;
        } else if (colDiff === -1) { // 向左移动
            return !fromCell.walls.left;
        }
        
        return false;
    }
    
    /**
     * 检查位置是否是问题点
     * @param {Object} position - 位置 {row, col}
     * @returns {boolean} - 是否是问题点
     */
    isQuestionPoint(position) {
        return this.questionPoints.some(point => 
            point.row === position.row && point.col === position.col
        );
    }
    
    /**
     * 检查位置是否是终点
     * @param {Object} position - 位置 {row, col}
     * @returns {boolean} - 是否是终点
     */
    isEndPoint(position) {
        return position.row === this.end.row && position.col === this.end.col;
    }
    
    /**
     * 移除问题点
     * @param {Object} position - 位置 {row, col}
     */
    removeQuestionPoint(position) {
        const index = this.questionPoints.findIndex(point => 
            point.row === position.row && point.col === position.col
        );
        
        if (index !== -1) {
            this.questionPoints.splice(index, 1);
            this.render();
        }
    }
    
    /**
     * 获取像素坐标
     * @param {Object} position - 位置 {row, col}
     * @returns {Object} - 像素坐标 {x, y}
     */
    getPixelPosition(position) {
        return {
            x: position.col * this.cellSize + this.cellSize / 2,
            y: position.row * this.cellSize + this.cellSize / 2
        };
    }
    
    /**
     * 更新迷宫等级
     * @param {number} level - 新等级
     */
    updateLevel(level) {
        this.level = level;
        this.rows = 10 + Math.min(5, Math.floor(level / 2));
        this.cols = 10 + Math.min(5, Math.floor(level / 2));
        
        this.init();
    }
    
    /**
     * 更新迷宫主题
     * @param {string} theme - 新主题
     */
    updateTheme(theme) {
        this.theme = theme;
        this.render();
    }
}
