// Minimal player control: no confetti / animations / vibration.
let youtubePlayer;

// Called automatically by the YouTube IFrame API script.
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-player-container', {
        height: '0',
        width: '0',
        videoId: 'LZPmiHq8AJE', // 海上花 - 雨晴你
        playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1
        }
    });
}

function playBirthdayMusic() {
    if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
        youtubePlayer.playVideo();
        return;
    }

    // If clicked before player is ready, retry shortly.
    setTimeout(() => {
        if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
            youtubePlayer.playVideo();
        }
    }, 300);
}
