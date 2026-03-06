class CardCta extends HTMLElement {
    connectedCallback() {
        // Obtém os atributos personalizáveis ou usa valores padrão
        const titulo = this.getAttribute('titulo') || 'Pronto para o desafio?';
        const descricao = this.getAttribute('descricao') || 'Clique no botão abaixo e comece seu quiz agora. É rápido, gratuito e muito divertido!';
        const textoBotao = this.getAttribute('texto-botao') || 'Iniciar Quiz Agora';
        const link = this.getAttribute('link') || '#';

        this.innerHTML = `
        <div class="cardcta">
            <h2 class="heading-2">${titulo}</h2>
            <p class="text-button-cardCta">
                ${descricao}
            </p>
            <button class="link-buttonCta" onclick="window.location.href='${link}'">
                ${textoBotao}
            </button>
        </div>
        `;
    }
}

customElements.define('cardcta-component', CardCta);
