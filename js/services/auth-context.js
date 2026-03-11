const AuthContext = (() => {
    function getAuthState() {
        if (window.SessionService?.getCurrentSession) {
            return window.SessionService.getCurrentSession();
        }

        try {
            const raw = sessionStorage.getItem('realdin.auth');
            if (!raw) {
                return { isAuthenticated: false, currentUser: null, lastLoginAt: null };
            }

            const parsed = JSON.parse(raw);
            return parsed?.auth || { isAuthenticated: false, currentUser: null, lastLoginAt: null };
        } catch (error) {
            return { isAuthenticated: false, currentUser: null, lastLoginAt: null };
        }
    }

    function getState() {
        const auth = getAuthState();
        return {
            isAuthenticated: Boolean(auth?.isAuthenticated),
            user: auth?.currentUser || null,
            lastLoginAt: auth?.lastLoginAt || null
        };
    }

    function login(email, password) {
        if (!window.SessionService?.loginUser) {
            return { success: false, message: 'Serviço de login não disponível.' };
        }

        return window.SessionService.loginUser(email, password);
    }

    function logout() {
        if (window.SessionService?.clearUserSession) {
            window.SessionService.clearUserSession();
        }
    }

    return {
        getState,
        login,
        logout
    };
})();

window.AuthContext = AuthContext;
window.useAuth = () => AuthContext.getState();
