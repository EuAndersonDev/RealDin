document.addEventListener('DOMContentLoaded', () => {
  const perfis = {
    Poupador: {
      descricao: 'Você é cauteloso e prioriza a segurança financeira antes de gastar.',
      imagem: '../assets/icons/resultados/Poupador.svg',
      xray: [
        { label: 'Orçamento', texto: 'Você acompanha seus gastos com regularidade.' },
        { label: 'Reserva', texto: 'Tende a ter ou construir uma reserva de emergência.' },
        { label: 'Dívidas', texto: 'Evita parcelamentos e dívidas desnecessárias.' },
        { label: 'Planejamento', texto: 'Pensa antes de gastar e prefere guardar.' }
      ]
    },
    Gastador: {
      descricao: 'Você valoriza o presente e tende a consumir por impulso, o que pode comprometer seu equilíbrio financeiro.',
      imagem: '../assets/icons/resultados/Gastador.svg',
      xray: [
        { label: 'Orçamento', texto: 'Há pouca previsibilidade entre entrada e saída de dinheiro.' },
        { label: 'Reserva', texto: 'A construção de reserva ainda não virou prioridade.' },
        { label: 'Dívidas', texto: 'Parcelamentos e cartão podem virar bola de neve.' },
        { label: 'Planejamento', texto: 'Seu foco está no curto prazo e no consumo imediato.' }
      ]
    },
    Descontrolado: {
      descricao: 'Você tenta se organizar, mas perde o controle com frequência e tem dificuldade em manter constância.',
      imagem: '../assets/icons/resultados/Descontrolado.svg',
      xray: [
        { label: 'Orçamento', texto: 'Você inicia controles, porém não mantém rotina de acompanhamento.' },
        { label: 'Reserva', texto: 'A reserva existe em intenção, mas sem consistência.' },
        { label: 'Dívidas', texto: 'Risco de atraso por falta de organização recorrente.' },
        { label: 'Planejamento', texto: 'Faltam metas simples e revisão periódica dos gastos.' }
      ]
    },
    Desligado: {
      descricao: 'Você evita lidar com finanças e deixa decisões para depois, o que pode gerar riscos silenciosos.',
      imagem: '../assets/icons/resultados/Desligado.svg',
      xray: [
        { label: 'Orçamento', texto: 'Pouca visibilidade de gastos e compromissos mensais.' },
        { label: 'Reserva', texto: 'Reserva inexistente ou sem acompanhamento do progresso.' },
        { label: 'Dívidas', texto: 'Pode não perceber juros e vencimentos a tempo.' },
        { label: 'Planejamento', texto: 'As decisões são reativas, sem metas claras.' }
      ]
    },
    Financista: {
      descricao: 'Você tem visão estratégica, controla riscos e toma decisões com foco em crescimento sustentável.',
      imagem: '../assets/icons/resultados/Financista.svg',
      xray: [
        { label: 'Orçamento', texto: 'Você estrutura gastos por categorias e acompanha resultados.' },
        { label: 'Reserva', texto: 'Mantém reserva e atualiza o valor conforme sua realidade.' },
        { label: 'Dívidas', texto: 'Usa crédito com intencionalidade e custo controlado.' },
        { label: 'Planejamento', texto: 'Trabalha com metas, prazos e revisão contínua.' }
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
    const salvo = sessionStorage.getItem('pontuacao');
    if (!salvo) {
      return { ...pontuacaoPadrao };
    }

    try {
      const lido = JSON.parse(salvo);
      return { ...pontuacaoPadrao, ...lido };
    } catch (error) {
      return { ...pontuacaoPadrao };
    }
  }

  function obterPerfilFinal(pontuacao) {
    const maiorValor = Math.max(...Object.values(pontuacao));
    const empatados = prioridadeEmpate.filter((perfil) => pontuacao[perfil] === maiorValor);
    return empatados[0] || 'Poupador';
  }

  function renderizarXray(lista, itens) {
    lista.innerHTML = '';

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

  function renderizarResultado() {
    const titulo = document.querySelector('h1.personalidade-do-user');
    const descricao = document.querySelector('p.personalidade-descricao');
    const imagem = document.querySelector('img.personalidade-imagem');
    const listaXray = document.querySelector('ul.xray-lista');

    if (!titulo || !descricao || !imagem || !listaXray) {
      return;
    }

    const pontuacao = lerPontuacao();
    const perfilFinal = obterPerfilFinal(pontuacao);
    const dadosPerfil = perfis[perfilFinal] || perfis.Poupador;

    titulo.textContent = perfilFinal;
    descricao.textContent = dadosPerfil.descricao;
    imagem.src = dadosPerfil.imagem;
    imagem.alt = `Perfil ${perfilFinal}`;

    renderizarXray(listaXray, dadosPerfil.xray);
  }

  renderizarResultado();
});
