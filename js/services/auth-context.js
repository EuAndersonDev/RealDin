const AuthContext = (() => {
    const STORAGE_KEY = 'realdin.auth';

    function readStoredState() {
        const storages = [window.localStorage, window.sessionStorage];

        for (const storage of storages) {
            try {
                const raw = storage.getItem(STORAGE_KEY);
                if (!raw) {
                    continue;
                }

                const parsed = JSON.parse(raw);
                return parsed;
            } catch (error) {
                // Ignora parsing/storage errors e tenta o próximo storage.
            }
        }

        return null;
    }

    function getAuthState() {
        if (window.SessionService?.getCurrentSession) {
            return window.SessionService.getCurrentSession();
        }

        try {
            const parsed = readStoredState();

            if (!parsed) {
                return { isAuthenticated: false, currentUser: null, lastLoginAt: null };
            }

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
