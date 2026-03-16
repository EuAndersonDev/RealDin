document.addEventListener('DOMContentLoaded', () => {
    console.log('[Resultado] Página carregada, preparando renderização do perfil.');
    const session = window.SessionService;
    const IMAGEM_FIXA_PERFIL_USER = '../assets/icons/resultados/Porco.svg';
    const perfis = {
        Poupador: {
            descricao: 'Você é cauteloso e disciplinado: pensa antes de gastar e prioriza a segurança financeira. Essa consistência é um ativo valioso, mas o excesso de cautela pode fazer seu dinheiro perder para a inflação. Guardar é o primeiro passo — o próximo é fazer o dinheiro trabalhar por você. Invista a disciplina que já tem em uma estratégia de crescimento.',
            imagem: '../assets/icons/resultados/Poupador.svg',
            acoes: [
                'Abra uma conta em uma corretora e comece com Tesouro Selic ou CDBs de liquidez diária.',
                'Defina um percentual fixo da renda (ex: 20%) para investir automaticamente todo mês.',
                'Diversifique: conheça fundos de índice (ETFs) como introdução à renda variável.',
                'Revise sua reserva de emergência anualmente e direcione o excedente para investimentos.',
                'Estude a diferença entre poupar e investir — o tempo é seu maior aliado.'
            ],
            xray: [
                { label: 'Orçamento', texto: 'Acompanha os gastos com regularidade e raramente é surpreendido por contas inesperadas. Sabe onde cada real foi parar e consegue identificar rapidamente quando algo foge do planejado. Essa disciplina diária é o que separa quem tem controle de quem apenas acredita ter.' },
                { label: 'Reserva', texto: 'Já tem ou está construindo uma reserva sólida, e tende a manter esse hábito mesmo sob pressão financeira. O que garante tranquilidade diante de imprevistos não é a sorte — é exatamente esse comportamento consistente que você já pratica.' },
                { label: 'Dívidas', texto: 'Evita parcelamentos longos e não usa o cartão como extensão da renda. Prefere esperar para comprar à vista do que comprometer o orçamento futuro com juros. Essa escolha, repetida ao longo do tempo, representa uma economia significativa.' },
                { label: 'Planejamento', texto: 'Compara preços, pesquisa antes de decidir e guarda para conquistas futuras em vez de gastar no impulso. Tem clareza sobre prioridades e age de forma intencional com o dinheiro. O próximo passo é transformar essa disciplina em estratégia de crescimento patrimonial.' }
            ]
        },
        Gastador: {
            descricao: 'Você valoriza o presente e tende a consumir por impulso ou emoção. Aproveitar a vida não é problema — o risco está quando os gastos comprometem o futuro sem que você perceba. Pequenas mudanças de hábito, feitas gradualmente, já geram resultados expressivos. O objetivo não é cortar tudo, mas entender para onde o dinheiro vai.',
            imagem: '../assets/icons/resultados/Gastador.svg',
            acoes: [
                'Anote todos os gastos por 30 dias — os resultados vão te surpreender.',
                'Adote a regra das 48h: antes de compras não planejadas acima de R$100, espere dois dias.',
                'Crie uma conta separada para gastos variáveis com limite mensal definido.',
                'Substitua o cartão de crédito por débito nas categorias onde mais gasta.',
                'Defina uma meta financeira de curto prazo (3 a 6 meses) para criar foco e propósito.'
            ],
            xray: [
                { label: 'Orçamento', texto: 'Há pouca previsibilidade entre o que entra e o que sai. Os fins de mês costumam ser mais tensos do que deveriam, muitas vezes por gastos que pareciam pequenos isoladamente mas somam um valor surpreendente ao final do mês.' },
                { label: 'Reserva', texto: 'Construir uma reserva de emergência ainda não virou prioridade real. O dinheiro vai embora antes de ser guardado, deixando pouca margem para imprevistos — e quando eles aparecem, a saída costuma ser o crédito.' },
                { label: 'Dívidas', texto: 'Parcelamentos e fatura do cartão podem crescer silenciosamente até virar uma bola de neve difícil de controlar. O problema não é o crédito em si, mas a falta de consciência sobre o impacto acumulado dessas decisões ao longo do tempo.' },
                { label: 'Planejamento', texto: 'O foco está no consumo imediato, com pouca atenção ao impacto financeiro de médio e longo prazo. Decisões são tomadas pelo prazer do momento, não pelo objetivo futuro — e isso vai adiando conquistas importantes que poderiam já estar acontecendo.' }
            ]
        },
        Descontrolado: {
            descricao: 'Você sabe que precisa se organizar e até tenta — mas os planos não se sustentam por muito tempo. A rotina engole o controle e o ciclo recomeça. O que falta não é vontade, é um sistema simples que não dependa de força de vontade todos os dias. Automatizar e simplificar são as chaves para quebrar esse padrão.',
            imagem: '../assets/icons/resultados/Descontrolado.svg',
            acoes: [
                'Use um único app de finanças (ex: Mobills ou Organizze) em vez de planilhas complexas.',
                'Automatize: débito automático para contas fixas e transferência programada para reserva.',
                'Reserve 10 minutos todo domingo para revisar os gastos da semana.',
                'Controle primeiro uma única categoria (ex: alimentação) antes de expandir o monitoramento.',
                'Identifique o que costuma quebrar sua organização e prepare uma resposta antecipada.'
            ],
            xray: [
                { label: 'Orçamento', texto: 'Você começa a controlar com entusiasmo, mas perde o ritmo após algumas semanas. O acompanhamento não vira rotina, os registros ficam incompletos ou abandonados — e sem dados, não há como saber se está avançando ou retrocedendo.' },
                { label: 'Reserva', texto: 'A reserva existe como intenção, mas costuma ser usada antes de atingir o valor planejado. A falta de consistência impede que ela cresça de verdade, mantendo você sempre vulnerável a qualquer imprevisto que apareça.' },
                { label: 'Dívidas', texto: 'O risco de atrasos vem da falta de organização, não de falta de renda. Pequenas desatenções geram juros evitáveis que se acumulam silenciosamente, corroendo o orçamento sem que você sinta de onde está vazando o dinheiro.' },
                { label: 'Planejamento', texto: 'Faltam metas simples e revisões periódicas. Os planos existem, mas não têm prazo nem acompanhamento real — e acabam ficando só na intenção. Um sistema mínimo e automatizado vale mais do que o plano perfeito que nunca sai do papel.' }
            ]
        },
        Desligado: {
            descricao: 'Você evita lidar com finanças — por ansiedade, por não saber por onde começar, ou por achar que não é pra você. O resultado: decisões adiadas, dívidas crescendo em silêncio e oportunidades perdidas. O risco desse perfil é invisível, mas real. Uma pequena ação por semana já é suficiente para começar a mudar esse padrão.',
            imagem: '../assets/icons/resultados/Desligado.svg',
            acoes: [
                'Dedique 15 minutos esta semana para listar suas despesas fixas mensais — sem julgamento.',
                'Baixe o extrato do banco e identifique as três maiores categorias de gasto.',
                'Configure alertas de vencimento para todas as contas e faturas.',
                'Escolha um podcast ou canal no YouTube sobre finanças pessoais básicas.',
                'Converse com um familiar de confiança ou educador financeiro para dar o primeiro passo.'
            ],
            xray: [
                { label: 'Orçamento', texto: 'Pouca visibilidade sobre os gastos mensais. Você raramente sabe ao certo quanto gastou ou onde o dinheiro foi, o que torna impossível identificar onde cortar ou o que mudar para melhorar a situação financeira.' },
                { label: 'Reserva', texto: 'Reserva de emergência inexistente ou sem nenhum progresso acompanhado. Qualquer imprevisto vira uma crise financeira que poderia ter sido evitada — e a ausência de reserva força decisões ruins sob pressão.' },
                { label: 'Dívidas', texto: 'Juros e vencimentos passam despercebidos com frequência, fazendo o saldo devedor crescer sem que você perceba. Quando a situação finalmente aparece, o valor já é muito maior do que teria sido com um pouco de atenção.' },
                { label: 'Planejamento', texto: 'As decisões são reativas — você age quando o problema já chegou, sem antecipação ou metas definidas. O futuro financeiro fica à mercê dos acontecimentos, e oportunidades importantes passam enquanto o foco está apagando incêndios.' }
            ]
        },
        Financista: {
            descricao: 'Você tem visão estratégica sobre o próprio dinheiro: não gasta por impulso, não evita o tema e trabalha com sistema. Entende que crédito é ferramenta, risco é calculado e crescimento vem da consistência. Seu próximo passo é aprofundar: diversificação de patrimônio, proteção contra inflação e construção de renda passiva.',
            imagem: '../assets/icons/resultados/Financista.svg',
            acoes: [
                'Revise sua alocação entre renda fixa, variável e ativos internacionais.',
                'Estude proteção patrimonial: seguros, previdência privada e planejamento sucessório.',
                'Defina uma meta de independência financeira com data e valor concretos.',
                'Explore fundos imobiliários, ações de dividendos ou renda no exterior.',
                'Ensine finanças a pessoas próximas — compartilhar conhecimento solidifica o seu.'
            ],
            xray: [
                { label: 'Orçamento', texto: 'Estrutura gastos por categorias com limites conscientes e acompanha os resultados mensalmente. Sabe exatamente onde está e para onde quer chegar — e usa esses dados para tomar decisões melhores a cada ciclo.' },
                { label: 'Reserva', texto: 'Mantém reserva adequada e a ajusta conforme a renda e o estilo de vida evoluem. A reserva não é estática — é parte ativa do planejamento, calibrada para cobrir de 6 a 12 meses de despesas com conforto.' },
                { label: 'Dívidas', texto: 'Usa crédito com intencionalidade, somente quando o retorno justifica o custo. Nunca contrai dívida para consumo impulsivo ou por falta de planejamento — o crédito é uma ferramenta, não uma muleta.' },
                { label: 'Planejamento', texto: 'Trabalha com metas de curto, médio e longo prazo, revisando periodicamente com base em dados reais. O plano é vivo e se adapta à realidade — e é exatamente essa flexibilidade disciplinada que gera crescimento consistente ao longo do tempo.' }
            ]
        }
    };

    const prioridadeEmpate = ['Financista', 'Poupador', 'Gastador', 'Descontrolado', 'Desligado'];
    const pontuacaoPadrao = {
        Poupador: 0,
        Gastador: 0,
        Descontrolado: 0,
        Desligado: 0,
        Financista: 0
    };

    function lerPontuacao() {
        if (session?.getQuizState) {
            const scores = session.getQuizState().scores || {};
            console.log('[Resultado] Pontuação lida do SessionService:', scores);
            return { ...pontuacaoPadrao, ...scores };
        }

        const salvo = sessionStorage.getItem('pontuacao');
        if (!salvo) {
            console.log('[Resultado] Nenhuma pontuação encontrada. Usando padrão.');
            return { ...pontuacaoPadrao };
        }

        try {
            const lido = JSON.parse(salvo);
            console.log('[Resultado] Pontuação lida do sessionStorage:', lido);
            return { ...pontuacaoPadrao, ...lido };
        } catch (error) {
            console.error('[Resultado] Erro ao ler pontuação. Usando padrão.', error);
            return { ...pontuacaoPadrao };
        }
    }

    function obterPerfilFinal(pontuacao) {
        const maiorValor = Math.max(...Object.values(pontuacao));
        const empatados = prioridadeEmpate.filter((perfil) => pontuacao[perfil] === maiorValor);
        console.log('[Resultado] Cálculo de perfil final:', {
            maiorValor,
            empatados,
            prioridadeEmpate
        });
        return empatados[0] || 'Poupador';
    }

    function renderizarXray(lista, itens) {
        lista.innerHTML = '';
        console.log('[Resultado] Renderizando raio-X com itens:', itens.length);

        itens.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'xray-item';

            const img = document.createElement('img');
            img.className = 'xray-icone';
            img.src = '../assets/icons/resultados/Cifrao.svg';
            img.alt = '';
            img.setAttribute('aria-hidden', 'true');

            const p = document.createElement('p');
            p.className = 'xray-texto';

            const span = document.createElement('span');
            span.className = 'xray-label';
            span.textContent = `${item.label}:`;

            p.appendChild(span);
            p.append(` ${item.texto}`);
            li.appendChild(img);
            li.appendChild(p);
            lista.appendChild(li);
        });
    }

    function renderizarAcoes(dadosPerfil) {
        const listaAcoes = document.querySelector('ul.acoes-lista');
        if (!listaAcoes || !dadosPerfil.acoes) return;

        listaAcoes.innerHTML = '';
        console.log('[Resultado] Renderizando ações recomendadas:', dadosPerfil.acoes.length);

        dadosPerfil.acoes.forEach((acao, index) => {
            const li = document.createElement('li');
            li.className = 'acao-item';

            const numero = document.createElement('span');
            numero.className = 'acao-numero';
            numero.textContent = String(index + 1).padStart(2, '0');

            const texto = document.createElement('p');
            texto.className = 'acao-texto';
            texto.textContent = acao;

            li.appendChild(numero);
            li.appendChild(texto);
            listaAcoes.appendChild(li);
        });
    }

    function renderizarResultado() {
        const titulo = document.querySelector('h1.personalidade-do-user');
        const descricao = document.querySelector('p.personalidade-descricao');
        const imagem = document.querySelector('img.personalidade-imagem');
        const listaXray = document.querySelector('ul.xray-lista');

        if (!titulo || !descricao || !imagem || !listaXray) {
            console.warn('[Resultado] Elementos de destino não encontrados no HTML.');
            return;
        }

        const pontuacao = lerPontuacao();
        const perfilFinal = obterPerfilFinal(pontuacao);
        const dadosPerfil = perfis[perfilFinal] || perfis.Poupador;

        if (session?.finalizeQuiz) {
            session.finalizeQuiz(perfilFinal);
        }

        console.log('[Resultado] Perfil final selecionado:', perfilFinal);

        titulo.textContent = perfilFinal;
        descricao.textContent = dadosPerfil.descricao;
        imagem.src = IMAGEM_FIXA_PERFIL_USER;
        imagem.alt = 'Foto de perfil do usuario';

        renderizarXray(listaXray, dadosPerfil.xray);
        renderizarAcoes(dadosPerfil);
        console.log('[Resultado] Resultado renderizado com sucesso.');
    }

    function configurarBannerAcesso() {
        const auth = window.AuthContext?.getState ? window.AuthContext.getState() : { isAuthenticated: false };
        if (auth.isAuthenticated) {
            return;
        }

        const banner = document.getElementById('auth-required-banner');
        const botao = document.getElementById('btn-ir-login-resultado');

        if (!banner || !botao) {
            return;
        }

        banner.style.display = 'block';
        botao.addEventListener('click', () => {
            window.location.href = '/pages/login.html?redirect=/pages/indicacoes.html';
        });
    }

    renderizarResultado();
    configurarBannerAcesso();
});
