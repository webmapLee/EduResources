/**
 * 故事接力棒游戏核心功能模块
 * 提供游戏的核心功能和状态管理
 */

// 游戏状态管理
const gameState = {
    participants: [],
    currentParticipantIndex: 0,
    storySegments: [],
    timerInterval: null,
    timeLeft: 180, // 3分钟 = 180秒
    gameStarted: false,
    gameFinished: false,
    votes: {}
};

// DOM 元素缓存
const elements = {};

/**
 * 初始化DOM元素引用
 */
function initElements() {
    const elementIds = [
        'story-display', 'story-continuation', 'participant-list', 
        'new-participant', 'add-participant-btn', 'submit-btn', 
        'pass-btn', 'timer', 'finish-voting', 'voting-results', 
        'complete-story', 'save-story', 'new-game', 'random-story-btn',
        'voting-options'
    ];
    
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    
    elements.votingSection = document.querySelector('.voting-section');
    elements.resultsSection = document.querySelector('.results-section');
}

/**
 * 安全获取DOM元素
 * @param {string} id - 元素ID
 * @returns {HTMLElement|null} - DOM元素或null
 */
function getElement(id) {
    // 如果元素已缓存，直接返回
    if (elements[id]) return elements[id];
    
    // 否则尝试获取并缓存
    const element = document.getElementById(id);
    if (element) elements[id] = element;
    return element;
}

/**
 * 初始化游戏
 */
function initGame() {
    // 初始化DOM元素引用
    initElements();
    
    // 随机选择一个故事开头
    const randomStarter = getRandomStoryStarter();
    
    // 更新页面上的故事开头
    const storyStarterElement = document.querySelector('.story-starter');
    if (storyStarterElement) {
        storyStarterElement.textContent = randomStarter;
    }
    
    // 添加初始故事
    gameState.storySegments.push({
        text: randomStarter,
        author: '老师',
        isStarter: true
    });

    // 设置事件监听器
    setupEventListeners();
    
    // 初始禁用提交和传递按钮，直到有参与者加入
    disableGameButtons();
    
    // 确保故事续写输入框不被禁用
    enableTextarea();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    const addBtn = getElement('add-participant-btn');
    const submitBtn = getElement('submit-btn');
    const passBtn = getElement('pass-btn');
    const finishVotingBtn = getElement('finish-voting');
    const saveStoryBtn = getElement('save-story');
    const newGameBtn = getElement('new-game');
    const randomStoryBtn = getElement('random-story-btn');
    const newParticipant = getElement('new-participant');
    
    if (addBtn) addBtn.addEventListener('click', addParticipant);
    if (submitBtn) submitBtn.addEventListener('click', submitStory);
    if (passBtn) passBtn.addEventListener('click', passStory);
    if (finishVotingBtn) finishVotingBtn.addEventListener('click', showResults);
    if (saveStoryBtn) saveStoryBtn.addEventListener('click', saveStory);
    if (newGameBtn) newGameBtn.addEventListener('click', resetGame);
    if (randomStoryBtn) randomStoryBtn.addEventListener('click', generateRandomStory);
    
    // 按回车键添加参与者
    if (newParticipant) {
        newParticipant.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addParticipant();
            }
        });
    }
}

/**
 * 获取随机故事开头
 * @returns {string} 随机故事开头
 */
function getRandomStoryStarter() {
    // 确保全局变量allStoryStarters存在
    if (typeof allStoryStarters === 'undefined' || !Array.isArray(allStoryStarters) || allStoryStarters.length === 0) {
        return "从前，在一座神秘的森林里，有一棵会说话的大树...";
    }
    
    return allStoryStarters[Math.floor(Math.random() * allStoryStarters.length)];
}

/**
 * 启用文本输入框
 */
function enableTextarea() {
    const textarea = getElement('story-continuation');
    if (textarea) {
        textarea.disabled = false;
        textarea.readOnly = false;
    }
}

/**
 * 禁用游戏按钮
 */
function disableGameButtons() {
    const submitBtn = getElement('submit-btn');
    const passBtn = getElement('pass-btn');
    
    if (submitBtn) submitBtn.disabled = true;
    if (passBtn) passBtn.disabled = true;
}

/**
 * 启用游戏按钮
 */
function enableGameButtons() {
    const submitBtn = getElement('submit-btn');
    const passBtn = getElement('pass-btn');
    
    if (submitBtn) submitBtn.disabled = false;
    if (passBtn) passBtn.disabled = false;
}

/**
 * 添加参与者
 */
