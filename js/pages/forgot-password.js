document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgotForm');
  const successMessage = document.getElementById('successMessage');
  const sentEmail = document.getElementById('sentEmail');
  const emailInput = document.getElementById('email');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const newPasswordGroup = document.getElementById('newPasswordGroup');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  const submitLabel = document.getElementById('submitLabel');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let step = 'email';

  if (
    !form ||
    !successMessage ||
    !sentEmail ||
    !emailInput ||
    !newPasswordInput ||
    !confirmPasswordInput ||
    !newPasswordGroup ||
    !confirmPasswordGroup ||
    !submitLabel
  ) {
    return;
  }

  function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }

  function showResetStep() {
    step = 'reset';
    newPasswordGroup.classList.add('visible');
    confirmPasswordGroup.classList.add('visible');
    submitLabel.textContent = 'Redefinir senha';
    emailInput.setAttribute('readonly', 'readonly');
    newPasswordInput.focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      Toast.show('Informe seu e-mail para continuar.', 'warning');
      return;
    }

    if (!emailRegex.test(email)) {
      Toast.show('Digite um e-mail válido.', 'warning');
      return;
    }

    if (!window.SessionService?.findUserByEmail) {
      Toast.show('Não foi possível validar o e-mail no momento.', 'error');
      return;
    }

    if (step === 'email') {
      const user = window.SessionService.findUserByEmail(email);

      if (!user) {
        Toast.show('Nenhuma conta foi encontrada com este e-mail.', 'error');
        return;
      }

      Toast.show('E-mail validado. Agora crie sua nova senha.', 'success');
      showResetStep();
      return;
    }

    if (!window.SessionService?.resetPasswordByEmail) {
      Toast.show('Não foi possível redefinir a senha no momento.', 'error');
      return;
    }

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordStrength = getPasswordStrength(newPassword);

    if (!newPassword || !confirmPassword) {
      Toast.show('Preencha a nova senha e a confirmação.', 'warning');
      return;
    }

    if (newPassword.length < 8 || passwordStrength < 2) {
      Toast.show('Use uma senha mais forte, com pelo menos 8 caracteres.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show('As senhas não coincidem.', 'error');
      return;
    }

    const result = window.SessionService.resetPasswordByEmail(email, newPassword);

    if (!result.success) {
      Toast.show(result.message, 'error');
      return;
    }

    sentEmail.textContent = email;
    form.style.display = 'none';
    successMessage.classList.add('visible');
    Toast.show('Senha redefinida com sucesso.', 'success');
  });
});
