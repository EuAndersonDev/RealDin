const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_API_KEY = "re_HL8m8RYB_MMnK9ZamYQaWL7hFU5sLaHxc";
const RESEND_FROM_EMAIL = "onboarding@resend.dev";
const CONTACT_TO_EMAIL = "andersonaugustorei1227@gmail.com";

function json(res, statusCode, payload) {
    res.status(statusCode).setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return json(res, 405, {
            ok: false,
            message: "Metodo nao permitido.",
        });
    }

    const apiKey = RESEND_API_KEY;
    const from = RESEND_FROM_EMAIL;
    const to = CONTACT_TO_EMAIL;

    const body = req.body || {};
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
        return json(res, 400, {
            ok: false,
            message: "Preencha nome, e-mail e mensagem.",
        });
    }

    if (!EMAIL_REGEX.test(email)) {
        return json(res, 400, {
            ok: false,
            message: "E-mail invalido.",
        });
    }

    try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from,
                to: [to],
                subject: `Novo contato RealDin - ${name}`,
                reply_to: email,
                text: [
                    "Nova mensagem enviada pelo formulario de contato.",
                    "",
                    `Nome: ${name}`,
                    `Email: ${email}`,
                    "",
                    "Mensagem:",
                    message,
                ].join("\n"),
            }),
        });

        const resendBody = await resendResponse.json().catch(() => ({}));

        if (!resendResponse.ok) {
            const messageErro =
                resendBody?.message || "Falha ao enviar e-mail com a API do Resend.";

            return json(res, resendResponse.status || 502, {
                ok: false,
                message: messageErro,
            });
        }

        return json(res, 200, {
            ok: true,
            id: resendBody?.id || null,
            message: "E-mail enviado com sucesso.",
        });
    } catch (error) {
        return json(res, 500, {
            ok: false,
            message: "Erro interno ao enviar o e-mail. Tente novamente.",
        });
    }
};