function addParticipant() {
    const newParticipant = getElement('new-participant');
    const name = newParticipant ? newParticipant.value.trim() : '';
    
    if (name) {
        // 添加动画效果
        const addButton = getElement('add-participant-btn');
        if (addButton) {
            addButton.innerHTML = '<i class="fas fa-check"></i>';
            addButton.style.backgroundColor = '#28a745';
        }
        
        gameState.participants.push(name);
        updateParticipantList();
        if (newParticipant) newParticipant.value = '';
        
        // 如果这是第一个参与者，启用提交按钮
        if (gameState.participants.length === 1) {
            enableGameButtons();
            startTimer();
            gameState.gameStarted = true;
        }
        
        // 重置按钮样式
        if (addButton) {
            setTimeout(() => {
                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                addButton.style.backgroundColor = '';
            }, 1000);
        }
    }
}

/**
 * 更新参与者列表
 */
function updateParticipantList() {
    const participantList = getElement('participant-list');
    if (!participantList) return;
    
    participantList.innerHTML = '';
    gameState.participants.forEach((participant, index) => {
        const li = document.createElement('li');
        
        if (index === gameState.currentParticipantIndex && !gameState.gameFinished) {
            li.classList.add('current-participant');
            li.innerHTML = `${participant} <i class="fas fa-pen"></i>`;
        } else {
            li.textContent = participant;
        }
        
        participantList.appendChild(li);
    });
}

/**
 * 提交故事片段
 */
function submitStory() {
    // 重新获取textarea元素以确保获取最新内容
    const textarea = document.getElementById('story-continuation');
    const text = textarea ? textarea.value.trim() : '';
    
    if (text && gameState.participants.length > 0) {
        const currentAuthor = gameState.participants[gameState.currentParticipantIndex];
        
        // 添加新的故事片段
        gameState.storySegments.push({
            text: text,
            author: currentAuthor
        });
        
        // 更新故事显示
        updateStoryDisplay();
        
        // 清空输入框
        if (textarea) textarea.value = '';
        
        // 移动到下一个参与者
        moveToNextParticipant();
    } else if (!text) {
        // 如果文本为空，显示提示
        alert('请输入故事内容再提交！');
    } else if (gameState.participants.length === 0) {
        // 如果没有参与者，显示提示
        alert('请先添加参与者！');
    }
}

/**
 * 传递故事接力棒
 */
function passStory() {
    if (gameState.participants.length > 0) {
        // 记录跳过
        gameState.storySegments.push({
            text: '(跳过)',
            author: gameState.participants[gameState.currentParticipantIndex],
            skipped: true
        });
        
        // 移动到下一个参与者
        moveToNextParticipant();
    } else {
        // 如果没有参与者，显示提示
        alert('请先添加参与者！');
    }
}

/**
 * 移动到下一个参与者
 */
function moveToNextParticipant() {
    // 停止当前计时器
    clearInterval(gameState.timerInterval);
    
    // 更新当前参与者索引
    gameState.currentParticipantIndex = (gameState.currentParticipantIndex + 1) % gameState.participants.length;
    
    // 检查是否每个人都至少有一次机会
    if (gameState.storySegments.length >= gameState.participants.length + 1) { // +1 是因为有初始故事
        // 检查是否完成了一轮
        const completedRounds = Math.floor((gameState.storySegments.length - 1) / gameState.participants.length);
        if (completedRounds >= 1) {
            finishGame();
            return;
        }
    }
    
    // 更新参与者列表
    updateParticipantList();
    
    // 重置计时器
    gameState.timeLeft = 180;
    updateTimerDisplay();
    startTimer();
}

/**
 * 更新故事显示
 */
function updateStoryDisplay() {
    const storyDisplay = getElement('story-display');
    if (!storyDisplay) return;
    
    storyDisplay.innerHTML = '';
    
    gameState.storySegments.forEach((segment, index) => {
        const p = document.createElement('p');
        p.classList.add('story-segment');
        
        if (segment.isStarter) {
            p.classList.add('story-starter');
            p.textContent = segment.text;
        } else if (segment.skipped) {
            p.innerHTML = `<span class="author-name"><i class="fas fa-user"></i> ${segment.author}</span>: <em>${segment.text}</em>`;
        } else {
            p.innerHTML = `<span class="author-name"><i class="fas fa-user"></i> ${segment.author}</span>: ${segment.text}`;
        }
        
        // 添加淡入动画，但只对最新添加的段落
        if (index === gameState.storySegments.length - 1 && !segment.isStarter) {
            p.classList.add('fade-in');
        }
        
        storyDisplay.appendChild(p);
    });
    
    // 滚动到底部
    storyDisplay.scrollTop = storyDisplay.scrollHeight;
}

