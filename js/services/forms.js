window.AuthStorage = window.AuthStorage || window.SessionService || null;

(() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const CONTACT_TO_EMAIL = "andersonaugustorei1227@gmail.com";
    const WEB3FORMS_ACCESS_KEY = "37df4a24-5597-4e22-ab25-ba1dabaa1534";
    const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
    let envioEmAndamento = false;

    function mostrarToast(mensagem, tipo = "info", opcoes = {}) {
        if (window.Toast?.show) {
            window.Toast.show(mensagem, tipo, opcoes);
            return;
        }

        window.alert(mensagem);
    }

    function validarEmail(email) {
        return EMAIL_REGEX.test(String(email || "").trim());
    }

    function obterCampos(form) {
        const nome = form.querySelector("#contato-nome");
        const email = form.querySelector("#contato-email-input");
        const mensagem = form.querySelector("#contato-mensagem");
        const botao = form.querySelector('button[type="submit"]');

        return { nome, email, mensagem, botao };
    }

    function setEstadoBotao(botao, carregando) {
        if (!botao) {
            return;
        }

        if (carregando) {
            botao.dataset.textoOriginal = botao.textContent;
            botao.textContent = "Enviando...";
            botao.disabled = true;
            return;
        }

        botao.textContent = botao.dataset.textoOriginal || "Enviar";
        botao.disabled = false;
    }

    async function enviarContato(payload) {
        if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "COLE_SUA_CHAVE_WEB3FORMS_AQUI") {
            throw new Error("Configure a chave do Web3Forms no forms.js para habilitar o envio.");
        }

        const resposta = await fetch(WEB3FORMS_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                from_name: payload.name,
                email: payload.email,
                message: payload.message,
                _subject: `Novo contato RealDin - ${payload.name}`,
                to_email: CONTACT_TO_EMAIL,
            }),
        });

        const dados = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(dados?.message || "Falha ao enviar e-mail.");
        }

        if (String(dados?.success).toLowerCase() === "false") {
            throw new Error(dados?.message || "Falha ao enviar e-mail.");
        }

        return dados;
    }

    function initContatoForm() {
        const form = document.getElementById("contato-formulario");

        if (!form) {
            return;
        }

        const { nome, email, mensagem, botao } = obterCampos(form);

        if (!nome || !email || !mensagem) {
            return;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (envioEmAndamento) {
                mostrarToast("Aguarde alguns segundos antes de enviar novamente.", "warning");
                return;
            }

            const nomeValor = nome.value.trim();
            const emailValor = email.value.trim();
            const mensagemValor = mensagem.value.trim();

            if (!nomeValor || !emailValor || !mensagemValor) {
                mostrarToast("Preencha nome, e-mail e mensagem para continuar.", "warning");
                return;
            }

            if (!validarEmail(emailValor)) {
                mostrarToast("E-mail inválido. Revise e tente novamente.", "error");
                return;
            }

            try {
                envioEmAndamento = true;
                setEstadoBotao(botao, true);

                mostrarToast("Enviando sua mensagem. Aguarde alguns segundos...", "info", {
                    duracao: 2800,
                });

                await enviarContato({
                    name: nomeValor,
                    email: emailValor,
                    message: mensagemValor,
                });

                mostrarToast("E-mail enviado com sucesso. Obrigado pelo contato!", "success");
                form.reset();
            } catch (erro) {
                const mensagemErro =
                    erro?.name === "TypeError"
                        ? "Falha de rede ao tentar enviar. Verifique sua conexao e tente novamente."
                        : erro?.message || "Não foi possível enviar o e-mail no momento.";

                mostrarToast(
                    mensagemErro,
                    "error",
                );
            } finally {
                envioEmAndamento = false;
                setEstadoBotao(botao, false);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initContatoForm, { once: true });
        return;
    }

    initContatoForm();
})();
