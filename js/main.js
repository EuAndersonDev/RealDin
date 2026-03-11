(() => {
    const MOBILE_MEDIA = window.matchMedia("(max-width: 767px)");
    const SECTION_SELECTOR = [
        ".parallax",
        'section[id*="hero"][data-speed]',
        'section[class*="hero"][data-speed]',
        'section[class*="banner"][data-speed]',
    ].join(", ");
    const DEFAULT_SPEED = 0.14;

    let sections = [];
    let observer = null;
    let ticking = false;

    function getSpeed(element, fallback = DEFAULT_SPEED) {
        const speed = Number.parseFloat(element.dataset.speed || "");

        return Number.isFinite(speed) ? speed : fallback;
    }

    function getLayers(section) {
        const layers = Array.from(section.querySelectorAll("[data-speed]"))
            .filter((element) => element !== section)
            .map((element) => ({
                element,
                speed: getSpeed(element),
            }));

        if (layers.length > 0) {
            return layers;
        }

        return [
            {
                element: section,
                speed: getSpeed(section),
            },
        ];
    }

    function collectSections() {
        const uniqueSections = new Set(document.querySelectorAll(SECTION_SELECTOR));

        sections = Array.from(uniqueSections).map((section) => ({
            section,
            layers: getLayers(section),
            isVisible: true,
        }));
    }

    function resetTransforms() {
        sections.forEach(({ layers }) => {
            layers.forEach(({ element }) => {
                element.style.transform = "translate3d(0, 0, 0)";
                element.style.willChange = "auto";
            });
        });
    }

    function updateParallax() {
        ticking = false;

        if (MOBILE_MEDIA.matches) {
            resetTransforms();
            return;
        }

        sections.forEach(({ section, layers, isVisible }) => {
            if (!isVisible) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const sectionCenter = rect.top + rect.height / 2;
            const distanceFromCenter = viewportCenter - sectionCenter;

            layers.forEach(({ element, speed }) => {
                const offset = distanceFromCenter * speed;
                const roundedOffset = Math.round(offset * 100) / 100;

                element.style.transform = `translate3d(0, ${roundedOffset}px, 0)`;
                element.style.willChange = "transform";
            });
        });
    }

    function requestTick() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateParallax);
    }

    function observeSections() {
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const currentSection = sections.find(
                        ({ section }) => section === entry.target,
                    );

                    if (currentSection) {
                        currentSection.isVisible = entry.isIntersecting;
                    }
                });

                requestTick();
            },
            {
                rootMargin: "20% 0px 20% 0px",
                threshold: 0,
            },
        );

        sections.forEach(({ section }) => observer.observe(section));
    }

    function setup() {
        collectSections();
        observeSections();
        requestTick();
    }

    function init() {
        if (!document.body) {
            return;
        }

        setup();

        window.addEventListener("scroll", requestTick, { passive: true });
        window.addEventListener("resize", requestTick, { passive: true });
        window.addEventListener("load", setup, { once: true });
        if (typeof MOBILE_MEDIA.addEventListener === "function") {
            MOBILE_MEDIA.addEventListener("change", setup);
            return;
        }

        MOBILE_MEDIA.addListener(setup);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
