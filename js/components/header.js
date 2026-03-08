class Header extends HTMLElement {
    connectedCallback() {
        const paginaAtual = this.getAttribute('pagina');
        this.innerHTML = `
            <header>
                <nav id="topo">
                    <section id="logo">
                        <img src="/assets/imgs/logo.svg" alt="Logo">
                    </section>

                    <button id="menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <section id="links">
                        ${paginaAtual !== 'home' ? '<a href="/index.html">Home</a>' : ''}
                        ${paginaAtual !== 'conscientizacao' ? '<a href="/pages/conscientizacao.html">Conscientização</a>' : ''}
                        ${paginaAtual !== 'perguntas' ? '<a href="/pages/faq.html">Perguntas</a>' : ''}
                        ${paginaAtual !== 'resultados' ? '<a href="/pages/resultados.html">Resultados</a>' : ''}  
                        ${paginaAtual !== 'sobre' ? '<a href="/pages/sobre.html">Sobre</a>' : ''}  
                    </section>

                    <section id="botoes">
                        <button class="botao-login">
                        <a href="/pages/login.html">Login</a>
                        </button>
                        <button class="botao-register">Registrar-se</button>
                    </section>
                </nav>
            </header>
        `;

        const botaoMenu = this.querySelector("#menu-toggle");
        const links = this.querySelector("#links");
        const botaoLogin = this.querySelector(".botao-login");

        botaoMenu.addEventListener("click", () => {
            links.classList.toggle("ativo");
        });

        botaoLogin.addEventListener("click", () => {
            window.location.href = "/pages/login.html";
        });
    }
}

customElements.define('header-componente', Header);