/**
 * 开始计时器
 */
function startTimer() {
    updateTimerDisplay();
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 30) {
            const timer = getElement('timer');
            if (timer) timer.classList.add('timer-warning');
        }
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            passStory();
        }
    }, 1000);
}

/**
 * 更新计时器显示
 */
function updateTimerDisplay() {
    const timer = getElement('timer');
    if (!timer) return;
    
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    timer.innerHTML = `<i class="fas fa-hourglass-half"></i> ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (gameState.timeLeft > 30) {
        timer.classList.remove('timer-warning');
    }
}

/**
 * 完成游戏，开始投票
 */
function finishGame() {
    gameState.gameFinished = true;
    clearInterval(gameState.timerInterval);
    
    // 禁用按钮但保持输入框可用
    disableGameButtons();
    
    // 显示投票区域
    setupVoting();
    
    const votingSection = getElement('votingSection');
    if (votingSection) {
        // 添加过渡动画
        votingSection.style.opacity = '0';
        votingSection.style.display = 'block';
        
        // 淡入动画
        setTimeout(() => {
            votingSection.style.opacity = '1';
        }, 50);
    }
    
    // 禁用完成投票按钮，直到选择了一个选项
    const finishVotingBtn = getElement('finish-voting');
    if (finishVotingBtn) finishVotingBtn.disabled = true;
    
    // 添加烟花效果
    createFireworks();
}

/**
 * 设置投票
 */
function setupVoting() {
    const votingOptions = getElement('voting-options');
    if (!votingOptions) return;
    
    votingOptions.innerHTML = '';
    
    // 过滤掉跳过的片段和初始故事
    const validSegments = gameState.storySegments.filter(segment => !segment.skipped && !segment.isStarter);
    
    // 为每个有效的故事片段创建投票卡片
    validSegments.forEach((segment, index) => {
        const card = document.createElement('div');
        card.classList.add('vote-card');
        card.dataset.index = index;
        
        card.innerHTML = `
            <h4><i class="fas fa-feather"></i> ${segment.author}</h4>
            <p>${segment.text.length > 100 ? segment.text.substring(0, 100) + '...' : segment.text}</p>
        `;
        
        card.addEventListener('click', function() {
            // 移除其他卡片的选中状态
            document.querySelectorAll('.vote-card').forEach(c => c.classList.remove('selected'));
            // 添加当前卡片的选中状态
            this.classList.add('selected');
            // 记录投票
            gameState.votes.selectedIndex = index;
            gameState.votes.selectedAuthor = segment.author;
            gameState.votes.selectedText = segment.text;
            
            // 启用完成投票按钮
            const finishVotingBtn = getElement('finish-voting');
            if (finishVotingBtn) finishVotingBtn.disabled = false;
        });
        
        votingOptions.appendChild(card);
    });
}

/**
 * 显示结果
 */
function showResults() {
    const votingSection = getElement('votingSection');
    const resultsSection = getElement('resultsSection');
    
    // 添加过渡动画
    if (votingSection) votingSection.style.opacity = '0';
    
    setTimeout(() => {
        if (votingSection) votingSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'block';
        
        // 淡入动画
        setTimeout(() => {
            if (resultsSection) resultsSection.style.opacity = '1';
        }, 50);
        
        // 显示投票结果
        const votingResults = getElement('voting-results');
        if (votingResults) {
            if (gameState.votes.selectedAuthor) {
                votingResults.innerHTML = `
                    <div class="result-item winner">
                        <span>最佳创意奖: ${gameState.votes.selectedAuthor}</span>
                    </div>
                    <div class="winning-segment">
                        <p><em>"${gameState.votes.selectedText}"</em></p>
                    </div>
                `;
            } else {
                votingResults.innerHTML = '<p>没有投票结果</p>';
            }
        }
        
        // 显示完整故事
        const completeStory = getElement('complete-story');
        if (completeStory) {
            completeStory.innerHTML = '';
            gameState.storySegments.forEach(segment => {
                if (!segment.skipped) {
                    const p = document.createElement('p');
                    p.textContent = segment.text;
                    completeStory.appendChild(p);
                }
            });
        }
    }, 300);
}

/**
 * 保存故事
 */
function saveStory() {
    // 创建完整故事文本
    let storyText = '故事接力棒 - 创意写作游戏\n\n';
    storyText += '完整故事:\n\n';
    
    gameState.storySegments.forEach(segment => {
        if (!segment.skipped) {
            storyText += segment.text + '\n\n';
        }
    });
    
    storyText += '\n参与者:\n';
    gameState.participants.forEach(participant => {
        storyText += '- ' + participant + '\n';
    });
    
    if (gameState.votes.selectedAuthor) {
        storyText += '\n最佳创意奖: ' + gameState.votes.selectedAuthor;
    }
    
    // 创建Blob对象
    const blob = new Blob([storyText], { type: 'text/plain' });
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '故事接力棒_' + new Date().toISOString().slice(0, 10) + '.txt';
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * 重置游戏
 */
function resetGame() {
    // 重置游戏状态
    gameState.participants = [];
    gameState.currentParticipantIndex = 0;
    
    // 随机选择一个新的故事开头
    const randomStarter = getRandomStoryStarter();
    
    gameState.storySegments = [{
        text: randomStarter,
        author: '老师',
        isStarter: true
    }];
    
    // 更新页面上的故事开头
    const storyStarterElement = document.querySelector('.story-starter');
    if (storyStarterElement) {
        storyStarterElement.textContent = randomStarter;
    }
    
    gameState.timeLeft = 180;
    gameState.gameStarted = false;
    gameState.gameFinished = false;
    gameState.votes = {};
    
    // 重置UI
    const textarea = getElement('story-continuation');
    if (textarea) {
        textarea.disabled = false;
        textarea.value = '';
    }
    
    disableGameButtons();
    
    const votingSection = getElement('votingSection');
    const resultsSection = getElement('resultsSection');
    
    if (votingSection) votingSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    
    // 更新显示
    updateStoryDisplay();
    updateParticipantList();
    updateTimerDisplay();
    
    // 清除计时器
    clearInterval(gameState.timerInterval);
}

/**
 * 生成随机故事
 */
function generateRandomStory() {
    // 随机选择一个故事开头
    const randomStarter = getRandomStoryStarter();
    
    // 更新页面上的故事开头
    const storyStarterElement = document.querySelector('.story-starter');
    if (storyStarterElement) {
        storyStarterElement.textContent = randomStarter;
    }
    
    // 更新游戏状态中的初始故事
    if (gameState.storySegments.length > 0 && gameState.storySegments[0].isStarter) {
        gameState.storySegments[0].text = randomStarter;
    } else {
        gameState.storySegments = [{
            text: randomStarter,
            author: '老师',
            isStarter: true
        }];
    }
    
    // 更新故事显示
    updateStoryDisplay();
}

/**
 * 添加烟花效果
 */
function createFireworks() {
    const fireworks = document.createElement('div');
    fireworks.className = 'fireworks';
    document.body.appendChild(fireworks);
    
    // 创建多个烟花
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            
            // 随机位置
            const left = Math.random() * 100;
            const top = 40 + Math.random() * 30;
            
            firework.style.left = `${left}%`;
            firework.style.top = `${top}%`;
            
            // 随机颜色
            const hue = Math.floor(Math.random() * 360);
            firework.style.setProperty('--hue', hue);
            
            fireworks.appendChild(firework);
            
            // 爆炸后移除
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 300);
    }
    
    // 移除烟花容器
    setTimeout(() => {
        fireworks.remove();
    }, 3000);
}

/**
 * 添加故事开头的魔法效果
 */
function addMagicToStoryStarter() {
    const storyStarter = document.querySelector('.story-starter');
    if (storyStarter) {
        // 添加闪烁的星星
        const starsCount = 3;
        for (let i = 0; i < starsCount; i++) {
            const star = document.createElement('span');
            star.className = 'magic-star';
            star.innerHTML = '✨';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            storyStarter.appendChild(star);
        }
    }
}

/**
 * 播放音效
 * @param {string} type - 音效类型
 */
function playSound(type) {
    // 如果浏览器支持，可以添加简单的音效
    if (window.AudioContext || window.webkitAudioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'magic') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(493.88, audioCtx.currentTime); // B4
            oscillator.frequency.exponentialRampToValueAtTime(987.77, audioCtx.currentTime + 0.2); // B5
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'submit') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.1); // G5
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
        }
    }
}

// 导出公共方法
window.gameCore = {
    initGame,
    addParticipant,
    submitStory,
    passStory,
    updateStoryDisplay,
    generateRandomStory,
    saveStory,
    resetGame,
    addMagicToStoryStarter,
    playSound,
    getElement
};

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // 添加魔法效果到故事开头
    setTimeout(addMagicToStoryStarter, 500);
    
    // 添加页面加载动画
    document.body.classList.add('page-loaded');
});