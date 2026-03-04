class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="rd-footer-wrap">
        <footer class="rd-footer">
          <div class="rd-footer-top">
            <div class="rd-logo">RealDin</div>
            <div class="rd-country">Brazil</div>
          </div>

          <div class="rd-divider" aria-hidden="true"></div>

          <div class="rd-footer-columns">
            <section class="rd-footer-col">
              <h4>SOBRE NOS</h4>
              <a href="#">Nossa empresa</a>
              <a href="#">Imprensa</a>
              <a href="#">Historia</a>
            </section>

            <section class="rd-footer-col">
              <h4>PRECISA DE AJUDA</h4>
              <a href="#">Perguntas frequentes</a>
              <a href="#">Contate-nos</a>
            </section>

            <section class="rd-footer-col">
              <h4>LEGAL</h4>
              <a href="#">Termos de uso</a>
            </section>
          </div>

          <div class="rd-divider" aria-hidden="true"></div>

          <div class="rd-footer-bottom">
            <p>© 2026 RealDin. Todos os direitos reservados.</p>

            <div class="rd-socials">
              <a class="rd-social" href="#" aria-label="Rede social 1">
                <img src="assets/icons/Vector.svg" alt="" />
              </a>
              <a class="rd-social" href="#" aria-label="Rede social 2">
                <img src="assets/icons/Vector (1).svg" alt="" />
              </a>
              <a class="rd-social" href="#" aria-label="Rede social 3">
                <img src="assets/icons/Vector (2).svg" alt="" />
              </a>
              <a class="rd-social" href="#" aria-label="Rede social 4">
                <img src="assets/icons/Vector (3).svg" alt="" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    `;
  }
}

customElements.define('footer-componente', Footer);


