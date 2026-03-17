document.addEventListener("DOMContentLoaded", () => {
    initHeroScrollButton();
    initBankModal();
    initTestimonialsCarousel();
});

function initHeroScrollButton() {
    const heroButton = document.querySelector(".btn-aprenda");
    const nextSection = document.getElementById("credito");

    if (!heroButton || !nextSection) {
        return;
    }

    heroButton.addEventListener("click", () => {
        nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function initBankModal() {
    const modal = document.getElementById("bank-modal");
    const CLOSE_ANIMATION_MS = 170;

    if (!modal) {
        return;
    }

    const titleElement = modal.querySelector(".bank-modal__title");
    const subtitleElement = modal.querySelector(".bank-modal__subtitle");
    const descriptionElement = modal.querySelector(".bank-modal__description");
    const listElement = modal.querySelector(".bank-modal__list");
    const closeButton = modal.querySelector(".bank-modal__close");

    const bankDetails = {
        agibank: {
            title: "AgiBank",
            subtitle: "Juros de Credito Pessoal e Rotativo",
            description:
                "As taxas desta categoria costumam estar entre as mais elevadas do mercado, principalmente para perfis sem historico de credito robusto.",
            tips: [
                "Compare o CET, nao apenas a taxa de juros mensal.",
                "Priorize reduzir o prazo para diminuir o total pago.",
                "Evite contratar por impulso sem simular parcelas no seu orcamento.",
            ],
        },
        crefisa: {
            title: "Crefisa",
            subtitle: "Emprestimo Pessoal (extremo risco)",
            description:
                "Por atuar com publico de maior risco, os contratos podem trazer encargos altos e parcelas que comprometem boa parte da renda mensal.",
            tips: [
                "Leia com atencao multas por atraso e juros de mora.",
                "Nunca comprometa mais de 30% da sua renda liquida com dividas.",
                "Busque alternativas com garantia ou cooperativas antes de fechar.",
            ],
        },
        santander: {
            title: "Santander",
            subtitle: "Tarifas de Servico e Cheque Especial",
            description:
                "Pacotes de conta, cheque especial e credito emergencial podem elevar muito o custo bancario total ao longo do ano.",
            tips: [
                "Revise mensalmente tarifas cobradas e solicite downgrade do pacote.",
                "Desative limites automaticos que incentivam uso do cheque especial.",
                "Negocie taxas antes de aceitar qualquer renovacao de credito.",
            ],
        },
        c6bank: {
            title: "C6 Bank",
            subtitle: "Novas Tarifas e Juros de Cartao",
            description:
                "Apesar do apelo digital, algumas linhas de cartao e servicos passaram a ter custos relevantes para quem atrasa fatura ou usa rotativo.",
            tips: [
                "Pague sempre o valor total da fatura para evitar rotativo.",
                "Confira se ha mudancas de tarifa no aplicativo e no contrato.",
                "Mantenha alerta para nao parcelar fatura sem comparar o CET.",
            ],
        },
    };

    function renderModalContent(card) {
        const key = card.dataset.bankKey;
        const details = bankDetails[key];

        if (!details) {
            return;
        }

        titleElement.textContent = details.title;
        subtitleElement.textContent = details.subtitle;
        descriptionElement.textContent = details.description;

        listElement.innerHTML = "";
        details.tips.forEach((tip) => {
            const item = document.createElement("li");
            item.textContent = tip;
            listElement.appendChild(item);
        });
    }

    function closeModalWithAnimation() {
        if (!modal.open || modal.dataset.closing === "true") {
            return;
        }

        modal.dataset.closing = "true";
        window.setTimeout(() => {
            modal.close();
            delete modal.dataset.closing;
        }, CLOSE_ANIMATION_MS);
    }

    document.querySelectorAll(".bank-card").forEach((card) => {
        const button = card.querySelector(".btn-veja-mais");

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            renderModalContent(card);
            delete modal.dataset.closing;
            modal.showModal();
        });
    });

    closeButton?.addEventListener("click", closeModalWithAnimation);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalWithAnimation();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.open) {
            event.preventDefault();
            closeModalWithAnimation();
        }
    });
}

function initTestimonialsCarousel() {
    const viewport = document.querySelector(".relatos-viewport");
    const track = document.querySelector(".relatos-track");
    const prevButton = document.querySelector("[data-carousel-prev]");
    const nextButton = document.querySelector("[data-carousel-next]");
    const indicators = document.querySelector(".relatos-indicators");

    if (!viewport || !track || !prevButton || !nextButton || !indicators) {
        return;
    }

    const cards = Array.from(track.children);
    let pageIndex = 0;
    let totalPages = 1;
    let dots = [];

    function getVisibleCards() {
        if (window.innerWidth <= 680) {
            return 1;
        }

        if (window.innerWidth <= 1100) {
            return 2;
        }

        return 3;
    }

    function getGap() {
        const styles = window.getComputedStyle(track);
        const gapValue = styles.columnGap || styles.gap || "0";
        return Number.parseFloat(gapValue) || 0;
    }

    function buildIndicators() {
        indicators.innerHTML = "";
        dots = [];

        for (let index = 0; index < totalPages; index += 1) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "relatos-indicator";
            dot.setAttribute("aria-label", `Ir para o grupo de depoimentos ${index + 1}`);
            dot.addEventListener("click", () => {
                pageIndex = index;
                updateCarousel();
            });
            indicators.appendChild(dot);
            dots.push(dot);
        }
    }

    function updateControls() {
        prevButton.disabled = pageIndex === 0;
        nextButton.disabled = pageIndex >= totalPages - 1;

        dots.forEach((dot, index) => {
            dot.classList.toggle("is-active", index === pageIndex);
            dot.setAttribute("aria-current", index === pageIndex ? "true" : "false");
        });
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const cardWidth = cards[0]?.getBoundingClientRect().width || viewport.clientWidth;
        const offset = pageIndex * visibleCards * (cardWidth + getGap());

        track.style.transform = `translateX(-${offset}px)`;
        updateControls();
    }

    function recalculate() {
        const visibleCards = getVisibleCards();
        totalPages = Math.max(1, Math.ceil(cards.length / visibleCards));
        pageIndex = Math.min(pageIndex, totalPages - 1);
        buildIndicators();
        updateCarousel();
    }

    prevButton.addEventListener("click", () => {
        if (pageIndex === 0) {
            return;
        }

        pageIndex -= 1;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        if (pageIndex >= totalPages - 1) {
            return;
        }

        pageIndex += 1;
        updateCarousel();
    });

    viewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            prevButton.click();
        }

        if (event.key === "ArrowRight") {
            nextButton.click();
        }
    });

    window.addEventListener("resize", recalculate, { passive: true });
    recalculate();
}
