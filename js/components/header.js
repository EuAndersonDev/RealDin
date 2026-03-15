class Header extends HTMLElement {
    obterCaminhoAsset(caminhoAsset) {
        const caminhoAtual = window.location.pathname;
        const estaEmPaginaInterna = caminhoAtual.includes('/pages/');

        return estaEmPaginaInterna ? `../${caminhoAsset}` : caminhoAsset;
    }

    configurarFallbackLogo() {
        const logo = this.querySelector('#logo img');

        if (!logo) {
            return;
        }

        logo.addEventListener('error', () => {
            if (logo.dataset.fallbackAplicado === 'true') {
                return;
            }

            logo.dataset.fallbackAplicado = 'true';
            logo.src = '/assets/imgs/Logo.svg';
        });
    }

    connectedCallback() {
        const paginaAtual = this.getAttribute('pagina');
        const auth = this.obterAuthState();
        const isAuthenticated = auth.isAuthenticated;
        const caminhoLogo = this.obterCaminhoAsset('assets/imgs/Logo.svg');

        this.innerHTML = `
            <div id="menu-overlay"></div>
            <header>
                <nav id="topo">
                    <section id="logo">
                        <a href="/index.html">
                            <img src="${caminhoLogo}" alt="Logo">
                        </a>
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
                            <a href="/pages/sobrenos.html" class="${paginaAtual === 'sobre' ? 'pagina-atual' : ''}">Sobre Nós</a>
                            <a href="/pages/sobrequiz.html" class="${paginaAtual === 'perguntas' ? 'pagina-atual' : ''}">Quiz</a>
                            ${isAuthenticated ? `
                                <a href="/pages/conscientizacao.html" class="${paginaAtual === 'conscientizacao' ? 'pagina-atual' : ''}">Conscientização</a>
                                <a href="/pages/resultados.html" class="${paginaAtual === 'resultados' ? 'pagina-atual' : ''}">Resultado</a>
                                <a href="/pages/calculadora-juros.html" class="${paginaAtual === 'simulador' ? 'pagina-atual' : ''}">Simulador</a>
                                <a href="/pages/indicacoes.html" class="${paginaAtual === 'indicacoes' ? 'pagina-atual' : ''}">Indicações</a>
                            ` : ``}
                        </section>

                        <div id="botoes">
                            ${this.renderBotoesUsuario(auth.user)}
                        </div>
                    </div>
                </nav>
            </header>
        `;

        const botaoMenu = this.querySelector("#menu-toggle");
        const botaoClose = this.querySelector("#menu-close");
        const menuContainer = this.querySelector("#menu-container");
        const overlay = this.querySelector("#menu-overlay");

        this.configurarFallbackLogo();

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
        const todosLinks = this.querySelectorAll("#links a, .botao-login, .botao-register, #usuario-toggle, #confirmar-logout, #usuario-dropdown a");
        todosLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuContainer.classList.remove("ativo");
                botaoMenu.classList.remove("ativo");
                overlay.classList.remove("ativo");
            });
        });

        this.configurarMenuUsuario();

        // Fechar menu ao clicar no overlay
        overlay.addEventListener("click", () => {
            menuContainer.classList.remove("ativo");
            botaoMenu.classList.remove("ativo");
            overlay.classList.remove("ativo");
        });
    }

    renderBotoesUsuario(usuarioAtual) {
        if (!usuarioAtual) {
            return `
                <a href="/pages/login.html" class="botao-login">Login</a>
            `;
        }

        const primeiroNome = (usuarioAtual.firstName || usuarioAtual.fullName || 'Usuário').trim().split(' ')[0];

        return `
            <div id="usuario-menu">
                <button id="usuario-toggle" type="button" aria-haspopup="true" aria-expanded="false">
                    ${primeiroNome}
                </button>
                <div id="usuario-dropdown" class="fechado" role="menu" aria-hidden="true">
                    <a href="/pages/chatbot.html" class="usuario-chatbot-link" role="menuitem">Chatbot</a>
                    <p>Logout</p>
                    <button id="confirmar-logout" type="button">Fazer logout</button>
                </div>
            </div>
        `;
    }

    obterUsuarioAtual() {
        if (window.SessionService?.getCurrentUser) {
            return window.SessionService.getCurrentUser();
        }

        try {
            const estadoSalvo = sessionStorage.getItem('realdin.auth');
            if (!estadoSalvo) {
                return null;
            }

            const estado = JSON.parse(estadoSalvo);
            return estado?.auth?.currentUser || null;
        } catch (error) {
            return null;
        }
    }

    limparSessaoUsuario() {
        if (window.SessionService?.clearUserSession) {
            window.SessionService.clearUserSession();
            return;
        }

        try {
            const estadoSalvo = sessionStorage.getItem('realdin.auth');
            if (!estadoSalvo) {
                return;
            }

            const estado = JSON.parse(estadoSalvo);
            estado.auth = {
                isAuthenticated: false,
                currentUser: null,
                lastLoginAt: null
            };

            sessionStorage.setItem('realdin.auth', JSON.stringify(estado));
        } catch (error) {
            console.error('[Header] Erro ao limpar sessão do usuário.', error);
        }
    }

    configurarMenuUsuario() {
        const toggleUsuario = this.querySelector('#usuario-toggle');
        const dropdownUsuario = this.querySelector('#usuario-dropdown');
        const botaoLogout = this.querySelector('#confirmar-logout');

        if (!toggleUsuario || !dropdownUsuario || !botaoLogout) {
            return;
        }

        const fecharDropdown = () => {
            dropdownUsuario.classList.add('fechado');
            toggleUsuario.setAttribute('aria-expanded', 'false');
            dropdownUsuario.setAttribute('aria-hidden', 'true');
        };

        toggleUsuario.addEventListener('click', (event) => {
            event.stopPropagation();
            const aberto = !dropdownUsuario.classList.contains('fechado');

            if (aberto) {
                fecharDropdown();
                return;
            }

            dropdownUsuario.classList.remove('fechado');
            toggleUsuario.setAttribute('aria-expanded', 'true');
            dropdownUsuario.setAttribute('aria-hidden', 'false');
        });

        dropdownUsuario.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.addEventListener('click', () => {
            fecharDropdown();
        });

        botaoLogout.addEventListener('click', () => {
            this.limparSessaoUsuario();

            if (window.Toast?.show) {
                window.Toast.show('Logout realizado com sucesso.', 'success');
            }

            window.location.href = '/pages/login.html';
        });
    }

    obterAuthState() {
        if (window.AuthContext?.getState) {
            return window.AuthContext.getState();
        }

        const usuario = this.obterUsuarioAtual();
        return {
            isAuthenticated: Boolean(usuario),
            user: usuario
        };
    }
}

customElements.define('header-componente', Header);
