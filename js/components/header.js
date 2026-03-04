class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="cardcta">
            <b class="heading-2">Pronto para o desafio?</b>
            <div class="clique-no-boto">
                Clique no botão abaixo e comece seu quiz agora. É rápido,<br />gratuito
                e muito divertido!
            </div>
            <div class="link">
                <b class="iniciar-quiz-agora">Iniciar Quiz Agora </b>
            </div>
        </div>
        `;
    }
}

customElements.define('header-component', Header);