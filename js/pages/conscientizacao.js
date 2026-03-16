document.addEventListener("DOMContentLoaded", () => {
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

    closeButton?.addEventListener("click", () => {
        closeModalWithAnimation();
    });

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
});
