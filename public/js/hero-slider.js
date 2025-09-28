/* hero-slider.js (no modules)
 * Accessible, dependency-free hero slideshow.
 * - Uses .hero > .hero-media > .hero-slide elements already in your HTML
 * - Auto-plays; pauses on hover and when tab is hidden
 * - Keyboard (← →, Space), touch/swipe, and dots navigation
 * - Updates aria-current on dots
 */

(function () {
    'use strict';

    var CONFIG = {
        interval: 6000,      // ms between slides
        transitionMs: 800    // keep in sync with CSS .hero-slide transition
    };

    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function initHeroSlider(root) {
        if (!root) return;

        var media = qs('.hero-media', root);
        var slides = qsa('.hero-slide', media);
        var dotsBar = qs('.slider-dots', media);
        var index = slides.findIndex(function (el) { return el.classList.contains('active'); });
        if (index < 0) index = 0;

        // Build dots if missing
        if (dotsBar && dotsBar.children.length === 0) {
            slides.forEach(function (_, i) {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'dot' + (i === index ? ' active' : '');
                b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                b.addEventListener('click', function () { goTo(i); });
                dotsBar.appendChild(b);
            });
        }
        var dots = dotsBar ? qsa('.dot', dotsBar) : [];

        // Apply initial state
        slides.forEach(function (s, i) {
            s.style.transition = 'opacity ' + CONFIG.transitionMs + 'ms ease-in-out';
            s.style.opacity = i === index ? '1' : '0';
            s.classList.toggle('active', i === index);
        });
        updateDots();

        var timer = null;
        var paused = false;

        function play() {
            if (timer) return;
            paused = false;
            timer = setInterval(next, CONFIG.interval);
            root.setAttribute('aria-live', 'off');
        }
        function pause() {
            paused = true;
            clearInterval(timer);
            timer = null;
            root.setAttribute('aria-live', 'polite');
        }

        function goTo(i) {
            if (i === index) return;
            var prev = index;
            index = (i + slides.length) % slides.length;

            slides[prev].classList.remove('active');
            slides[index].classList.add('active');
            slides[prev].style.opacity = '0';
            slides[index].style.opacity = '1';

            updateDots();
            preloadAround(index);
        }

        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        function updateDots() {
            if (!dots) return;
            dots.forEach(function (d, i) {
                if (i === index) {
                    d.classList.add('active');
                    d.setAttribute('aria-current', 'true');
                } else {
                    d.classList.remove('active');
                    d.removeAttribute('aria-current');
                }
            });
        }

        function preloadAround(i) {
            // preloads neighbors if <img> exists
            [i + 1, i - 1].forEach(function (n) {
                var k = (n + slides.length) % slides.length;
                var img = qs('img', slides[k]);
                if (img && img.dataset.preloaded !== '1') {
                    var tmp = new Image();
                    tmp.src = img.currentSrc || img.src;
                    img.dataset.preloaded = '1';
                }
            });
        }

        // Hover pause
        root.addEventListener('mouseenter', pause);
        root.addEventListener('mouseleave', function () { if (!document.hidden) play(); });

        // Visibility pause
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) pause(); else if (!paused) play();
        });

        // Keyboard
        window.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') next();
            else if (e.key === 'ArrowLeft') prev();
            else if (e.code === 'Space') { e.preventDefault(); paused ? play() : pause(); }
        });

        // Touch / swipe
        var startX = null;
        media.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
        media.addEventListener('touchend', function (e) {
            if (startX == null) return;
            var dx = e.changedTouches[0].clientX - startX;
            var threshold = Math.max(30, window.innerWidth * 0.06);
            if (dx > threshold) prev();
            else if (dx < -threshold) next();
            startX = null;
        });

        // Kick off
        preloadAround(index);
        play();

        // Expose simple API on the element for later control if needed
        root._slider = { play: play, pause: pause, next: next, prev: prev, goTo: goTo };
    }

    // Auto-init on DOM ready for the first .hero
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { initHeroSlider(qs('.hero')); });
    } else {
        initHeroSlider(qs('.hero'));
    }
})();
