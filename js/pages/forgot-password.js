const form           = document.getElementById('forgotForm');
      const successMessage = document.getElementById('successMessage');
      const sentEmail      = document.getElementById('sentEmail');
      const emailInput     = document.getElementById('email');

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Captura o e-mail digitado para exibir no feedback
        const email = emailInput.value.trim();

        // Esconde o formulário
        form.style.display = 'none';

        // Exibe o e-mail no feedback e mostra a mensagem de sucesso
        sentEmail.textContent = email;
        successMessage.classList.add('visible');
      });