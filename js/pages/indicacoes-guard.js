document.addEventListener('DOMContentLoaded', () => {
    if (!window.AuthGuard?.requireAuth) {
        return;
    }

    window.AuthGuard.requireAuth();
});
