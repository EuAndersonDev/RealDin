// Toggle de visibilidade da senha
document.addEventListener('DOMContentLoaded', () => {
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            // Alterna entre 'password' e 'text'
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Atualiza o aria-label para acessibilidade
            const label = type === 'password' ? 'Mostrar senha' : 'Ocultar senha';
            togglePasswordBtn.setAttribute('aria-label', label);
        });
    }
});
