class Footer extends HTMLElement {
    connectedCallback() {
        
        this.innerHTML = `
        <div id="fundo">

      <footer>

            <div id="bloco">RealDin</div>
            <div id="borda"> Brazil</div>
            <div id="traco"> </div>
           

      </footer>

      <div id="sobre"> SOBRE NÓS </div>
      <div id="ajuda"> PRECISA DE AJUDA </div>
      <div id="legal"> LEGAL </div>

      <div id="empresa"> 
        
        <p> Nossa empresa</p>
        <br>
        <p> Imprensa</p>
        <br>
        <p> História</p>
      </div>

      <div id="perguntas">
        <p>Perguntas frequentes</p>
        <br>
        <p>Contate-nos</p>
      </div>

      <div id="termos">Termos de uso</div>

      <div id="traco2"></div>

      <div id="imagem"> <img  src="assets/icons/Vector.svg" alt=""> </div> 
      <div id="imagem2"> <img src="assets/icons/Vector (1).svg" alt=""></div>
      <div id="imagem3"> <img src="assets/icons/Vector (2).svg" alt=""></div>
      <div id="imagem4"> <img src="assets/icons/Vector (3).svg" alt=""></div>

      <p id="direitos">
        © 2026 RealDin. Todos os direitos reservados.
      </p>

      
    
    </div>
      
     
           
         `;
    }
}

customElements.define('footer-componente', Footer);


