document.addEventListener('DOMContentLoaded', () => {

    // Abre o modal ao clicar no card
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            } else {
                console.warn(`Modal não encontrado: ${modalId}`);
            }
        });
    });

    // Fecha ao clicar no botão "Fechar"
    document.addEventListener('click', e => {
        if (e.target.matches('.modal-close')) {
            const dlg = e.target.closest('dialog');
            if (dlg) dlg.close();
        }
    });

    // Fecha ao clicar em Cancelar ou Confirmar
    document.addEventListener('click', e => {
        if (e.target.matches('.modal-button-cancel') || e.target.matches('.modal-button-confirm') || e.target.closest('.modal-button-cancel') || e.target.closest('.modal-button-confirm')) {
            const dlg = e.target.closest('dialog');
            if (dlg) dlg.close();
        }
    });

    // Fecha ao clicar fora do modal (no backdrop)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.close();
        });
    });

});