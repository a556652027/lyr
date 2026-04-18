(() => {
    const { createApp, onBeforeUnmount, onMounted, ref } = Vue;

    function useSmoothWheelScroll() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return () => {};
        }

        const ease = 0.12;
        const minDelta = 40;
        let isAnimating = false;
        let rafId = null;
        let targetY = window.scrollY;
        let currentY = window.scrollY;

        function maxScrollY() {
            const d = document.documentElement;
            return Math.max(0, (d.scrollHeight || document.body.scrollHeight) - (d.clientHeight || window.innerHeight));
        }

        function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

        function step() {
            targetY = clamp(targetY, 0, maxScrollY());
            currentY += (targetY - currentY) * ease;
            const done = Math.abs(targetY - currentY) < 0.5;
            if (done) currentY = targetY;
            window.scrollTo(0, Math.round(currentY));
            if (done) { rafId = null; isAnimating = false; return; }
            rafId = window.requestAnimationFrame(step);
        }

        function start() {
            if (rafId !== null) return;
            isAnimating = true;
            rafId = window.requestAnimationFrame(step);
        }

        function onWheel(e) {
            if (!e.cancelable || e.ctrlKey || e.metaKey || Math.abs(e.deltaY) < minDelta) return;
            e.preventDefault();
            let dy = e.deltaY;
            if (e.deltaMode === 1) dy *= 16;
            if (e.deltaMode === 2) dy *= window.innerHeight;
            if (!isAnimating) { currentY = window.scrollY; targetY = window.scrollY; }
            targetY += dy;
            start();
        }

        function onScroll() { if (!isAnimating) { targetY = window.scrollY; currentY = window.scrollY; } }
        function onResize() { targetY = clamp(targetY, 0, maxScrollY()); if (isAnimating) start(); }

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; }
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }

    const SideNavCursor = {
        emits: ['bottom-change'],
        template: '<div ref="cursorEl" class="sidenav-cursor" aria-hidden="true"></div>',
        setup(props, { emit }) {
            const cursorEl = ref(null);
            let rafId = null;
            let lastAtBottom = false;

            function update() {
                const el = cursorEl.value;
                if (!el) return;
                const doc = document.documentElement;
                const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
                const clientHeight = doc.clientHeight || window.innerHeight;
                const maxScroll = Math.max(0, (doc.scrollHeight || document.body.scrollHeight) - clientHeight);
                const isAtBottom = maxScroll > 0 && scrollTop >= maxScroll - 2;

                if (isAtBottom !== lastAtBottom) {
                    lastAtBottom = isAtBottom;
                    emit('bottom-change', isAtBottom);
                }

                if (isAtBottom) {
                    el.classList.add('is-at-bottom');
                    document.body.classList.add('bottom-focus-mode');
                    el.style.transform = '';
                    return;
                }

                el.classList.remove('is-at-bottom');
                document.body.classList.remove('bottom-focus-mode');
                const progress = maxScroll === 0 ? 0 : Math.min(1, scrollTop / maxScroll);
                const top = Number.parseFloat(getComputedStyle(el).top) || 0;
                const available = Math.max(0, clientHeight - top * 2 - el.offsetHeight);
                el.style.transform = `translateY(${Math.round(progress * available)}px)`;
            }

            function schedule() {
                if (rafId !== null) return;
                rafId = window.requestAnimationFrame(() => { rafId = null; update(); });
            }

            onMounted(() => {
                window.addEventListener('scroll', schedule, { passive: true });
                window.addEventListener('resize', schedule);
                schedule();
            });

            onBeforeUnmount(() => {
                window.removeEventListener('scroll', schedule);
                window.removeEventListener('resize', schedule);
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                document.body.classList.remove('bottom-focus-mode');
                if (lastAtBottom) emit('bottom-change', false);
            });

            return { cursorEl };
        }
    };

    const BottomJumpAction = {
        props: {
            visible: { type: Boolean, default: false },
            href: { type: String, default: 'second.html' }
        },
        template: `
            <div class="bottom-action-layer" :class="{ 'is-visible': visible }" :aria-hidden="String(!visible)">
                <a class="bottom-jump-btn" :href="href" :tabindex="visible ? 0 : -1">兌換券</a>
            </div>
        `
    };

    const HeroSection = {
        template: `
            <section class="hero">
                <header class="header">
                    <h1 class="title">⡤⠲⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡎⢑
⠑⢲⠷⢤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠶⠚⡟⠉
⠀⠸⡇⠀⠈⠙⠲⢤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠚⠉⠀⠀⠀⡇⠀
⠀⠀⡇⠀⠀⠀⠀⠀⠈⠙⣲⣀⠄⠠⠄⠒⠢⠤⠠⢴⠋⠁⠀⠀⠀⠀⠀⢸⠇⠀
⠀⠀⣧⠀⠀⠀⠀⠀⣀⠏⠀⠀⠀⠀⠀⠀⢀⠀⠀⠈⠉⢳⡀⠀⠀⠀⠀⢸⠀⠀
⠀⠀⢸⠀⠀⠀⣠⣾⠀⠀⠀⣂⡠⠤⢤⣤⠬⠤⢄⣰⠀⠀⠈⣷⡀⠀⠀⡾⠀⠀
⠀⠀⠸⢦⣀⣼⠋⢏⢀⡜⠊⠁⢠⣾⣿⣿⣿⣦⠀⠈⠑⠶⡀⣹⠹⡦⠖⠃⠀⠀
⠀⠀⠀⠀⢸⠃⠀⠀⠉⠀⠀⠀⠸⣁⣼⣿⣇⡸⠀⠀⠀⠀⠈⠁⠀⢻⡀⠀⠀⠀
⠀⠀⠀⠀⣾⠀⠀⠀⣠⡴⠒⠉⠓⠲⢼⣈⠯⠒⠋⠙⠲⣄⠀⠀⠀⢸⡇⠀⠀⠀
⠀⠀⠀⠀⢹⠀⠀⣰⠋⢲⣤⡀⠀⠀⠀⠀⠀⠀⠀⣠⣴⠋⢳⠀⠀⢸⠃⠀⠀⠀
⠀⠀⠀⠀⠈⣧⠀⣏⠀⢸⣿⠏⠀⠀⢀⣀⠀⠀⠀⢿⡿⠀⠈⡇⢠⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠳⣿⡀⠀⠀⠀⠀⠀⢌⣂⠅⠀⠀⠀⠀⢀⣼⡶⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡀⣀⠽⠓⠲⠤⢤⣤⣤⣤⣤⣤⡤⠤⠶⢯⡁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠣⠸⠛⠒⠒⢲⡀⠀⣀⡤⠦⣄⠀⢠⠖⠒⠒⠻⣀⠇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢔⢑⠋⠁⠀⠀⠀⢹⠉⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</h1>
                </header>
            </section>
        `
    };

    const TestContent = {
        setup() {
            const items = [
                { title: '有人告訴Kuromi今天有人生日了', subtitle: '' },
            ];
            return { items };
        },
        template: `
            <section class="test-content" aria-label="測試內容">
                <div v-for="item in items" :key="item.title" class="message-box">
                    <p>{{ item.title }}</p>
                    <p v-if="item.subtitle" class="message-sub">{{ item.subtitle }}</p>
                </div>
            </section>
        `
    };

    const App = {
        components: { HeroSection, SideNavCursor, BottomJumpAction, TestContent },
        setup() {
            const isBottomFocused = ref(false);
            let cleanupSmoothScroll = () => {};

            onMounted(() => { cleanupSmoothScroll = useSmoothWheelScroll(); });
            onBeforeUnmount(() => { cleanupSmoothScroll(); });

            return {
                isBottomFocused,
                handleBottomChange: v => { isBottomFocused.value = v; }
            };
        },
        template: `
            <SideNavCursor @bottom-change="handleBottomChange" />
            <BottomJumpAction :visible="isBottomFocused" />
            <div class="container">
                <HeroSection />
                <TestContent />
            </div>
        `
    };

    createApp(App).mount('#app');
})();
