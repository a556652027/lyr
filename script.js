function celebrate() {
    // 播放音樂
    playBirthdayMusic();
    
    // 產生彩紙
    createConfetti();
    
    // 震動效果
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
    }
    
    // 按鈕反應
    const btn = document.querySelector('.birthday-btn');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

// YouTube 播放器全域變數
let youtubePlayer;

// 初始化 YouTube IFrame API
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-player-container', {
        height: '0',
        width: '0',
        videoId: 'LZPmiHq8AJE', // 海上花 - 雨晴你
        events: {
            'onReady': onPlayerReady
        },
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'modestbranding': 1
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube 播放器已準備好');
}

// 播放生日音樂
function playBirthdayMusic() {
    if (youtubePlayer && youtubePlayer.playVideo) {
        youtubePlayer.playVideo();
    }
}

// 創建彩紙
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#ff6b9d', '#c06c84', '#6c5ce7', '#a29bfe', '#fd79a8', '#fff', '#ffeb3b'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        
        // 隨機旋轉
        const rotation = Math.random() * 360;
        confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear forwards`;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        confettiContainer.appendChild(confetti);
        
        // 移除元素以節省效能
        setTimeout(() => confetti.remove(), 4000);
    }
}

// 氣球點擊效果
document.querySelectorAll('.balloon').forEach(balloon => {
    balloon.addEventListener('click', function() {
        // 創建小型煙火
        const rect = this.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        createBalloonPop(x, y);
        
        // 氣球消失然後重新出現
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 500);
    });
});

// 氣球爆炸效果
function createBalloonPop(x, y) {
    const colors = ['#ff6b9d', '#c06c84', '#6c5ce7', '#a29bfe', '#fd79a8'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (i / 20) * Math.PI * 2;
        const velocity = 3 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let px = x, py = y;
        let vx_current = vx, vy_current = vy;
        
        const animate = () => {
            px += vx_current;
            py += vy_current;
            vy_current += 0.1; // 重力效果
            
            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            
            if (py < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

// 頁面載入完成後的動畫
window.addEventListener('load', () => {
    // 添加更多初始化效果
    console.log('🎉 生日網站已載入完成！');
});

// 鍵盤快捷鍵 - 按空格鍵也能慶祝
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        celebrate();
    }
});

// 每3秒自動產生一個彩紙
setInterval(() => {
    createMiniConfetti();
}, 3000);

// 製造迷你彩紙
function createMiniConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#ff6b9d', '#c06c84', '#6c5ce7', '#a29bfe', '#fd79a8'];
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = '5px';
        confetti.style.height = '5px';
        confetti.style.animation = `confetti-fall ${3 + Math.random() * 2}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}