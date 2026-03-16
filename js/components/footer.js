class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <footer>
      <section id="conteudo-footer">

        <!-- Seção 1: Logo + Localização -->
        <div id="secao1">
          <h1>RealDin</h1>
          <div class="btn-localizacao">
            <!-- Ícone de pin/localização -->
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" stroke="none" fill="#fff"/>
            </svg>
            Brazil
          </div>
        </div>

        <hr>

        <!-- Seção 3: Links + Acessibilidade -->
        <div id="secao3">
          <div id="secao3-links">
            <div class="coluna-links">
              <span class="titulo-coluna">Sobre nós</span>
              <a href="/pages/sobrenos.html">Nossa empresa</a>
              <a href="/pages/sobrenos.html#historia">História</a>
            </div>
            <div class="coluna-links">
              <span class="titulo-coluna">Precisa de ajuda?</span>
              <a href="/pages/faq.html">Perguntas frequentes</a>
              <a href="../index.html#contato">Contate-nos</a>
            </div>
            <div class="coluna-links">
              <span class="titulo-coluna">Legal</span>
              <a href="/pages/termos-de-uso.html">Termos de uso</a>
            </div>
          </div>

          <div id="secao3-icon">
            <div class="icone-acessibilidade" title="Acessibilidade">
              <!-- Ícone de acessibilidade (pessoa no círculo) -->
              <img src="../assets/icons/telaPrincipal/Acessibilidade.svg" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>

        <!-- Seção 2: Redes Sociais -->
        <div id="secao2">
          <div id="secao2-redes">
            <!-- Instagram -->
            <div class="icone-social" title="Instagram">
              <img src="../assets/icons/telaPrincipal/InstagramBranco.svg" alt="" aria-hidden="true" />
            </div>
            <!-- YouTube -->
            <div class="icone-social" title="YouTube">
              <img src="../assets/icons/telaPrincipal/YouTubeBranco.svg" alt="" aria-hidden="true" />
            </div>
            <!-- Facebook -->
            <div class="icone-social" title="Facebook">
              <img src="../assets/icons/telaPrincipal/FacebookBranco.svg" alt="" aria-hidden="true" />
            </div>
          </div>
        </div>

        <hr>

        <!-- Copyright -->
        <div id="copyright">
          © 2026 RealDin. Todos os direitos reservados.
        </div>

      </section>
    </footer>
    `;
    }
}

customElements.define('footer-componente', Footer);


