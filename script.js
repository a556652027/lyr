// Minimal player control: no confetti / animations / vibration.
let youtubePlayer;

const MUSIC_VIDEO_ID = 'aGlVMnvsSio';
const MUSIC_START_SECONDS = 64;

// Called automatically by the YouTube IFrame API script.
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-player-container', {
        height: '0',
        width: '0',
        videoId: MUSIC_VIDEO_ID,
        playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            start: MUSIC_START_SECONDS
        }
    });
}

function playBirthdayMusic() {
    if (youtubePlayer && typeof youtubePlayer.loadVideoById === 'function') {
        youtubePlayer.loadVideoById({
            videoId: MUSIC_VIDEO_ID,
            startSeconds: MUSIC_START_SECONDS
        });
        return;
    }

    // If clicked before player is ready, retry shortly.
    setTimeout(() => {
        if (youtubePlayer && typeof youtubePlayer.loadVideoById === 'function') {
            youtubePlayer.loadVideoById({
                videoId: MUSIC_VIDEO_ID,
                startSeconds: MUSIC_START_SECONDS
            });
        }
    }, 300);
}
