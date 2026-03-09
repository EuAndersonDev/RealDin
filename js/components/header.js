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
                        ${paginaAtual !== 'perguntas' ? '<a href="/pages/sobrequiz.html">Quiz</a>' : ''}
                        ${paginaAtual !== 'resultados' ? '<a href="/pages/resultados.html">Resultados</a>' : ''}
                        ${paginaAtual !== 'sobre' ? '<a href="/pages/sobrenos.html">Sobre Nós</a>' : ''}
                        ${paginaAtual !== 'simulador' ? '<a href="/pages/calculadora-juros.html">Simulador</a>' : ''}
                        ${paginaAtual !== 'indicacoes' ? '<a href="/pages/indicacoes.html">Indicações</a>' : ''}
                    </section>

                    <section id="botoes">
                        <button class="botao-login">Login</button>
                        <button class="botao-register">Registra-se</button>
                    </section>
                </nav>
            </header>
        `;

        const botaoMenu = this.querySelector("#menu-toggle");
        const links = this.querySelector("#links");
        const botaoLogin = this.querySelector(".botao-login");
        const botaoRegister = this.querySelector(".botao-register");

        botaoMenu.addEventListener("click", () => {
            links.classList.toggle("ativo");
        });

        botaoLogin.addEventListener("click", () => {
            window.location.href = "/pages/login.html";
        });

        botaoRegister.addEventListener("click", () => {
            window.location.href = "/pages/register.html";
        });
    }
}

customElements.define('header-componente', Header);
