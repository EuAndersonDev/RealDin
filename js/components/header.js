class Header extends HTMLElement {
    connectedCallback() {
        const paginaAtual = this.getAttribute('pagina');
        this.innerHTML = `
            <div id="menu-overlay"></div>
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

                    <div id="menu-container">
                        <button id="menu-close" aria-label="Fechar menu">
                            <span>&larr;</span>
                            <span>Voltar</span>
                        </button>

                        <section id="links">
                            <a href="/index.html" class="${paginaAtual === 'home' ? 'pagina-atual' : ''}">Home</a>

                            <a href="/pages/conscientizacao.html" class="${paginaAtual === 'conscientizacao' ? 'pagina-atual' : ''}">Conscientização</a>

                            <a href="/pages/sobrequiz.html" class="${paginaAtual === 'perguntas' ? 'pagina-atual' : ''}">Quiz</a>
                            <a href="/pages/resultados.html" class="${paginaAtual === 'resultados' ? 'pagina-atual' : ''}">Resultados</a>
                            <a href="/pages/sobrenos.html" class="${paginaAtual === 'sobre' ? 'pagina-atual' : ''}">Sobre Nós</a>
                            <a href="/pages/calculadora-juros.html" class="${paginaAtual === 'simulador' ? 'pagina-atual' : ''}">Simulador</a>
                            <a href="/pages/indicacoes.html" class="${paginaAtual === 'indicacoes' ? 'pagina-atual' : ''}">Indicações</a>
                        </section>

                        <div id="botoes">
                            <a href="/pages/login.html" class="botao-login">Login</a>
                            <a href="/pages/register.html" class="botao-register">Registra-se</a>
                        </div>
                    </div>
                </nav>
            </header>
        `;

        const botaoMenu = this.querySelector("#menu-toggle");
        const botaoClose = this.querySelector("#menu-close");
        const menuContainer = this.querySelector("#menu-container");
        const overlay = this.querySelector("#menu-overlay");

        // Toggle do menu hambúrguer
        botaoMenu.addEventListener("click", () => {
            menuContainer.classList.toggle("ativo");
            botaoMenu.classList.toggle("ativo");
            overlay.classList.toggle("ativo");
        });

        // Botão de voltar no menu
        botaoClose.addEventListener("click", () => {
            menuContainer.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });

        // Fechar menu ao clicar em qualquer link (incluindo botões de login/register)
        const todosLinks = this.querySelectorAll("#links a, .botao-login, .botao-register");
        todosLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuContainer.classList.remove("ativo");
                botaoMenu.classList.remove("ativo");
                overlay.classList.remove("ativo");
            });
        });

        // Fechar menu ao clicar no overlay
        overlay.addEventListener("click", () => {
            menuContainer.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });
    }
}

customElements.define('header-componente', Header);
