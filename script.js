(() => {
    const { createApp, nextTick, onBeforeUnmount, onMounted, ref } = Vue;

    const MUSIC_VIDEO_ID = 'aGlVMnvsSio';
    const MUSIC_START_SECONDS = 64;

    function useYouTubePlayer() {
        let player = null;
        let isReady = false;
        let pendingPlay = false;

        function play() {
            if (isReady && player && typeof player.loadVideoById === 'function') {
                pendingPlay = false;
                player.loadVideoById({
                    videoId: MUSIC_VIDEO_ID,
                    startSeconds: MUSIC_START_SECONDS
                });
                return;
            }

            pendingPlay = true;
        }

        window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player('youtube-player-container', {
                height: '0',
                width: '0',
                videoId: MUSIC_VIDEO_ID,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    modestbranding: 1,
                    start: MUSIC_START_SECONDS
                },
                events: {
                    onReady: () => {
                        isReady = true;
                        if (pendingPlay) play();
                    }
                }
            });
        };

        return { play };
    }

    function useSmoothWheelScroll() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return () => {};
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

        function stop() {
            if (rafId === null) return;
            window.cancelAnimationFrame(rafId);
            rafId = null;
            isAnimating = false;
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

            rafId = null;
            isAnimating = false;
        }

        function start() {
            if (rafId !== null) return;
            isAnimating = true;
            rafId = window.requestAnimationFrame(step);
        }

        function onWheel(event) {
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
        }

        function onScroll() {
            if (isAnimating) return;
            targetY = window.scrollY;
            currentY = window.scrollY;
        }

        function onResize() {
            targetY = clamp(targetY, 0, getMaxScrollY());
            if (isAnimating) start();
        }

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            stop();
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }

    const SideNavCursor = {
        template: '<div ref="cursorEl" class="sidenav-cursor" aria-hidden="true"></div>',
        setup() {
            const cursorEl = ref(null);
            let rafId = null;

            function update() {
                const cursor = cursorEl.value;
                if (!cursor) return;

                const doc = document.documentElement;
                const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
                const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
                const clientHeight = doc.clientHeight || window.innerHeight || 0;

                const maxScroll = Math.max(0, scrollHeight - clientHeight);
                const isAtBottom = maxScroll > 0 && scrollTop >= maxScroll - 2;

                if (isAtBottom) {
                    cursor.classList.add('is-at-bottom');
                    cursor.style.transform = '';
                    return;
                }

                cursor.classList.remove('is-at-bottom');
                const progress = maxScroll === 0 ? 0 : Math.min(1, Math.max(0, scrollTop / maxScroll));

                const topPadding = Number.parseFloat(getComputedStyle(cursor).top) || 0;
                const cursorHeight = cursor.offsetHeight;
                const available = Math.max(0, clientHeight - topPadding * 2 - cursorHeight);
                const translateY = Math.round(progress * available);

                cursor.style.transform = `translateY(${translateY}px)`;
            }

            function schedule() {
                if (rafId !== null) return;
                rafId = window.requestAnimationFrame(() => {
                    rafId = null;
                    update();
                });
            }

            function onScroll() {
                schedule();
            }

            function onResize() {
                schedule();
            }

            onMounted(() => {
                window.addEventListener('scroll', onScroll, { passive: true });
                window.addEventListener('resize', onResize);
                schedule();
            });

            onBeforeUnmount(() => {
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onResize);
                if (rafId !== null) window.cancelAnimationFrame(rafId);
            });

            return { cursorEl };
        }
    };

    const KuromiLeftPop = {
        props: {
            visible: { type: Boolean, default: false }
        },
        template: `
            <div
                class="kuromi-left-pop"
                :class="{ 'is-visible': visible }"
                aria-hidden="true"
            ></div>
        `
    };

    const KuromiRightPop = {
        props: {
            visible: { type: Boolean, default: false }
        },
        template: `
            <div
                class="kuromi-right-pop"
                :class="{ 'is-visible': visible }"
                aria-hidden="true"
            ></div>
        `
    };

    const HeroSection = {
        emits: ['play'],
        template: `
            <section class="hero">
                <header class="header">
                    <h1 class="title">賴彥蓉<br>生日快樂</h1>
                </header>
                <main class="content">
                    <button class="birthday-btn" type="button" @click="$emit('play')">播放音樂</button>
                </main>
            </section>
        `
    };

    const TestContent = {
        setup() {
            const items = [
                {
                    title: '測試內容 1',
                    subtitle: '往下捲動，右側 Kuromi 導覽游標會跟著上下移動。'
                },
                { title: '測試內容 2' },
                { title: '測試內容 3' },
                { title: '測試內容 4' },
                { title: '測試內容 5' },
                { title: '測試內容 6' },
                { title: '測試內容 7' },
                { title: '測試內容 8' },
                { title: '測試內容 9' },
                { title: '測試內容 10' }
            ];
            return { items };
        },
        template: `
            <section class="test-content" aria-label="測試內容">
                <div
                    v-for="(item, index) in items"
                    :key="item.title"
                    class="message-box"
                >
                    <span
                        v-if="index === 1"
                        class="popup-trigger-anchor"
                        data-kuromi-left-anchor="test2"
                        aria-hidden="true"
                    ></span>
                    <span
                        v-if="index === 5"
                        class="popup-trigger-anchor"
                        data-kuromi-right-anchor="test6"
                        aria-hidden="true"
                    ></span>
                    <p>{{ item.title }}</p>
                    <p v-if="item.subtitle" class="message-sub">{{ item.subtitle }}</p>
                </div>
            </section>
        `
    };

    const App = {
        components: { HeroSection, KuromiLeftPop, KuromiRightPop, SideNavCursor, TestContent },
        setup() {
            const { play } = useYouTubePlayer();
            const isKuromiLeftVisible = ref(false);
            const isKuromiRightVisible = ref(false);
            let cleanupSmoothScroll = () => {};
            let kuromiLeftObserver = null;
            let kuromiRightObserver = null;

            function cleanupKuromiLeftObserver() {
                if (!kuromiLeftObserver) return;
                kuromiLeftObserver.disconnect();
                kuromiLeftObserver = null;
            }

            function setupKuromiLeftObserver() {
                cleanupKuromiLeftObserver();

                const triggerEl = document.querySelector('[data-kuromi-left-anchor="test2"]');
                if (!triggerEl) return;
                if (typeof IntersectionObserver !== 'function') return;

                kuromiLeftObserver = new IntersectionObserver(
                    (entries) => {
                        const entry = entries[0];
                        isKuromiLeftVisible.value = Boolean(entry && entry.isIntersecting);
                    },
                    {
                        root: null,
                        rootMargin: '-35% 0px -35% 0px',
                        threshold: 0
                    }
                );

                kuromiLeftObserver.observe(triggerEl);
            }

            function cleanupKuromiRightObserver() {
                if (!kuromiRightObserver) return;
                kuromiRightObserver.disconnect();
                kuromiRightObserver = null;
            }

            function setupKuromiRightObserver() {
                cleanupKuromiRightObserver();

                const triggerEl = document.querySelector('[data-kuromi-right-anchor="test6"]');
                if (!triggerEl) return;
                if (typeof IntersectionObserver !== 'function') return;

                kuromiRightObserver = new IntersectionObserver(
                    (entries) => {
                        const entry = entries[0];
                        isKuromiRightVisible.value = Boolean(entry && entry.isIntersecting);
                    },
                    {
                        root: null,
                        rootMargin: '-35% 0px -35% 0px',
                        threshold: 0
                    }
                );

                kuromiRightObserver.observe(triggerEl);
            }

            onMounted(() => {
                cleanupSmoothScroll = useSmoothWheelScroll();
                nextTick().then(() => {
                    setupKuromiLeftObserver();
                    setupKuromiRightObserver();
                });
            });

            onBeforeUnmount(() => {
                cleanupSmoothScroll();
                cleanupKuromiLeftObserver();
                cleanupKuromiRightObserver();
            });

            return {
                isKuromiLeftVisible,
                isKuromiRightVisible,
                playBirthdayMusic: play
            };
        },
        template: `
            <SideNavCursor />
            <KuromiLeftPop :visible="isKuromiLeftVisible" />
            <KuromiRightPop :visible="isKuromiRightVisible" />
            <div class="container">
                <HeroSection @play="playBirthdayMusic" />
                <TestContent />
            </div>
            <div id="youtube-player-container" style="display: none;"></div>
        `
    };

    createApp(App).mount('#app');
})();
