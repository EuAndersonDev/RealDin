/**
 * Toast — Alert personalizado do RealDin
 * 
 * Uso:
 *   Toast.show('Mensagem aqui')                        // info (padrão)
 *   Toast.show('Sucesso!', 'success')
 *   Toast.show('Atenção!', 'warning')
 *   Toast.show('Erro!',    'error')
 *   Toast.show('Info!',    'info')
 * 
 * Parâmetros opcionais:
 *   Toast.show('Mensagem', 'success', { duracao: 4000, posicao: 'top-right' })
 */

const Toast = (() => {
  const ICONES = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>`
  };

  function _obterContainer(posicao) {
    const id = `toast-container-${posicao}`;
    let container = document.getElementById(id);

    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className = `toast-container toast-${posicao}`;
      document.body.appendChild(container);
    }

    return container;
  }

  function show(mensagem, tipo = 'info', opcoes = {}) {
    const { duracao = 3500, posicao = 'top-right' } = opcoes;

    const container = _obterContainer(posicao);

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    let temporizadorFechamento = null;

    toast.innerHTML = `
      <span class="toast-icon">${ICONES[tipo] || ICONES.info}</span>
      <span class="toast-mensagem">${mensagem}</span>
      <button class="toast-fechar" aria-label="Fechar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="toast-progresso"></div>
    `;

    container.appendChild(toast);

    // Força o reflow para a animação de entrada funcionar
    void toast.offsetWidth;
    toast.classList.add('toast-visivel');

    // Barra de progresso animada
    const barra = toast.querySelector('.toast-progresso');
    barra.style.animationDuration = `${duracao}ms`;
    barra.classList.add('toast-progresso-ativo');

    // Fechar ao clicar no X
    toast.querySelector('.toast-fechar').addEventListener('click', () => _fechar(toast));

    // Auto-fechar
    temporizadorFechamento = setTimeout(() => _fechar(toast), duracao);

    // Pausar progresso ao passar o mouse
    toast.addEventListener('mouseenter', () => {
      barra.style.animationPlayState = 'paused';
      clearTimeout(temporizadorFechamento);
    });

    toast.addEventListener('mouseleave', () => {
      barra.style.animationPlayState = 'running';
      clearTimeout(temporizadorFechamento);
      temporizadorFechamento = setTimeout(() => _fechar(toast), 800);
    });

    toast.addEventListener('toast:fechar', () => {
      clearTimeout(temporizadorFechamento);
    }, { once: true });

    return toast;
  }

  function _fechar(toast) {
    if (!toast || toast.dataset.fechando === 'true') {
      return;
    }

    toast.dataset.fechando = 'true';
    toast.dispatchEvent(new CustomEvent('toast:fechar'));
    toast.classList.remove('toast-visivel');
    toast.classList.add('toast-saindo');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }

  return { show };
})();

window.Toast = Toast;
window.showToast = (mensagem, tipo = 'info', opcoes = {}) => Toast.show(mensagem, tipo, opcoes);
window.alert = (mensagem) => Toast.show(String(mensagem), 'warning');
