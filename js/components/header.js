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

                    <section id="links">
                        <button id="menu-close" aria-label="Fechar menu">
                            <span>&larr;</span>
                            <span>Voltar</span>
                        </button>

                        ${paginaAtual !== 'home' ? '<a href="/index.html">Home</a>' : ''}
                        ${paginaAtual !== 'conscientizacao' ? '<a href="/pages/conscientizacao.html">Conscientização</a>' : ''}
                        ${paginaAtual !== 'perguntas' ? '<a href="/pages/sobrequiz.html">Quiz</a>' : ''}
                        ${paginaAtual !== 'resultados' ? '<a href="/pages/resultados.html">Resultados</a>' : ''}
                        ${paginaAtual !== 'sobre' ? '<a href="/pages/sobrenos.html">Sobre Nós</a>' : ''}
                        ${paginaAtual !== 'simulador' ? '<a href="/pages/calculadora-juros.html">Simulador</a>' : ''}
                        ${paginaAtual !== 'indicacoes' ? '<a href="/pages/indicacoes.html">Indicações</a>' : ''}

                        </section>
                        <div id="botoes">
                            <button class="botao-login">Login</button>
                            <button class="botao-register">Registra-se</button>
                        </div>
                </nav>
            </header>
        `;

        const botaoMenu = this.querySelector("#menu-toggle");
        const botaoClose = this.querySelector("#menu-close");
        const links = this.querySelector("#links");
        const botaoLogin = this.querySelector(".botao-login");
        const botaoRegister = this.querySelector(".botao-register");
        const overlay = this.querySelector("#menu-overlay");

        // Toggle do menu hambúrguer
        botaoMenu.addEventListener("click", () => {
            links.classList.toggle("ativo");
            botaoMenu.classList.toggle("ativo");
            overlay.classList.toggle("ativo");
        });

        // Botão de voltar no menu
        botaoClose.addEventListener("click", () => {
            links.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });

        // Fechar menu ao clicar em qualquer link
        const linksArray = this.querySelectorAll("#links a");
        linksArray.forEach(link => {
            link.addEventListener("click", () => {
                links.classList.remove("ativo");
                botaoMenu.classList.remove("ativo");
                overlay.classList.remove("ativo");
            });
        });

        // Fechar menu ao clicar no overlay
        overlay.addEventListener("click", () => {
            links.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });

        // Navegação dos botões
        botaoLogin.addEventListener("click", () => {
            links.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
            window.location.href = "/pages/login.html";
        });

        botaoRegister.addEventListener("click", () => {
            links.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
            window.location.href = "/pages/register.html";
        });
    }
}

customElements.define('header-componente', Header);
