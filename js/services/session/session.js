const SessionService = (() => {
    const STORAGE_KEY = 'realdin.auth';
    const LEGACY_SCORE_KEY = 'pontuacao';
    const LEGACY_FINISHED_KEY = 'quizFinalizado';
    const PRIMARY_STORAGE = getPrimaryStorage();

    const QUIZ_DEFAULT_SCORES = {
        Poupador: 0,
        Gastador: 0,
        Descontrolado: 0,
        Desligado: 0,
        Financista: 0
    };

    function getPrimaryStorage() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage;
            }
        } catch (error) {
            // Ignore e usa sessionStorage como fallback.
        }

        return window.sessionStorage;
    }

    function getInitialState() {
        return {
            users: [],
            auth: {
                isAuthenticated: false,
                currentUser: null,
                lastLoginAt: null
            },
            quiz: {
                scores: { ...QUIZ_DEFAULT_SCORES },
                isFinished: false,
                currentQuestionIndex: 0,
                totalQuestions: 0,
                resultProfile: null,
                updatedAt: null
            }
        };
    }

    function normalizeEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    function readState() {
        const initialState = getInitialState();
        let savedState = PRIMARY_STORAGE.getItem(STORAGE_KEY);

        if (!savedState && PRIMARY_STORAGE !== window.sessionStorage) {
            const legacySessionState = window.sessionStorage.getItem(STORAGE_KEY);

            if (legacySessionState) {
                savedState = legacySessionState;
                PRIMARY_STORAGE.setItem(STORAGE_KEY, legacySessionState);
            }
        }

        if (!savedState) {
            return initialState;
        }

        try {
            const parsedState = JSON.parse(savedState);

            return {
                ...initialState,
                ...parsedState,
                users: Array.isArray(parsedState?.users) ? parsedState.users : [],
                auth: {
                    ...initialState.auth,
                    ...(parsedState?.auth || {})
                },
                quiz: {
                    ...initialState.quiz,
                    ...(parsedState?.quiz || {}),
                    scores: {
                        ...QUIZ_DEFAULT_SCORES,
                        ...(parsedState?.quiz?.scores || {})
                    }
                }
            };
        } catch (error) {
            return initialState;
        }
    }

    function saveState(state) {
        PRIMARY_STORAGE.setItem(STORAGE_KEY, JSON.stringify(state));
        syncLegacyQuizKeys(state.quiz);
        return state;
    }

    function syncLegacyQuizKeys(quizState) {
        if (!quizState) {
            return;
        }

        const serializedScores = JSON.stringify(quizState.scores || { ...QUIZ_DEFAULT_SCORES });
        const finishedValue = quizState.isFinished ? 'true' : 'false';

        window.localStorage.setItem(LEGACY_SCORE_KEY, serializedScores);
        window.localStorage.setItem(LEGACY_FINISHED_KEY, finishedValue);
        window.sessionStorage.setItem(LEGACY_SCORE_KEY, serializedScores);
        window.sessionStorage.setItem(LEGACY_FINISHED_KEY, finishedValue);
    }

    function sanitizeUser(user) {
        if (!user) {
            return null;
        }

        const { password, ...safeUser } = user;
        return safeUser;
    }

    function getUsers() {
        return readState().users.map(sanitizeUser);
    }

    function findUserByEmail(email) {
        const state = readState();
        const normalizedEmail = normalizeEmail(email);
        return state.users.find((user) => user.email === normalizedEmail) || null;
    }

    function registerUser(data) {
        const state = readState();
        const email = normalizeEmail(data.email);

        if (state.users.some((user) => user.email === email)) {
            return {
                success: false,
                message: 'Já existe uma conta cadastrada com este e-mail.'
            };
        }

        const now = new Date().toISOString();
        const newUser = {
            id: `user-${Date.now()}`,
            firstName: String(data.firstName || '').trim(),
            lastName: String(data.lastName || '').trim(),
            fullName: `${String(data.firstName || '').trim()} ${String(data.lastName || '').trim()}`.trim(),
            email,
            password: String(data.password || ''),
            acceptedTerms: Boolean(data.acceptedTerms),
            createdAt: now,
            updatedAt: now,
            preferences: data.preferences || {}
        };

        state.users.push(newUser);
        saveState(state);

        return {
            success: true,
            user: sanitizeUser(newUser),
            message: 'Conta cadastrada com sucesso.'
        };
    }

    function loginUser(email, password) {
        const state = readState();
        const normalizedEmail = normalizeEmail(email);
        const user = state.users.find((item) => item.email === normalizedEmail);

        if (!user) {
            return {
                success: false,
                message: 'Nenhuma conta foi encontrada com este e-mail.'
            };
        }

        if (user.password !== String(password || '')) {
            return {
                success: false,
                message: 'Senha incorreta. Tente novamente.'
            };
        }

        const now = new Date().toISOString();
        user.updatedAt = now;
        state.auth = {
            isAuthenticated: true,
            currentUser: sanitizeUser(user),
            lastLoginAt: now
        };

        saveState(state);

        return {
            success: true,
            user: sanitizeUser(user),
            message: 'Login realizado com sucesso.'
        };
    }

    function resetPasswordByEmail(email, newPassword) {
        const state = readState();
        const normalizedEmail = normalizeEmail(email);
        const user = state.users.find((item) => item.email === normalizedEmail);

        if (!user) {
            return {
                success: false,
                message: 'Nenhuma conta foi encontrada com este e-mail.'
            };
        }

        const password = String(newPassword || '');

        if (!password) {
            return {
                success: false,
                message: 'A nova senha não pode ficar vazia.'
            };
        }

        if (user.password === password) {
            return {
                success: false,
                message: 'A nova senha deve ser diferente da atual.'
            };
        }

        user.password = password;
        user.updatedAt = new Date().toISOString();
        saveState(state);

        return {
            success: true,
            user: sanitizeUser(user),
            message: 'Senha redefinida com sucesso.'
        };
    }

    function logout() {
        const state = readState();
        state.auth = {
            isAuthenticated: false,
            currentUser: null,
            lastLoginAt: null
        };
        saveState(state);
    }

    function getCurrentSession() {
        return readState().auth;
    }

    function isAuthenticated() {
        return Boolean(readState().auth.isAuthenticated);
    }

    function clearUserSession() {
        const state = readState();
        state.auth = {
            isAuthenticated: false,
            currentUser: null,
            lastLoginAt: null
        };
        saveState(state);
    }

    function getCurrentUser() {
        return readState().auth.currentUser || null;
    }

    function getQuizState() {
        const state = readState();
        return {
            ...state.quiz,
            scores: {
                ...QUIZ_DEFAULT_SCORES,
                ...(state.quiz?.scores || {})
            }
        };
    }

    function setQuizState(partialQuizState = {}) {
        const state = readState();
        state.quiz = {
            ...state.quiz,
            ...partialQuizState,
            scores: {
                ...QUIZ_DEFAULT_SCORES,
                ...(state.quiz?.scores || {}),
                ...(partialQuizState?.scores || {})
            },
            updatedAt: new Date().toISOString()
        };

        saveState(state);
        return state.quiz;
    }

    function resetQuizState() {
        return setQuizState({
            scores: { ...QUIZ_DEFAULT_SCORES },
            isFinished: false,
            currentQuestionIndex: 0,
            totalQuestions: 0,
            resultProfile: null
        });
    }

    function incrementQuizScore(profile) {
        const currentQuiz = getQuizState();
        const currentValue = currentQuiz.scores[profile] || 0;

        return setQuizState({
            scores: {
                ...currentQuiz.scores,
                [profile]: currentValue + 1
            }
        });
    }

    function finalizeQuiz(resultProfile = null) {
        return setQuizState({
            isFinished: true,
            resultProfile
        });
    }

    function clearQuizState() {
        return resetQuizState();
    }

    return {
        STORAGE_KEY,
        QUIZ_DEFAULT_SCORES,
        readState,
        saveState,
        getUsers,
        findUserByEmail,
        registerUser,
        loginUser,
        resetPasswordByEmail,
        logout,
        getCurrentSession,
        isAuthenticated,
        clearUserSession,
        getCurrentUser,
        getQuizState,
        setQuizState,
        resetQuizState,
        incrementQuizScore,
        finalizeQuiz,
        clearQuizState
    };
})();

window.SessionService = SessionService;
window.AuthStorage = {
    lerEstado: SessionService.readState,
    obterUsuarios: SessionService.getUsers,
    buscarUsuarioPorEmail: SessionService.findUserByEmail,
    registrarUsuario: SessionService.registerUser,
    autenticarUsuario: SessionService.loginUser,
    redefinirSenhaPorEmail: SessionService.resetPasswordByEmail,
    obterSessaoAtual: SessionService.getCurrentSession,
    usuarioEstaLogado: SessionService.isAuthenticated,
    sair: SessionService.logout,
    obterUsuarioAtual: SessionService.getCurrentUser,
    obterQuiz: SessionService.getQuizState,
    salvarQuiz: SessionService.setQuizState,
    resetarQuiz: SessionService.resetQuizState
};
