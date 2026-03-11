document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const params = new URLSearchParams(window.location.search);

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordBtn.setAttribute('aria-label', type === 'password' ? 'Mostrar senha' : 'Ocultar senha');
        });
    }

    if (params.get('registered') === '1') {
        Toast.show('Cadastro salvo na sessão. Agora faça login para continuar.', 'success');
    }

    if (window.AuthGuard?.consumeRedirectMessage) {
        const mensagem = window.AuthGuard.consumeRedirectMessage();
        if (mensagem) {
            Toast.show(mensagem, 'warning');
        }
    }

    if (window.SessionService?.isAuthenticated()) {
        const sessao = window.SessionService.getCurrentSession();
        const nome = sessao?.currentUser?.firstName || 'usuário';
        Toast.show(`Você já está logado, ${nome}.`, 'info');
    }

    if (!form || !emailInput || !passwordInput) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            Toast.show('Preencha e-mail e senha para entrar.', 'warning');
            return;
        }

        const resultado = window.SessionService.loginUser(email, password);

        if (!resultado.success) {
            Toast.show(resultado.message, 'error');
            return;
        }

        Toast.show('Bem-vinda! Aqui estão suas indicações personalizadas com base no seu resultado.', 'success');

        setTimeout(() => {
            window.location.href = '/pages/indicacoes.html';
        }, 900);
    });
});
