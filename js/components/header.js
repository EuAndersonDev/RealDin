class Header extends HTMLElement {
    connectedCallback() {
        const paginaAtual = this.getAttribute('pagina');
        this.innerHTML = `
            <header>
                <nav id="topo">
                    <section id="logo">
                        <img src="/assets/imgs/logo.svg" alt="Logo">
                    </section>

                    <section id="links">
                        ${paginaAtual !== 'home' ? '<a href="/index.html">Home</a>' : ''}
                        ${paginaAtual !== 'conscientizacao' ? '<a href="/pages/conscientizacao.html">Conscientização</a>' : ''}
                        ${paginaAtual !== 'perguntas' ? '<a href="/pages/perguntas.html">Perguntas</a>' : ''}
                        ${paginaAtual !== 'resultados' ? '<a href="/pages/resultados.html">Resultados</a>' : ''}  
                        ${paginaAtual !== 'sobre' ? '<a href="/pages/sobre.html">Sobre</a>' : ''}  
                    </section>

                    <section id="botoes">
                        <button class="botao-login">Login</button>
                        <button class="botao-register">Registrar-se</button>
                    </section>
                </nav>
            </header>
        `;
    }
}

customElements.define('header-componente', Header);