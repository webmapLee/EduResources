/**
 * Canvas管理器 - 负责管理游戏中的所有Canvas元素
 */
class CanvasManager {
    constructor() {
        this.canvases = {};
    }
    
    /**
     * 初始化Canvas管理器
     */
    init() {
        // 监听DOM加载完成事件
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCanvasResizeObserver();
        });
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeAllCanvases();
        });
        
        // 监听模态框显示事件
        $(document).on('shown.bs.modal', '.modal', (e) => {
            this.handleModalShown(e.target);
        });
    }
    
    /**
     * 设置Canvas大小变化观察器
     */
    setupCanvasResizeObserver() {
        // 使用ResizeObserver监听元素大小变化
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const container = entry.target;
                    const canvases = container.querySelectorAll('canvas');
                    canvases.forEach(canvas => {
                        this.resizeCanvas(canvas, container);
                    });
                }
            });
            
            // 观察所有可能包含Canvas的容器
            document.querySelectorAll('.modal-body, #game-container').forEach(container => {
                resizeObserver.observe(container);
            });
        }
    }
    
    /**
     * 处理模态框显示事件
     * @param {HTMLElement} modal - 模态框元素
     */
    handleModalShown(modal) {
        console.log('模态框显示:', modal.id);
        
        // 查找模态框中的所有Canvas
        const canvases = modal.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const container = canvas.parentElement;
            this.resizeCanvas(canvas, container);
            
            // 将Canvas添加到管理列表
            this.registerCanvas(canvas);
        });
    }
    
    /**
     * 注册Canvas
     * @param {HTMLCanvasElement} canvas - Canvas元素
     */
    registerCanvas(canvas) {
        if (canvas.id) {
            this.canvases[canvas.id] = canvas;
        } else if (canvas.className) {
            // 使用类名作为标识
            this.canvases[canvas.className] = canvas;
        }
        
        console.log('已注册Canvas:', canvas);
    }
    
    /**
     * 调整Canvas大小
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {HTMLElement} container - 容器元素
     */
    resizeCanvas(canvas, container) {
        if (!canvas) {
            console.error('Canvas元素不存在');
            return;
        }
        
        console.log('调整Canvas大小:', canvas);
        
        // 获取容器大小
        const containerWidth = container ? container.clientWidth : canvas.parentElement.clientWidth;
        const containerHeight = container ? container.clientHeight : canvas.parentElement.clientHeight;
        
        // 设置最小尺寸
        const minWidth = 300;
        const minHeight = 300;
        
        // 计算实际尺寸
        const width = Math.max(containerWidth, minWidth);
        const height = Math.max(containerHeight, minHeight);
        
        console.log(`容器尺寸: ${containerWidth}x${containerHeight}, 设置Canvas尺寸: ${width}x${height}`);
        
        // 设置Canvas尺寸
        canvas.width = width;
        canvas.height = height;
        
        // 确保样式也正确设置
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        // 如果是游戏画布，添加背景色以便于调试
        if (canvas.classList.contains('maze-canvas') || canvas.classList.contains('game-canvas')) {
            canvas.style.backgroundColor = '#f0f0f0';
        }
    }
    
    /**
     * 调整所有已注册Canvas的大小
     */
    resizeAllCanvases() {
        for (const id in this.canvases) {
            const canvas = this.canvases[id];
            const container = canvas.parentElement;
            this.resizeCanvas(canvas, container);
        }
    }
    
    /**
     * 创建新的Canvas
     * @param {HTMLElement} container - 容器元素
     * @param {string} className - Canvas类名
     * @param {string} id - Canvas ID
     * @returns {HTMLCanvasElement} 创建的Canvas元素
     */
    createCanvas(container, className, id = null) {
        // 移除可能存在的旧Canvas
        if (className) {
            const oldCanvas = container.querySelector(`.${className}`);
            if (oldCanvas) {
                container.removeChild(oldCanvas);
            }
        }
        
        // 创建新Canvas
        const canvas = document.createElement('canvas');
        if (className) canvas.className = className;
        if (id) canvas.id = id;
        
        // 添加到容器
        container.appendChild(canvas);
        
        // 调整大小
        this.resizeCanvas(canvas, container);
        
        // 注册Canvas
        this.registerCanvas(canvas);
        
        return canvas;
    }
    
    /**
     * 获取Canvas
     * @param {string} idOrClass - Canvas的ID或类名
     * @returns {HTMLCanvasElement} Canvas元素
     */
    getCanvas(idOrClass) {
        // 首先尝试通过ID查找
        let canvas = document.getElementById(idOrClass);
        
        // 如果没找到，尝试通过类名查找
        if (!canvas) {
            canvas = document.querySelector(`.${idOrClass}`);
        }
        
        // 如果找到了，注册并返回
        if (canvas) {
            this.registerCanvas(canvas);
            return canvas;
        }
        
        console.error(`找不到Canvas: ${idOrClass}`);
        return null;
    }
}
