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

function updateSideNavCursor() {
    const cursor = document.getElementById('sidenav-cursor');
    if (!cursor) return;

    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = doc.clientHeight || window.innerHeight || 0;

    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    const progress = maxScroll === 0 ? 0 : Math.min(1, Math.max(0, scrollTop / maxScroll));

    const topPadding = Number.parseFloat(getComputedStyle(cursor).top) || 0;
    const cursorHeight = cursor.offsetHeight;
    const available = Math.max(0, clientHeight - topPadding * 2 - cursorHeight);
    const translateY = Math.round(progress * available);

    cursor.style.transform = `translateY(${translateY}px)`;
}

let sideNavRafId = null;
function scheduleSideNavCursorUpdate() {
    if (sideNavRafId !== null) return;
    sideNavRafId = window.requestAnimationFrame(() => {
        sideNavRafId = null;
        updateSideNavCursor();
    });
}

window.addEventListener('scroll', scheduleSideNavCursorUpdate, { passive: true });
window.addEventListener('resize', scheduleSideNavCursorUpdate);
scheduleSideNavCursorUpdate();

(function enableSmoothWheelScroll() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const minDeltaForSmoothing = 40;
    const ease = 0.12;

    let isAnimating = false;
    let rafId = null;
    let targetY = window.scrollY;
    let currentY = window.scrollY;

    function getMaxScrollY() {
        const doc = document.documentElement;
        const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
        const clientHeight = doc.clientHeight || window.innerHeight || 0;
        return Math.max(0, scrollHeight - clientHeight);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function step() {
        const maxY = getMaxScrollY();
        targetY = clamp(targetY, 0, maxY);

        currentY += (targetY - currentY) * ease;
        const done = Math.abs(targetY - currentY) < 0.5;
        if (done) currentY = targetY;

        window.scrollTo(0, Math.round(currentY));

        if (!done) {
            rafId = window.requestAnimationFrame(step);
            return;
        }

        isAnimating = false;
        rafId = null;
    }

    function start() {
        if (rafId !== null) return;
        isAnimating = true;
        rafId = window.requestAnimationFrame(step);
    }

    window.addEventListener(
        'wheel',
        (event) => {
            if (!event.cancelable) return;
            if (event.ctrlKey || event.metaKey) return;
            if (Math.abs(event.deltaY) < minDeltaForSmoothing) return;

            event.preventDefault();

            let deltaY = event.deltaY;
            if (event.deltaMode === 1) deltaY *= 16;
            if (event.deltaMode === 2) deltaY *= window.innerHeight;

            if (!isAnimating) {
                currentY = window.scrollY;
                targetY = window.scrollY;
            }

            targetY += deltaY;
            start();
        },
        { passive: false }
    );

    window.addEventListener(
        'scroll',
        () => {
            if (isAnimating) return;
            targetY = window.scrollY;
            currentY = window.scrollY;
        },
        { passive: true }
    );

    window.addEventListener('resize', () => {
        targetY = clamp(targetY, 0, getMaxScrollY());
        if (isAnimating) start();
    });
})();
