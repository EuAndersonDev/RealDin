(() => {
    const MOBILE_MEDIA = window.matchMedia("(max-width: 767px)");
    const ANIMATABLE_SELECTOR = [
        "header-componente",
        "footer-componente",
        "main",
        "section",
        "div",
        "header",
        "nav",
        "footer",
        "article",
        "aside",
        "h1",
        "h2",
        "h3",
        "p",
        "span",
        "b",
        "img",
        "button",
        "a",
        "ul",
        "li",
        "form",
        "input",
        "textarea",
        "label",
        "iframe",
    ].join(", ");
    const ANIMATION_PATTERN = [
        "fade-up",
        "fade-left",
        "fade-right",
        "zoom-in",
    ];
    const DURATION_PATTERN = [620, 700, 780, 860];
    const STAGGER_DELAY = 120;

    let targets = [];
    let parallaxTargets = [];
    let animationObserver = null;
    let parallaxObserver = null;
    let activeParallaxTargets = new Set();
    let orderMap = new Map();
    let revealedTargets = new WeakSet();
    let ticking = false;
    let scrollIdleTimer = null;

    function shouldSkipElement(element) {
        if (!element.isConnected) {
            return true;
        }

        if (element.closest("script, style, link, noscript")) {
            return true;
        }

        if (element.tagName.toLowerCase() === "a" && element.parentElement?.tagName.toLowerCase() === "button") {
            return true;
        }

        return element.getClientRects().length === 0;
    }

    function getAutoAnimation(element, index) {
        const tagName = element.tagName.toLowerCase();

        if (["img", "iframe"].includes(tagName)) {
            return "zoom-in";
        }

        if (["h1", "h2", "h3"].includes(tagName)) {
            return index % 2 === 0 ? "fade-left" : "fade-right";
        }

        if (["button", "a", "input"].includes(tagName)) {
            return "fade-up";
        }

        return ANIMATION_PATTERN[index % ANIMATION_PATTERN.length];
    }

    function getAutoSpeed(element) {
        const tagName = element.tagName.toLowerCase();

        if (
            [
                "main",
                "section",
                "header",
                "nav",
                "footer",
                "article",
                "aside",
                "header-componente",
                "footer-componente",
            ].includes(tagName)
        ) {
            return "0.2";
        }

        if (["img", "button", "a", "input", "iframe"].includes(tagName)) {
            return "0.8";
        }

        return "0.5";
    }

    function getVisibilityRatio(rect) {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (rect.height === 0) {
            return 0;
        }

        return visibleHeight / rect.height;
    }

    function prepareTargets() {
        const collectedTargets = Array.from(
            document.querySelectorAll(ANIMATABLE_SELECTOR),
        ).filter((element) => !shouldSkipElement(element));

        orderMap = new Map();
        revealedTargets = new WeakSet();

        collectedTargets.forEach((element, index) => {
            orderMap.set(element, index);

            if (!element.dataset.animate) {
                element.dataset.animate = getAutoAnimation(element, index);
            }

            if (!element.dataset.speed) {
                element.dataset.speed = getAutoSpeed(element);
            }

            element.style.setProperty(
                "--reveal-duration",
                `${DURATION_PATTERN[index % DURATION_PATTERN.length]}ms`,
            );
            element.style.setProperty("--reveal-delay", "0ms");
        });

        targets = collectedTargets;
        parallaxTargets = collectedTargets.filter((element) => {
            const speed = Number.parseFloat(element.dataset.speed || "");
            return Number.isFinite(speed);
        });
    }

    function revealElement(element, batchIndex) {
        if (revealedTargets.has(element)) {
            return;
        }

        const customDelay = Number.parseInt(element.dataset.delay || "", 10);
        const delay = Number.isFinite(customDelay)
            ? customDelay
            : batchIndex * STAGGER_DELAY;

        revealedTargets.add(element);
        element.style.setProperty("--reveal-delay", `${delay}ms`);
        element.style.willChange = "transform, opacity";

        window.setTimeout(() => {
            element.classList.add("is-visible");
        }, 16);
    }

    function handleAnimationTransitionEnd(event) {
        const element = event.currentTarget;

        if (event.propertyName !== "transform") {
            return;
        }

        if (!activeParallaxTargets.has(element) || MOBILE_MEDIA.matches) {
            element.style.willChange = "auto";
        }
    }

    function observeAnimations() {
        if (animationObserver) {
            animationObserver.disconnect();
        }

        animationObserver = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (left, right) =>
                            (orderMap.get(left.target) || 0) -
                            (orderMap.get(right.target) || 0),
                    );

                visibleEntries.forEach((entry, batchIndex) => {
                    revealElement(entry.target, batchIndex);
                    animationObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15,
            },
        );

        targets.forEach((element) => {
            element.addEventListener(
                "transitionend",
                handleAnimationTransitionEnd,
            );
            animationObserver.observe(element);
        });
    }

    function observeParallax() {
        if (parallaxObserver) {
            parallaxObserver.disconnect();
        }

        activeParallaxTargets = new Set();
        parallaxObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeParallaxTargets.add(entry.target);
                        return;
                    }

                    activeParallaxTargets.delete(entry.target);
                });

                requestParallaxTick();
            },
            {
                threshold: 0,
                rootMargin: "20% 0px 20% 0px",
            },
        );

        parallaxTargets.forEach((element) => parallaxObserver.observe(element));
    }

    function resetParallax() {
        parallaxTargets.forEach((element) => {
            element.style.setProperty("--parallax-y", "0px");
            if (revealedTargets.has(element)) {
                element.style.willChange = "auto";
            }
        });
    }

    function clearParallaxWillChange() {
        activeParallaxTargets.forEach((element) => {
            if (revealedTargets.has(element)) {
                element.style.willChange = "auto";
            }
        });
    }

    function queueParallaxCleanup() {
        window.clearTimeout(scrollIdleTimer);
        scrollIdleTimer = window.setTimeout(clearParallaxWillChange, 160);
    }

    function updateParallax() {
        ticking = false;

        if (MOBILE_MEDIA.matches) {
            resetParallax();
            return;
        }

        const viewportCenter = window.innerHeight / 2;
        const measurements = Array.from(activeParallaxTargets).map((element) => {
            const rect = element.getBoundingClientRect();
            const speed = Number.parseFloat(element.dataset.speed || "0.5");

            return {
                element,
                speed,
                center: rect.top + rect.height / 2,
            };
        });

        measurements.forEach(({ element, speed, center }) => {
            const offset = (viewportCenter - center) * speed;
            element.style.willChange = "transform";
            element.style.setProperty(
                "--parallax-y",
                `${Math.round(offset * 100) / 100}px`,
            );
        });

        queueParallaxCleanup();
    }

    function requestParallaxTick() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateParallax);
    }

    function revealInitiallyVisibleTargets() {
        targets
            .filter((element) => getVisibilityRatio(element.getBoundingClientRect()) >= 0.15)
            .sort(
                (left, right) =>
                    (orderMap.get(left) || 0) - (orderMap.get(right) || 0),
            )
            .forEach((element, batchIndex) => {
                revealElement(element, batchIndex);
                animationObserver.unobserve(element);
            });
    }

    function setup() {
        prepareTargets();
        observeAnimations();
        observeParallax();
        revealInitiallyVisibleTargets();
        requestParallaxTick();

        window.requestAnimationFrame(() => {
            document.body.classList.remove("motion-pending");
        });
    }

    function init() {
        if (!document.body) {
            return;
        }

        setup();
        window.addEventListener("scroll", requestParallaxTick, {
            passive: true,
        });
        window.addEventListener("resize", requestParallaxTick, {
            passive: true,
        });
        window.addEventListener("load", requestParallaxTick, { once: true });

        if (typeof MOBILE_MEDIA.addEventListener === "function") {
            MOBILE_MEDIA.addEventListener("change", requestParallaxTick);
            return;
        }

        MOBILE_MEDIA.addListener(requestParallaxTick);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
        return;
    }

    init();
})();
