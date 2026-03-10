document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const pwdInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const termsInput = document.getElementById('terms');

  function setupToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);

    if (!btn || !input) {
      return;
    }

    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    });
  }

  setupToggle('togglePassword', 'password');
  setupToggle('toggleConfirmPassword', 'confirmPassword');

  const bars = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3')
  ].filter(Boolean);

  function getStrength(password) {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    return score;
  }

  function atualizarForcaSenha() {
    if (!pwdInput) {
      return 0;
    }

    const score = getStrength(pwdInput.value);

    bars.forEach((bar, index) => {
      bar.className = 'strength-bar';

      if (index < score) {
        bar.classList.add(
          score === 1 ? 'weak' : score === 2 ? 'medium' : 'strong'
        );
      }
    });

    return score;
  }

  if (pwdInput) {
    pwdInput.addEventListener('input', atualizarForcaSenha);
  }

  if (!form || !pwdInput || !confirmPasswordInput || !firstNameInput || !lastNameInput || !emailInput || !termsInput) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = pwdInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordStrength = atualizarForcaSenha();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Toast.show('Preencha todos os campos do cadastro.', 'warning');
      return;
    }

    if (!email.includes('@')) {
      Toast.show('Digite um e-mail válido.', 'warning');
      return;
    }

    if (password.length < 8 || passwordStrength < 2) {
      Toast.show('Use uma senha mais forte, com pelo menos 8 caracteres.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      Toast.show('As senhas não coincidem.', 'error');
      return;
    }

    if (!termsInput.checked) {
      Toast.show('Você precisa aceitar os termos para continuar.', 'warning');
      return;
    }

    const resultado = window.SessionService.registerUser({
      firstName,
      lastName,
      email,
      password,
      acceptedTerms: termsInput.checked
    });

    if (!resultado.success) {
      Toast.show(resultado.message, 'error');
      return;
    }

    Toast.show('Conta criada com sucesso. Faça login para continuar.', 'success');
    form.reset();
    atualizarForcaSenha();

    setTimeout(() => {
      window.location.href = '/pages/login.html?registered=1';
    }, 900);
  });
});