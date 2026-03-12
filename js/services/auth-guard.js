const AuthGuard = (() => {
    const REDIRECT_MESSAGE_KEY = 'realdin.auth.redirectMessage';

    function getCurrentPath() {
        return window.location.pathname;
    }

    function isProtectedPath(pathname) {
        return [
            '/pages/indicacoes.html'
        ].includes(pathname);
    }

    function redirectToLogin(message) {
        if (message) {
            sessionStorage.setItem(REDIRECT_MESSAGE_KEY, message);
        }

        const params = new URLSearchParams();
        params.set('redirect', getCurrentPath());
        window.location.href = `/pages/login.html?${params.toString()}`;
    }

    function requireAuth() {
        const auth = window.AuthContext?.getState ? window.AuthContext.getState() : { isAuthenticated: false };

        if (!auth.isAuthenticated && isProtectedPath(getCurrentPath())) {
            redirectToLogin('Você precisa estar logado para acessar esta página.');
            return false;
        }

        return true;
    }

    function consumeRedirectMessage() {
        const message = sessionStorage.getItem(REDIRECT_MESSAGE_KEY);
        if (message) {
            sessionStorage.removeItem(REDIRECT_MESSAGE_KEY);
        }
        return message;
    }

    return {
        requireAuth,
        consumeRedirectMessage
    };
})();

window.AuthGuard = AuthGuard;
