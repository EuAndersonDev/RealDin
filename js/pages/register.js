// Função reutilizável para alternar visibilidade de um campo de senha
function setupToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);

  // Se algum dos elementos não existir no DOM, encerra a função
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    // Verifica se a senha está oculta no momento do clique
    const show = input.type === 'password';

    // Alterna entre mostrar (text) e ocultar (password)
    input.type = show ? 'text' : 'password';

    // Atualiza o aria-label para acessibilidade
    btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  });
}

// Aplica o toggle nos dois campos de senha
setupToggle('togglePassword',        'password');
setupToggle('toggleConfirmPassword', 'confirmPassword');


// ── Indicador de força de senha ──────────────────────────────

// Referência ao input principal de senha
const pwdInput = document.getElementById('password');

// Array com as três barrinhas visuais de força
const bars = [
  document.getElementById('bar1'),
  document.getElementById('bar2'),
  document.getElementById('bar3'),
];

// Analisa a senha e retorna um score de 0 a 3
function getStrength(pwd) {
  let score = 0;

  if (pwd.length >= 8)                              score++; // critério: tamanho mínimo
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd))      score++; // critério: letras maiúsculas e minúsculas
  if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++; // critério: número ou símbolo especial

  return score; // 1 = fraca | 2 = média | 3 = forte
}

// Atualiza as barras a cada tecla digitada no campo de senha
pwdInput.addEventListener('input', () => {
  const s = getStrength(pwdInput.value);

  bars.forEach((bar, i) => {
    // Remove classes anteriores para recalcular do zero
    bar.className = 'strength-bar';

    // Coloriza apenas as barras dentro do score atual
    if (i < s) {
      bar.classList.add(
        s === 1 ? 'weak'   :  // 1 ponto → vermelho
        s === 2 ? 'medium' :  // 2 pontos → amarelo
                  'strong'    // 3 pontos → verde
      );
    }
  });
});